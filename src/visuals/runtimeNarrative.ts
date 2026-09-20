import { runtimeCues, mountRuntimeFlow } from './runtimeFlow'

type DeckSlideEvent = CustomEvent<{ id: string; direction: number }>

const cues = runtimeCues.map(cue => cue.label)

export function mountRuntimeNarrative(): () => void {
  const slide = document.querySelector<HTMLElement>('#stack')
  const stage = slide?.querySelector<HTMLElement>('.runtime-stage')
  if (!slide || !stage) return () => {}

  const params = new URLSearchParams(window.location.search)
  const layoutQuery = window.matchMedia('(min-aspect-ratio: 4 / 5)')
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const handlers: Array<() => void> = []
  const isCapture = params.has('capture') || params.has('print')
  const noMotion = () => isCapture || params.get('motion') === 'off' || motionQuery.matches
  const isDeck = () => layoutQuery.matches && !isCapture
  const initial = Number(params.get('runtime') ?? 0)
  let cue = Number.isInteger(initial) ? Math.max(0, Math.min(cues.length - 1, initial)) : 0
  let wheelLockedUntil = 0
  let lastWheelAt = -Infinity
  const flow = mountRuntimeFlow(stage)
  let appearancePending = true
  let appearanceFrame = 0

  const views = () => [stage, ...document.querySelectorAll<HTMLElement>('.pipeline-camera .runtime-stage')]
  const setCue = (next: number, animate = true, announce = true) => {
    const previous = cue
    cue = Math.max(0, Math.min(cues.length - 1, next))
    flow.finish()
    views().forEach(view => flow.update(view, cue, noMotion()))
    if (animate && !noMotion() && previous !== cue) {
      appearancePending = false
      flow.play()
    }
    if (announce && live) live.textContent = `Commande et physique, vue ${cue + 1} sur ${cues.length} : ${cues[cue]}.`
  }

  setCue(cue, false, false)
  const settled = () => slide.classList.contains('is-active') && Math.abs(slide.getBoundingClientRect().top) < 3
  const click = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest('[data-runtime-goto], [data-runtime-prev], [data-runtime-next]') : null
    if (!target) return
    if (target.hasAttribute('data-runtime-goto')) setCue(Number(target.getAttribute('data-runtime-goto')))
    else if (target.hasAttribute('data-runtime-prev')) setCue(cue - 1)
    else if (target.hasAttribute('data-runtime-next')) setCue(cue + 1)
    if (!layoutQuery.matches) {
      const viewport = stage.querySelector<HTMLElement>('.runtime-viewport')
      if (viewport) {
        viewport.scrollTo({ left: 0, behavior: 'instant' })
        window.scrollTo({ top: window.scrollY + viewport.getBoundingClientRect().top - 76, behavior: 'instant' })
      }
    }
  }
  const nodeKey = (event: KeyboardEvent) => {
    if (!['Enter', ' '].includes(event.key) || !(event.target instanceof SVGElement)) return
    const target = event.target.closest('[data-runtime-goto]')
    if (!target) return
    event.preventDefault()
    event.stopPropagation()
    setCue(Number(target.getAttribute('data-runtime-goto')))
  }
  stage.addEventListener('keydown', nodeKey)
  handlers.push(() => stage.removeEventListener('keydown', nodeKey))
  stage.addEventListener('click', click)
  handlers.push(() => stage.removeEventListener('click', click))

  const key = (event: KeyboardEvent) => {
    if (!isDeck() || !settled() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [data-runtime-goto], [data-runtime-pose], [contenteditable="true"]')) return
    const forward = ['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key) && !event.shiftKey
    const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
    if (!forward && !backward) return
    if (event.repeat) { event.preventDefault(); event.stopImmediatePropagation(); return }
    const next = cue + (forward ? 1 : -1)
    if (next < 0 || next >= cues.length) return
    event.preventDefault()
    event.stopImmediatePropagation()
    setCue(next)
  }
  window.addEventListener('keydown', key, true)
  handlers.push(() => window.removeEventListener('keydown', key, true))

  const wheel = (event: WheelEvent) => {
    if (!isDeck() || !settled() || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    const now = performance.now()
    const continuingGesture = now - lastWheelAt < 190
    lastWheelAt = now
    if (now < wheelLockedUntil || continuingGesture) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    const next = cue + Math.sign(event.deltaY)
    if (next < 0 || next >= cues.length) return
    event.preventDefault()
    event.stopImmediatePropagation()
    wheelLockedUntil = now + 720
    setCue(next)
  }
  window.addEventListener('wheel', wheel, { capture: true, passive: false })
  handlers.push(() => window.removeEventListener('wheel', wheel, true))

  let entered = false
  // Font/layout settling can briefly report a later slide on a direct hash load.
  // Preserve the requested cue until the initial layout has stabilized.
  let initialLayout = true
  let alive = true
  let startupFrame = 0
  // Play once after the zoom has handed back to the real slide, not in its clone.
  const watchAppearance = () => {
    cancelAnimationFrame(appearanceFrame)
    if (!alive || !appearancePending || noMotion() || initialLayout || !slide.classList.contains('is-active')) return
    appearanceFrame = requestAnimationFrame(() => {
      appearanceFrame = requestAnimationFrame(() => {
        if (!alive || !appearancePending || noMotion() || !slide.classList.contains('is-active')) return
        const camerasHidden = [...document.querySelectorAll<HTMLElement>('.pipeline-camera')]
          .every(camera => getComputedStyle(camera).visibility === 'hidden')
        if ((!layoutQuery.matches || settled()) && camerasHidden) {
          appearancePending = false
          flow.play()
        }
      })
    })
  }
  // Listen for the end of scrolling instead of polling while the deck is idle.
  window.addEventListener('scroll', watchAppearance, { passive:true })
  handlers.push(() => window.removeEventListener('scroll', watchAppearance))
  void document.fonts.ready.then(() => {
    if (!alive) return
    startupFrame = requestAnimationFrame(() => {
      startupFrame = requestAnimationFrame(() => { initialLayout = false; watchAppearance() })
    })
  })
  handlers.push(() => { alive = false; cancelAnimationFrame(startupFrame); cancelAnimationFrame(appearanceFrame) })
  const active = (event: Event) => {
    const detail = (event as DeckSlideEvent).detail
    if (detail.id !== 'stack') {
      appearancePending = true
      cancelAnimationFrame(appearanceFrame)
      flow.finish()
      return
    }
    if (!layoutQuery.matches) { setCue(cue, false, false); watchAppearance(); return }
    setCue(!entered || initialLayout ? cue : detail.direction < 0 ? cues.length - 1 : 0, false, false)
    entered = true
    wheelLockedUntil = 0
    lastWheelAt = -Infinity
    watchAppearance()
  }
  window.addEventListener('deck:slide-active', active)
  handlers.push(() => window.removeEventListener('deck:slide-active', active))
  const refresh = () => setCue(cue, false, false)
  motionQuery.addEventListener('change', refresh)
  layoutQuery.addEventListener('change', refresh)
  handlers.push(() => motionQuery.removeEventListener('change', refresh), () => layoutQuery.removeEventListener('change', refresh))
  return () => { flow.dispose(); handlers.forEach(dispose => dispose()) }
}
