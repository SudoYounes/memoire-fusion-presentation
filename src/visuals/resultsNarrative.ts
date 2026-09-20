import { resultsCues, mountResultsFlow } from './resultsFlow'

type DeckSlideEvent = CustomEvent<{ id: string; direction: number }>

const cues = resultsCues.map(cue => cue.label)

export function mountResultsNarrative(): () => void {
  const slide = document.querySelector<HTMLElement>('#cycle')
  const stage = slide?.querySelector<HTMLElement>('.results-stage')
  if (!slide || !stage) return () => {}

  const params = new URLSearchParams(window.location.search)
  const layoutQuery = window.matchMedia('(min-aspect-ratio: 4 / 5)')
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const handlers: Array<() => void> = []
  const isCapture = params.has('capture') || params.has('print')
  const noMotion = () => isCapture || params.get('motion') === 'off' || motionQuery.matches
  const isDeck = () => layoutQuery.matches && !isCapture
  const initial = Number(params.get('results') ?? 0)
  let cue = Number.isInteger(initial) ? Math.max(0, Math.min(cues.length - 1, initial)) : 0
  let wheelLockedUntil = 0
  let lastWheelAt = -Infinity
  const flow = mountResultsFlow(stage)

  const views = () => [stage, ...document.querySelectorAll<HTMLElement>('.pipeline-camera .results-stage')]
  const setCue = (next: number, animate = true, announce = true) => {
    const previous = cue
    cue = Math.max(0, Math.min(cues.length - 1, next))
    flow.finish()
    views().forEach(view => flow.update(view, cue, noMotion()))
    if (animate && !noMotion() && previous !== cue) flow.play()
    if (announce && live) live.textContent = `Résultats de simulation, vue ${cue + 1} sur ${cues.length} : ${cues[cue]}.`
  }

  setCue(cue, false, false)
  const settled = () => slide.classList.contains('is-active') && Math.abs(slide.getBoundingClientRect().top) < 3
  const click = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest('[data-results-goto], [data-results-prev], [data-results-next]') : null
    if (!target) return
    if (target.hasAttribute('data-results-goto')) setCue(Number(target.getAttribute('data-results-goto')))
    else if (target.hasAttribute('data-results-prev')) setCue(cue - 1)
    else if (target.hasAttribute('data-results-next')) setCue(cue + 1)
    if (!layoutQuery.matches) {
      const viewport = stage.querySelector<HTMLElement>('.results-viewport')
      if (viewport) {
        viewport.scrollTo({ left: 0, behavior: 'instant' })
        window.scrollTo({ top: window.scrollY + viewport.getBoundingClientRect().top - 76, behavior: 'instant' })
      }
    }
  }
  const nodeKey = (event: KeyboardEvent) => {
    if (!['Enter', ' '].includes(event.key) || !(event.target instanceof SVGElement)) return
    const target = event.target.closest('[data-results-goto]')
    if (!target) return
    event.preventDefault()
    event.stopPropagation()
    setCue(Number(target.getAttribute('data-results-goto')))
  }
  stage.addEventListener('keydown', nodeKey)
  handlers.push(() => stage.removeEventListener('keydown', nodeKey))
  stage.addEventListener('click', click)
  handlers.push(() => stage.removeEventListener('click', click))

  const key = (event: KeyboardEvent) => {
    if (!isDeck() || !settled() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [data-results-goto], [contenteditable="true"]')) return
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
  void document.fonts.ready.then(() => {
    if (!alive) return
    startupFrame = requestAnimationFrame(() => {
      startupFrame = requestAnimationFrame(() => { initialLayout = false })
    })
  })
  handlers.push(() => { alive = false; cancelAnimationFrame(startupFrame) })
  const active = (event: Event) => {
    const detail = (event as DeckSlideEvent).detail
    if (detail.id !== 'cycle') return
    if (!layoutQuery.matches) { setCue(cue, false, false); return }
    setCue(!entered || initialLayout ? cue : detail.direction < 0 ? cues.length - 1 : 0, false, false)
    entered = true
    wheelLockedUntil = 0
    lastWheelAt = -Infinity
  }
  window.addEventListener('deck:slide-active', active)
  handlers.push(() => window.removeEventListener('deck:slide-active', active))
  const refresh = () => setCue(cue, false, false)
  motionQuery.addEventListener('change', refresh)
  layoutQuery.addEventListener('change', refresh)
  handlers.push(() => motionQuery.removeEventListener('change', refresh), () => layoutQuery.removeEventListener('change', refresh))
  return () => { flow.dispose(); handlers.forEach(dispose => dispose()) }
}
