import Lenis from 'lenis'
import Snap from 'lenis/snap'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { prefersReducedMotion } from '../motion/preferences'
import { setupModelsDiagram } from './setupModelsZoom'
import { setupPipelineZooms } from './pipelineNavigation'

gsap.registerPlugin(ScrollTrigger)

const deckEase = (t: number) => 1 - Math.pow(1 - t, 4)

const deckSections = [
  { label: 'Projet', startId: 'robot-2' },
  { label: 'Contexte & objectifs', startId: 'enjeu' },
  { label: 'Architecture & conception', startId: 'cellule' },
  { label: 'Chaîne numérique & commande', startId: 'cao-parametrique' },
  { label: 'Résultats & livrables', startId: 'cycle' },
] as const

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest('a, button, input, textarea, select, [contenteditable="true"]'))
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0')
}

export function setupDeck(): () => void {
  const root = document.documentElement
  const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'))
  const rail = document.querySelector<HTMLElement>('[data-deck-rail]')
  const sectionsNav = document.querySelector<HTMLElement>('[data-deck-sections]')
  const chapter = document.querySelector<HTMLElement>('[data-deck-chapter]')
  const current = document.querySelector<HTMLElement>('[data-slide-current]')
  const total = document.querySelector<HTMLElement>('[data-slide-total]')
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const params = new URLSearchParams(window.location.search)
  const requestedHash = window.location.hash
  const captureId = params.get('capture')
  const captureIndex = captureId ? slides.findIndex((slide) => slide.id === captureId) : -1
  const captureMode = captureIndex >= 0
  const motionOff = params.get('motion') === 'off' || captureMode
  const reducedMotion = prefersReducedMotion() || motionOff
  const deckLayout = window.matchMedia('(min-aspect-ratio: 4 / 5)').matches
  const disposers: Array<() => void> = []

  if (!slides.length) return () => undefined

  root.classList.toggle('is-debug', params.get('debug') === '1')
  root.classList.toggle('is-motion-off', motionOff)
  root.classList.toggle('is-reduced-motion', reducedMotion)
  root.classList.toggle('is-capture', captureMode)
  if (captureMode) slides[captureIndex].classList.add('is-capture-target')
  if (total) total.textContent = formatIndex(slides.length - 1)

  const sectionStops = deckSections
    .map((section) => ({ ...section, start: slides.findIndex((slide) => slide.id === section.startId) }))
    .filter((section) => section.start >= 0)
  const sectionButtons = sectionStops.map((section) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = section.label
    button.dataset.deckSectionStart = String(section.start)
    sectionsNav?.append(button)
    return button
  })

  let activeIndex = -1
  let lenis: Lenis | null = null
  let snap: Snap | null = null

  const buttons = slides.map((slide, index) => {
    const button = document.createElement('button')
    const title = slide.dataset.title ?? `Diapositive ${index + 1}`
    button.type = 'button'
    button.setAttribute('aria-label', `${formatIndex(index)} · ${title}`)
    button.dataset.deckIndex = String(index)
    rail?.append(button)
    return button
  })

  const setActive = (index: number, announce = true) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index))
    if (nextIndex === activeIndex) return
    const previousIndex = activeIndex
    activeIndex = nextIndex
    const slide = slides[nextIndex]
    slides.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === nextIndex))
    buttons.forEach((button, buttonIndex) => {
      if (buttonIndex === nextIndex) button.setAttribute('aria-current', 'true')
      else button.removeAttribute('aria-current')
    })
    let activeSection = 0
    sectionStops.forEach((section, sectionIndex) => {
      if (section.start <= nextIndex) activeSection = sectionIndex
    })
    sectionButtons.forEach((button, sectionIndex) => {
      if (sectionIndex === activeSection) {
        button.setAttribute('aria-current', 'step')
        if (sectionsNav && sectionsNav.scrollWidth > sectionsNav.clientWidth) {
          const left = button.offsetLeft - (sectionsNav.clientWidth - button.clientWidth) / 2
          sectionsNav.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' })
        }
      } else button.removeAttribute('aria-current')
    })
    root.dataset.chromeTheme = slide.dataset.theme ?? 'light'
    if (chapter) chapter.textContent = slide.dataset.chapter ?? ''
    if (current) current.textContent = formatIndex(nextIndex)
    if (announce && live) live.textContent = `Diapositive ${nextIndex + 1} sur ${slides.length} : ${slide.dataset.title ?? ''}`
    window.dispatchEvent(new CustomEvent('deck:slide-active', { detail: { id: slide.id, index: nextIndex, previousIndex, direction: Math.sign(nextIndex - previousIndex) } }))
    const nextHash = `#${slide.id}`
    if (window.location.hash !== nextHash) history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`)
  }

  const syncFromScroll = (scrollY: number, limit: number) => {
    if (captureMode) {
      setActive(captureIndex, false)
      root.style.setProperty('--scroll-progress', String(captureIndex / (slides.length - 1)))
      return
    }
    setActive(Math.round(scrollY / Math.max(window.innerHeight, 1)))
    const progress = limit > 0 ? Math.min(1, Math.max(0, scrollY / limit)) : 0
    root.style.setProperty('--scroll-progress', String(progress))
  }

  const prepareSnap = (from: number, to: number) => {
    if (!snap) return
    const immersive = Math.abs(from - to) === 1
      && Boolean(slides[from]?.dataset.pipelineSlide && slides[to]?.dataset.pipelineSlide)
    snap.options.duration = immersive ? (Math.min(from, to) === slides.findIndex(slide => slide.id === 'chaine-numerique') ? 1.25 : 1.8) : .72
    snap.options.easing = immersive ? (t: number) => t : deckEase
  }

  const goTo = (index: number, immediate = false) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index))
    prepareSnap(activeIndex, nextIndex)
    setActive(nextIndex)
    if (lenis) {
      if (snap && !immediate) snap.goTo(nextIndex)
      else lenis.scrollTo(slides[nextIndex], { immediate, duration: 0.72, easing: deckEase, lock: !immediate })
    } else {
      slides[nextIndex].scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }

  const onRailClick = (event: Event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-deck-index]')
    if (button) goTo(Number(button.dataset.deckIndex))
  }
  rail?.addEventListener('click', onRailClick)
  disposers.push(() => rail?.removeEventListener('click', onRailClick))

  const onSectionClick = (event: Event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-deck-section-start]')
    if (button) goTo(Number(button.dataset.deckSectionStart))
  }
  sectionsNav?.addEventListener('click', onSectionClick)
  disposers.push(() => sectionsNav?.removeEventListener('click', onSectionClick))

  document.querySelectorAll<HTMLElement>('[data-deck-link]').forEach((link) => {
    const onClick = (event: Event) => {
      event.preventDefault()
      goTo(Number(link.dataset.deckLink ?? 0))
    }
    link.addEventListener('click', onClick)
    disposers.push(() => link.removeEventListener('click', onClick))
  })

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isInteractiveTarget(event.target)) return
    let destination: number | null = null
    if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key)) destination = activeIndex + 1
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) destination = activeIndex - 1
    if (event.key === ' ') destination = activeIndex + (event.shiftKey ? -1 : 1)
    if (event.key === 'Home') destination = 0
    if (event.key === 'End') destination = slides.length - 1
    if (event.key.toLowerCase() === 'f') {
      event.preventDefault()
      if (!document.fullscreenElement) void document.documentElement.requestFullscreen()
      else void document.exitFullscreen()
      return
    }
    if (destination === null) return
    event.preventDefault()
    goTo(destination)
  }
  window.addEventListener('keydown', onKeyDown)
  disposers.push(() => window.removeEventListener('keydown', onKeyDown))

  const onHashChange = () => {
    const index = slides.findIndex((slide) => `#${slide.id}` === window.location.hash)
    if (index >= 0) goTo(index)
  }
  window.addEventListener('hashchange', onHashChange)
  disposers.push(() => window.removeEventListener('hashchange', onHashChange))

  if (!reducedMotion && deckLayout) {
    lenis = new Lenis({ anchors: false, autoRaf: false, smoothWheel: true, syncTouch: false, wheelMultiplier: 0.92 })
    // Register before Snap so wheel and keyboard share the camera pacing.
    lenis.on('virtual-scroll', ({ deltaY }) => {
      const from = Math.round((lenis?.scroll ?? window.scrollY) / window.innerHeight)
      prepareSnap(from, from + Math.sign(deltaY))
    })
    snap = new Snap(lenis, { type: 'lock', distanceThreshold: '100%', debounce: 0, duration: 0.72, easing: deckEase })
    snap.addElements(slides, { align: 'start' })
    lenis.on('scroll', ({ scroll, limit }) => {
      ScrollTrigger.update()
      syncFromScroll(scroll, limit)
    })
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    disposers.push(() => gsap.ticker.remove(tick))
  } else {
    const onNativeScroll = () => {
      const marker = window.scrollY + window.innerHeight * 0.42
      let nearest = 0
      slides.forEach((slide, index) => {
        if (slide.offsetTop <= marker) nearest = index
      })
      setActive(nearest)
      const limit = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty('--scroll-progress', String(limit > 0 ? Math.min(1, Math.max(0, window.scrollY / limit)) : 0))
    }
    window.addEventListener('scroll', onNativeScroll, { passive: true })
    disposers.push(() => window.removeEventListener('scroll', onNativeScroll))
  }

  disposers.push(setupModelsDiagram())
  const motionContext = gsap.context(() => {
    if (reducedMotion) {
      gsap.set('[data-reveal], [data-visual], [data-pipeline-visual]', { clearProps: 'all' })
      gsap.set('.pipeline-wire, .ce-pipeline__wire', { strokeDashoffset: 0 })
      return
    }
    const firstSlide = slides[0]
    gsap.from(firstSlide.querySelectorAll('[data-reveal]'), { autoAlpha: 0, y: 34, duration: 1.05, stagger: 0.09, ease: 'power3.out' })
    gsap.from(firstSlide.querySelectorAll('[data-visual]'), { autoAlpha: 0, scale: 1.035, duration: 1.35, ease: 'power3.out' })
    slides.slice(1).forEach((slide) => {
      if (slide.dataset.pipelineNode !== undefined) return
      const reveals = slide.querySelectorAll('[data-reveal]')
      const visuals = slide.querySelectorAll('[data-visual]')
      if (reveals.length) gsap.fromTo(reveals, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, stagger: 0.055, ease: 'none', scrollTrigger: { trigger: slide, start: 'top 92%', end: 'top 48%', scrub: 0.35 } })
      if (visuals.length) gsap.fromTo(visuals, { autoAlpha: 0.25, scale: 1.035 }, { autoAlpha: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: slide, start: 'top 96%', end: 'top 42%', scrub: 0.45 } })
    })
    const pipelineOverview = document.querySelector<HTMLElement>('[data-pipeline-slide="overview"]')
    if (pipelineOverview) {
      const foundation = pipelineOverview.querySelectorAll<SVGElement>('[data-ce-foundation]')
      const sequence = Array.from(pipelineOverview.querySelectorAll<SVGElement>('[data-ce-seq]'))
        .sort((a, b) => Number(a.dataset.ceSeq) - Number(b.dataset.ceSeq))
      const overviewTimeline = gsap.timeline({ scrollTrigger: { trigger: pipelineOverview, start: 'top 90%', end: 'top 38%', scrub: 0.45 } })
      if (foundation.length) overviewTimeline.fromTo(foundation, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'none' })
      sequence.forEach((element) => {
        const isWire = element.hasAttribute('data-ce-wire')
        if (isWire) {
          overviewTimeline.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'none' }, '>-=0.05')
        } else {
          // SVG translations define the layout. Animate opacity only so every
          // node stays attached to its connectors throughout the reveal.
          overviewTimeline.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44, ease: 'power1.out' }, '>-=0.08')
        }
      })
    }
    const matrixCells = document.querySelectorAll('.cycle-matrix__cell')
    if (matrixCells.length) gsap.fromTo(matrixCells, { scale: 0.45, opacity: 0.12 }, { scale: 1, opacity: 1, stagger: { each: 0.006, from: 'start' }, ease: 'none', scrollTrigger: { trigger: '#protocole', start: 'top 85%', end: 'top 35%', scrub: 0.4 } })
    const plotDots = document.querySelectorAll('.plot-dot')
    if (plotDots.length) gsap.fromTo(plotDots, { scale: 0, transformOrigin: 'center' }, { scale: 1, stagger: { each: 0.005, from: 'start' }, ease: 'none', scrollTrigger: { trigger: '#resultat', start: 'top 84%', end: 'top 34%', scrub: 0.4 } })
  })
  disposers.push(() => motionContext.revert())
  if (!reducedMotion && deckLayout) disposers.push(setupPipelineZooms())

  const initialIndex = captureMode
    ? captureIndex
    : Math.max(0, slides.findIndex((slide) => `#${slide.id}` === requestedHash))
  setActive(initialIndex, false)
  requestAnimationFrame(() => {
    if (initialIndex > 0) goTo(initialIndex, true)
    ScrollTrigger.refresh()
    if (initialIndex > 0 && !reducedMotion) {
      gsap.set(slides[initialIndex].querySelectorAll('[data-reveal], [data-visual]'), {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      })
    }
  })

  const onResize = () => {
    snap?.resize()
    ScrollTrigger.refresh()
    syncFromScroll(window.scrollY, document.documentElement.scrollHeight - window.innerHeight)
  }
  window.addEventListener('resize', onResize)
  disposers.push(() => window.removeEventListener('resize', onResize))

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onMotionPreferenceChange = () => window.location.reload()
  motionQuery.addEventListener('change', onMotionPreferenceChange)
  disposers.push(() => motionQuery.removeEventListener('change', onMotionPreferenceChange))

  void document.fonts.ready.then(() => {
    snap?.resize()
    ScrollTrigger.refresh()
  })

  return () => {
    disposers.reverse().forEach((dispose) => dispose())
    snap?.destroy()
    lenis?.destroy()
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  }
}
