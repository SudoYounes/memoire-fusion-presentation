import { trajectoryCues, mountTrajectoryFlow } from './trajectoryFlow'
import { trajectoryComments } from './trajectoryCommentary'

type DeckSlideEvent = CustomEvent<{ id: string; direction: number }>

const cues = trajectoryCues.map(cue => cue.label)

export function mountTrajectoryNarrative(): () => void {
  const slide = document.querySelector<HTMLElement>('#dynamique')
  const stage = slide?.querySelector<HTMLElement>('.trajectory-stage')
  if (!slide || !stage) return () => {}

  const params = new URLSearchParams(window.location.search)
  const layoutQuery = window.matchMedia('(min-aspect-ratio: 4 / 5)')
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const handlers: Array<() => void> = []
  const isCapture = params.has('capture') || params.has('print')
  const noMotion = () => isCapture || params.get('motion') === 'off' || motionQuery.matches
  const isDeck = () => layoutQuery.matches && !isCapture
  const initial = Number(params.get('traj') ?? 0)
  let cue = Number.isInteger(initial) ? Math.max(0, Math.min(cues.length - 1, initial)) : 0
  const initialStep = Number(params.get('trajStep') ?? 0)
  let step = Number.isInteger(initialStep) ? Math.max(0, Math.min(trajectoryComments[cue].length - 1, initialStep)) : 0
  let selectedPose: number | undefined
  let wheelLockedUntil = 0
  let lastWheelAt = -Infinity
  const flow = mountTrajectoryFlow(stage)

  const views = () => [stage, ...document.querySelectorAll<HTMLElement>('.pipeline-camera .trajectory-stage')]
  const setCue = (next: number, nextStep = 0, animate = true, announce = true, pose?: number) => {
    const previous = cue
    const previousStep = step
    cue = Math.max(0, Math.min(cues.length - 1, next))
    step = Math.max(0, Math.min(trajectoryComments[cue].length - 1, nextStep))
    selectedPose = pose
    flow.finish()
    views().forEach(view => flow.update(view, cue, noMotion(), step, selectedPose))
    if (animate && !noMotion() && (previous !== cue || previousStep !== step)) flow.play(previous !== cue)
    if (announce && live) live.textContent = `Préparation de trajectoire, carte ${cue + 1} sur ${cues.length}, commentaire ${step + 1} sur ${trajectoryComments[cue].length} : ${trajectoryComments[cue][step].topic}.`
  }

  const adjacent = (direction: number): [number, number] | null => {
    const nextStep=step+direction
    if(nextStep>=0 && nextStep<trajectoryComments[cue].length)return [cue,nextStep]
    const nextCue=cue+direction
    if(nextCue<0 || nextCue>=cues.length)return null
    return [nextCue,direction>0?0:trajectoryComments[nextCue].length-1]
  }
  const select = (target: Element) => {
    if(target.hasAttribute('data-traj-pose')) {
      const pose=Number(target.getAttribute('data-traj-pose'))
      setCue(2,Math.max(0,pose-1),true,true,pose)
    } else if(target.hasAttribute('data-traj-step'))setCue(cue,Number(target.getAttribute('data-traj-step')))
    else if(target.hasAttribute('data-traj-goto'))setCue(Number(target.getAttribute('data-traj-goto')))
    else {
      const next=adjacent(target.hasAttribute('data-traj-prev')?-1:1)
      if(next)setCue(...next)
    }
  }
  setCue(cue, step, false, false)
  const settled = () => slide.classList.contains('is-active') && Math.abs(slide.getBoundingClientRect().top) < 3
  const click = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest('[data-traj-goto], [data-traj-prev], [data-traj-next], [data-traj-step], [data-traj-pose]') : null
    if (!target) return
    select(target)
    if (!layoutQuery.matches) {
      const node = stage.querySelector<SVGGraphicsElement>('.tf-node.is-current')
      const viewport = stage.querySelector<HTMLElement>('.trajectory-viewport')
      if (node && viewport) {
        const rect = node.getBoundingClientRect()
        viewport.scrollBy({ left: rect.left + rect.width / 2 - viewport.getBoundingClientRect().left - viewport.clientWidth / 2, behavior: noMotion() ? 'instant' : 'smooth' })
      }
      if (viewport) {
        if (cue === 0) viewport.scrollTo({ left: 0, behavior: 'instant' })
        window.scrollTo({ top: window.scrollY + viewport.getBoundingClientRect().top - 76, behavior: 'instant' })
      }
    }
  }
  const nodeKey = (event: KeyboardEvent) => {
    if (!['Enter', ' '].includes(event.key) || !(event.target instanceof SVGElement)) return
    const target = event.target.closest('[data-traj-goto], [data-traj-step], [data-traj-pose]')
    if (!target) return
    event.preventDefault()
    event.stopPropagation()
    select(target)
  }
  stage.addEventListener('keydown', nodeKey)
  handlers.push(() => stage.removeEventListener('keydown', nodeKey))
  stage.addEventListener('click', click)
  handlers.push(() => stage.removeEventListener('click', click))

  const key = (event: KeyboardEvent) => {
    if (!isDeck() || !settled() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [data-traj-goto], [data-traj-pose], [data-traj-step], [contenteditable="true"]')) return
    const forward = ['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key) && !event.shiftKey
    const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
    if (!forward && !backward) return
    if (event.repeat) { event.preventDefault(); event.stopImmediatePropagation(); return }
    const next = adjacent(forward ? 1 : -1)
    if (!next) return
    event.preventDefault()
    event.stopImmediatePropagation()
    setCue(...next)
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
    const next = adjacent(Math.sign(event.deltaY))
    if (!next) return
    event.preventDefault()
    event.stopImmediatePropagation()
    wheelLockedUntil = now + 720
    setCue(...next)
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
    if (detail.id !== 'dynamique') return
    if (!layoutQuery.matches) { setCue(cue, step, false, false, selectedPose); return }
    const keep = !entered || initialLayout
    const nextCue = keep ? cue : detail.direction < 0 ? cues.length - 1 : 0
    setCue(nextCue, keep ? step : detail.direction < 0 ? trajectoryComments[nextCue].length - 1 : 0, false, false, keep ? selectedPose : undefined)
    entered = true
    wheelLockedUntil = 0
    lastWheelAt = -Infinity
  }
  window.addEventListener('deck:slide-active', active)
  handlers.push(() => window.removeEventListener('deck:slide-active', active))
  const refresh = () => setCue(cue, step, false, false, selectedPose)
  motionQuery.addEventListener('change', refresh)
  layoutQuery.addEventListener('change', refresh)
  handlers.push(() => motionQuery.removeEventListener('change', refresh), () => layoutQuery.removeEventListener('change', refresh))
  return () => { flow.dispose(); handlers.forEach(dispose => dispose()) }
}
