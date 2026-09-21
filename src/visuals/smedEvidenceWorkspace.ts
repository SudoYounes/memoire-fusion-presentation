export type EvidenceGroup = {
  id: string
  start: number
  end: number
  label: string
}

/** Supplement the shared story controller with group-level focus and motion. */
export function mountSmedEvidenceWorkspace(sectionId: string, groups: EvidenceGroup[]): () => void {
  const section = document.getElementById(sectionId)
  if (!section || !groups.length) return () => {}
  const lastStep = groups[groups.length - 1].end
  const windowElement = section.querySelector<HTMLElement>('.ss-window')
  const blocks = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-solution-group]'))
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const params = new URLSearchParams(window.location.search)
  const preview = params.has('capture') || params.has('print') || params.get('motion') === 'off'
  let previousGroup = ''
  let previousStep = -1
  let entrance: Animation | undefined
  let printing = false
  let activationFrame = 0
  let activationPending = false

  const stopMotion = () => {
    entrance?.cancel()
    delete section.dataset.smedSweep
  }
  const sync = (activate = false) => {
    const raw = Number(section.dataset.smedStep)
    const step = Number.isInteger(raw) ? Math.max(0, Math.min(lastStep, raw)) : 0
    const group = groups.find(g => step >= g.start && step <= g.end) ?? groups[0]
    section.dataset.smedGroup = group.id
    const label = section.querySelector<HTMLElement>('[data-solution-label]')
    if (label) label.textContent = group.label
    blocks.forEach(block => {
      const active = block.dataset.solutionGroup === group.id
      block.setAttribute('aria-expanded', String(active))
      block.classList.toggle('is-current-solution', active)
      if (active) block.setAttribute('aria-current', 'step')
      else block.removeAttribute('aria-current')
      const progress = block.querySelector<HTMLElement>('[data-solution-progress]')
      if (progress) progress.textContent = active ? `${step - group.start + 1} / ${group.end - group.start + 1}` : ''
    })
    const changed = previousStep !== step
    const changedGroup = previousGroup !== group.id
    const active = blocks.find(block => block.dataset.solutionGroup === group.id)
    if (changed || activate) entrance?.cancel()
    if ((activate || (changed && previousStep >= 0 && !activationPending)) && windowElement && active && !motion.matches && !preview && !printing && section.classList.contains('is-active')) {
      const panelRect = windowElement.getBoundingClientRect()
      const blockRect = active.getBoundingClientRect()
      const origin = Math.max(0, Math.min(100, 100 * (blockRect.top + blockRect.height / 2 - panelRect.top) / panelRect.height))
      const emergenceX = blockRect.right - panelRect.left
      windowElement.style.transformOrigin = `0 ${origin}%`
      entrance = windowElement.animate(changedGroup || activate ? [
        { opacity: 0, transform: `translateX(${emergenceX}px) scale(.16, .22)`, filter: 'blur(2px)' },
        { opacity: .9, transform: 'translateX(-8px) scale(.82, .92)', filter: 'blur(0px)', offset: .5 },
        { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' },
      ] : [
        { opacity: .55, transform: `translateX(${step > previousStep ? 14 : -14}px)` },
        { opacity: 1, transform: 'translateX(0)' },
      ], { duration: changedGroup || activate ? 650 : 340, easing: 'cubic-bezier(.2,.8,.2,1)' })
      // Use the existing slide 15 lettering/border sweep, including its cadence.
      // It continues through documents of the same block, like the reference.
      section.dataset.smedSweep = 'on'
    }
    previousStep = step
    previousGroup = group.id
  }
  const observer = new MutationObserver(() => sync())
  observer.observe(section, { attributes: true, attributeFilter: ['data-smed-step'] })
  const cancelActivation = () => {
    cancelAnimationFrame(activationFrame)
    activationPending = false
  }
  // The deck may briefly anticipate its target before scroll catches up.
  // Wait until that target settles: a single entrance survives those boundary
  // events, and the shared controller remains the only owner of the state.
  const onActive = (event: Event) => {
    const detail = (event as CustomEvent<{ id: string }>).detail
    cancelActivation()
    stopMotion()
    if (detail.id !== section.id || motion.matches || preview || printing) return
    activationPending = true
    const enterWhenSettled = () => {
      if (!section.classList.contains('is-active')) { cancelActivation(); return }
      if (window.matchMedia('(min-aspect-ratio: 4 / 5)').matches && Math.abs(section.getBoundingClientRect().top) >= 3) {
        activationFrame = requestAnimationFrame(enterWhenSettled)
        return
      }
      activationPending = false
      sync(true)
    }
    activationFrame = requestAnimationFrame(enterWhenSettled)
  }
  const resumeSweep = () => {
    if (!motion.matches && !preview && !printing && section.classList.contains('is-active')) section.dataset.smedSweep = 'on'
  }
  const onMotionChange = () => { cancelActivation(); stopMotion(); resumeSweep() }
  const onBeforePrint = () => { printing = true; cancelActivation(); stopMotion() }
  const onAfterPrint = () => { printing = false; resumeSweep() }
  window.addEventListener('deck:slide-active', onActive)
  window.addEventListener('beforeprint', onBeforePrint)
  window.addEventListener('afterprint', onAfterPrint)
  motion.addEventListener('change', onMotionChange)
  sync()
  return () => {
    observer.disconnect()
    cancelActivation()
    stopMotion()
    window.removeEventListener('deck:slide-active', onActive)
    window.removeEventListener('beforeprint', onBeforePrint)
    window.removeEventListener('afterprint', onAfterPrint)
    motion.removeEventListener('change', onMotionChange)
  }
}
