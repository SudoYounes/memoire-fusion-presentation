import { createModelsArtefacts } from '../visuals/modelsArtifacts'

/** Attach the preparation outlet to the distribution bus and pace the six-part explanation. */
export function setupModelsDiagram(): () => void {
  const slide = document.querySelector<HTMLElement>('#modeles-contrats')
  const stage = slide?.querySelector<HTMLElement>('.models-stage')
  const map = document.querySelector<HTMLElement>('#modeles-contrats .models-map')
  const body = map?.querySelector<HTMLElement>('.models-source--bodies')
  const lanes = map?.querySelector<HTMLElement>('.models-lanes')
  if (!slide || !stage || !map || !body || !lanes) return () => {}

  const labels = [
    'CAO',
    'corps rigides, masses et inerties',
    'URDF — structure du robot',
    'SRDF — règles de planification',
    'SDF — monde et capteurs',
    'JSON — dynamique fermée des bielles',
  ]
  const params = new URLSearchParams(window.location.search)
  const layoutQuery = window.matchMedia('(min-aspect-ratio: 4 / 5)')
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const disposers: Array<() => void> = []
  const isProgressive = () => layoutQuery.matches && !params.has('capture') && !params.has('print')
    && params.get('motion') !== 'off' && !motionQuery.matches
  let step = isProgressive() ? 0 : labels.length - 1
  let wheelLockedUntil = 0
  let lastWheelAt = -Infinity

  const views = () => [stage, ...document.querySelectorAll<HTMLElement>('.pipeline-camera .models-stage')]
  const updateGeometry = (view: HTMLElement) => {
    const viewBody = view.querySelector<HTMLElement>('.models-source--bodies')
    const viewLanes = view.querySelector<HTMLElement>('.models-lanes')
    if (!viewBody || !viewLanes || !viewLanes.offsetWidth) return
    const laneBounds = viewLanes.getBoundingClientRect()
    const bodyBounds = viewBody.getBoundingClientRect()
    const scale = laneBounds.width / viewLanes.offsetWidth || 1
    const branchY = (bodyBounds.top + bodyBounds.height / 2 - laneBounds.top) / scale
    viewLanes.style.setProperty('--models-branch-y', `${branchY}px`)
    const target = viewLanes.querySelector<HTMLElement>(`[data-models-block="${step}"]`)
    if (!target || step < 2) {
      viewLanes.style.setProperty('--models-flow-height', '0px')
      return
    }
    const targetBounds = target.getBoundingClientRect()
    const targetY = (targetBounds.top + targetBounds.height / 2 - laneBounds.top) / scale
    viewLanes.style.setProperty('--models-flow-top', `${Math.min(branchY, targetY)}px`)
    viewLanes.style.setProperty('--models-flow-height', `${Math.abs(targetY - branchY)}px`)
  }

  const setStep = (next: number, announce = true, openArtifact = isProgressive()) => {
    const previous = step
    step = Math.max(0, Math.min(labels.length - 1, next))
    artefacts.show(step, openArtifact, step < previous)
    views().forEach((view) => {
      view.dataset.modelsStatic = String(!isProgressive())
      view.dataset.modelsStep = String(step)
      view.querySelectorAll<HTMLElement>('[data-models-block]').forEach((block) => {
        const current = isProgressive() && Number(block.dataset.modelsBlock) === step
        block.classList.toggle('is-current', current)
        if (current) block.setAttribute('aria-current', 'step')
        else block.removeAttribute('aria-current')
      })
      updateGeometry(view)
    })
    if (announce && live) live.textContent = `Décrire, temps ${step + 1} sur ${labels.length} : ${labels[step]}.`
  }

  const artefacts = createModelsArtefacts(stage, next => setStep(next, true, true))
  setStep(step, false)
  const settled = () => slide.classList.contains('is-active') && Math.abs(slide.getBoundingClientRect().top) < 3
  const key = (event: KeyboardEvent) => {
    if (!isProgressive() || !settled() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target instanceof Element ? event.target : null
    const interactive = Boolean(target?.closest('button, a, input, textarea, select, [contenteditable="true"], [role="button"]'))
    if (interactive && (!event.key.startsWith('Arrow') || !target?.closest('.models-map'))) return
    const forward = ['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key) && !event.shiftKey
    const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
    if (!forward && !backward) return
    if (event.repeat) { event.preventDefault(); event.stopImmediatePropagation(); return }
    if (artefacts.advance(forward ? 1 : -1)) {
      event.preventDefault(); event.stopImmediatePropagation(); return
    }
    const next = step + (forward ? 1 : -1)
    if (next < 0 || next >= labels.length) return
    event.preventDefault()
    event.stopImmediatePropagation()
    setStep(next)
  }
  window.addEventListener('keydown', key, true)
  disposers.push(() => window.removeEventListener('keydown', key, true))

  const wheel = (event: WheelEvent) => {
    if (!isProgressive() || !settled() || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    const now = performance.now()
    const continuingGesture = now - lastWheelAt < 190
    lastWheelAt = now
    if (now < wheelLockedUntil || continuingGesture) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    if (artefacts.advance(Math.sign(event.deltaY))) {
      event.preventDefault(); event.stopImmediatePropagation(); wheelLockedUntil = now + 520; return
    }
    const next = step + Math.sign(event.deltaY)
    if (next < 0 || next >= labels.length) return
    event.preventDefault()
    event.stopImmediatePropagation()
    wheelLockedUntil = now + 520
    setStep(next)
  }
  window.addEventListener('wheel', wheel, { capture: true, passive: false })
  disposers.push(() => window.removeEventListener('wheel', wheel, true))

  const active = (event: Event) => {
    const detail = (event as CustomEvent<{ id: string; direction: number }>).detail
    if (detail.id !== 'modeles-contrats') { artefacts.close(); return }
    setStep(isProgressive() ? (detail.direction < 0 ? labels.length - 1 : 0) : labels.length - 1, false)
    wheelLockedUntil = 0
    lastWheelAt = -Infinity
  }
  window.addEventListener('deck:slide-active', active)
  disposers.push(() => window.removeEventListener('deck:slide-active', active))
  const onLayoutChange = () => setStep(isProgressive() ? 0 : labels.length - 1, false)
  layoutQuery.addEventListener('change', onLayoutChange)
  disposers.push(() => layoutQuery.removeEventListener('change', onLayoutChange))
  motionQuery.addEventListener('change', onLayoutChange)
  disposers.push(() => motionQuery.removeEventListener('change', onLayoutChange))

  const update = () => views().forEach(updateGeometry)
  update()
  const observer = new ResizeObserver(update)
  observer.observe(map)
  observer.observe(body)
  void document.fonts.ready.then(update)
  return () => {
    artefacts.destroy()
    observer.disconnect()
    disposers.forEach(dispose => dispose())
  }
}
