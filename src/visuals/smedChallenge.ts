import { smedMachineEvidence, type SmedMachineId } from '../content/smedMachineEvidence'
import { mountSmedAnalysis, smedAnalysisIds, type SmedAnalysisId } from './smedAnalysis'

type SlideActivation = CustomEvent<{ id: string; direction: number }>
type Selection = SmedMachineId | SmedAnalysisId | 'context' | null

/** Machine evidence, then the four source analysis charts, on one deck slide. */
export function mountSmedChallenge(): () => void {
  const slide = document.querySelector<HTMLElement>('#smed-enjeu')
  const stage = slide?.querySelector<HTMLElement>('.smed-challenge-stage')
  const context = stage?.querySelector<HTMLElement>('#smed-challenge-detail')
  const open = stage?.querySelector<HTMLButtonElement>('[data-smed-detail-open]')
  const closeContext = stage?.querySelector<HTMLButtonElement>('[data-smed-detail-close]')
  const panel = stage?.querySelector<HTMLElement>('#smed-machine-panel')
  const closeMachine = stage?.querySelector<HTMLButtonElement>('[data-smed-machine-close]')
  const link = stage?.querySelector<HTMLElement>('.smed-machine-link')
  const title = stage?.querySelector<HTMLElement>('#smed-machine-title')
  const summary = stage?.querySelector<HTMLElement>('#smed-machine-summary')
  const rows = stage?.querySelector<HTMLTableSectionElement>('[data-smed-operations]')
  const count = stage?.querySelector<HTMLElement>('[data-smed-machine-count]')
  if (!slide || !stage || !context || !open || !closeContext || !panel || !closeMachine || !link || !title || !summary || !rows || !count) return () => {}

  const nodes = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-smed-machine]'))
  const analysis = mountSmedAnalysis(stage)
  const sequence: Exclude<Selection, 'context' | null>[] = [...smedMachineEvidence.map(item => item.id), ...smedAnalysisIds]
  const params = new URLSearchParams(window.location.search)
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const portrait = window.matchMedia('(max-aspect-ratio: 4 / 5)')
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const reduced = () => motion.matches || params.has('capture') || params.has('print') || params.get('motion') === 'off'
  const preview = params.has('capture') || params.has('print')
  const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'))
  const slideIndex = slides.indexOf(slide)
  let animation: Animation | undefined
  let selected: Selection = null
  let lastTrigger: HTMLButtonElement = open
  let alive = true
  let initialLayout = true
  let startupFrame = 0

  const positionLink = () => {
    const node = nodes.find(button => button.dataset.smedMachine === selected)
    link.hidden = !node || portrait.matches
    if (link.hidden || !node) return
    const base = stage.getBoundingClientRect()
    const target = node.getBoundingClientRect()
    const windowBottom = panel.offsetTop + panel.offsetHeight
    link.style.left = `${target.left + target.width / 2 - base.left}px`
    link.style.top = `${windowBottom}px`
    link.style.height = `${Math.max(0, target.top - base.top - windowBottom)}px`
  }

  const setSelection = (value: Selection, focus = true, animate = true) => {
    animation?.cancel()
    const previous = selected
    selected = value
    const machine = smedMachineEvidence.find(item => item.id === value)
    const analysisId = smedAnalysisIds.find(id => id === value)
    analysis.show(analysisId ?? null)
    context.hidden = value !== 'context'
    panel.hidden = !machine
    stage.classList.toggle('has-smed-window', value !== null)
    stage.classList.toggle('has-smed-machine', Boolean(machine))
    open.setAttribute('aria-expanded', String(value === 'context'))
    nodes.forEach(node => {
      const active = node.dataset.smedMachine === value
      node.setAttribute('aria-expanded', String(active))
      node.closest('li')?.classList.toggle('is-current', active)
    })
    if (machine) {
      lastTrigger = nodes.find(node => node.dataset.smedMachine === value) ?? open
      title.textContent = machine.name
      summary.textContent = machine.summary
      rows.replaceChildren(...machine.operations.map(operation => {
        const row = document.createElement('tr')
        row.dataset.smedSourceRow = String(operation.row)
        const reference = document.createElement('th')
        reference.scope = 'row'
        reference.textContent = String(operation.row).padStart(2, '0')
        row.append(reference)
        row.insertCell().textContent = operation.action
        row.insertCell().textContent = operation.actor
        return row
      }))
      count.textContent = `${String(smedMachineEvidence.indexOf(machine) + 1).padStart(2, '0')} / 05`
    } else if (value === 'context') lastTrigger = open
    else if (analysisId) lastTrigger = analysis.trigger

    const visible = machine ? panel : value === 'context' ? context : analysisId ? analysis.panel : null
    if (visible && animate && !reduced()) {
      animation = visible.animate([
        { opacity: 0, transform: previous && machine ? 'translateX(10px)' : 'translateY(12px)' },
        { opacity: 1, transform: 'translate(0, 0)' },
      ], { duration: 320, easing: 'cubic-bezier(.22, 1, .36, 1)' })
    }
    positionLink()
    if (focus) {
      if (visible) {
        if (portrait.matches) stage.scrollIntoView({ behavior: 'instant', block: 'start' })
        const closeButton = machine ? closeMachine : analysisId ? analysis.close : closeContext
        closeButton.focus({ preventScroll: true })
      } else lastTrigger.focus({ preventScroll: !portrait.matches })
      if (live) live.textContent = machine
        ? `${machine.name}. Extrait d’observation. ${machine.operations.length} opérations. ${machine.summary}`
        : analysisId ? analysis.caption(analysisId)
          : value === 'context' ? 'Le changement étudié et ses intervenants.' : 'Retour à la ligne de conditionnement.'
    }
  }

  const advance = (direction: number) => {
    const current = sequence.findIndex(item => item === selected) + 1
    const next = current + direction
    if (selected === 'context' && direction < 0) setSelection(null)
    else if (next >= 0 && next <= sequence.length) setSelection(next === 0 ? null : sequence[next - 1])
    else {
      const focused = document.activeElement
      if (focused instanceof HTMLElement && (stage.contains(focused) || focused.closest('.presenter-dock'))) focused.blur()
      document.querySelector<HTMLButtonElement>(`[data-deck-index="${slideIndex + direction}"]`)?.click()
    }
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null
    if (!target) return
    const machine = smedMachineEvidence.find(item => item.id === target.dataset.smedMachine)
    const analysisId = smedAnalysisIds.find(id => id === target.dataset.smedAnalysis)
    if (machine) setSelection(selected === machine.id ? null : machine.id)
    else if (analysisId) setSelection(analysisId)
    else if (target.hasAttribute('data-smed-analysis-prev')) advance(-1)
    else if (target.hasAttribute('data-smed-analysis-next')) advance(1)
    else if (target === open) setSelection(selected === 'context' ? null : 'context')
    else if (target === closeContext || target === closeMachine || target === analysis.close) setSelection(null)
  }
  const onKey = (event: KeyboardEvent) => {
    if (preview || !slide.classList.contains('is-active') || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target instanceof Element ? event.target : null
    const tableScroll = target?.closest<HTMLElement>('.smed-analysis-table-scroll')
    if (portrait.matches && tableScroll && tableScroll.scrollWidth > tableScroll.clientWidth && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.stopImmediatePropagation()
      return
    }
    const interactive = target?.closest('a, button, input, textarea, select, [contenteditable="true"]')
    const ownControl = interactive?.matches('[data-smed-machine], [data-smed-detail-open], [data-smed-detail-close], [data-smed-machine-close], [data-smed-analysis], [data-smed-analysis-close], [data-smed-analysis-prev], [data-smed-analysis-next]')
    const presenterControl = interactive?.matches('.presenter-launch, [data-presenter-previous], [data-presenter-next], [data-presenter-exit]')
    if (interactive && !ownControl && !presenterControl) return
    if (event.key === 'Escape' && selected) {
      event.preventDefault()
      event.stopImmediatePropagation()
      setSelection(null)
      return
    }
    if (selected && selected !== 'context' && ownControl && ['Home', 'End'].includes(event.key)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      const group = smedAnalysisIds.some(id => id === selected) ? smedAnalysisIds : smedMachineEvidence.map(item => item.id)
      setSelection(group[event.key === 'Home' ? 0 : group.length - 1])
      return
    }
    const forward = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey)
    const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
    if (!forward && !backward) return
    event.preventDefault()
    event.stopImmediatePropagation()
    // A held key, or a key during the slide transition, must not skip evidence.
    if (event.repeat || (!portrait.matches && Math.abs(slide.getBoundingClientRect().top) >= 3)) return
    advance(forward ? 1 : -1)
  }
  const onWheel = (event: WheelEvent) => {
    if (!selected || portrait.matches || event.ctrlKey || !(event.target instanceof Node)) return
    if (panel.contains(event.target) || context.contains(event.target) || analysis.panel.contains(event.target)) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }
  const onActive = (event: Event) => {
    const detail = (event as SlideActivation).detail
    if (detail.id === slide.id) {
      if (!initialLayout && !preview) setSelection(detail.direction < 0 ? sequence[sequence.length - 1] : null, false, false)
    } else if (selected && !initialLayout) {
      if (panel.contains(document.activeElement) || context.contains(document.activeElement) || analysis.panel.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur()
      setSelection(null, false, false)
    }
  }

  const finish = () => { animation?.cancel(); positionLink() }
  stage.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey, true)
  window.addEventListener('wheel', onWheel, { capture: true, passive: false })
  window.addEventListener('deck:slide-active', onActive)
  window.addEventListener('resize', finish)
  motion.addEventListener('change', finish)
  portrait.addEventListener('change', finish)
  void document.fonts.ready.then(() => {
    if (!alive) return
    positionLink()
    // Preserve direct preview selection across the deck's startup scroll sync.
    startupFrame = requestAnimationFrame(() => {
      startupFrame = requestAnimationFrame(() => { initialLayout = false })
    })
  })
  const requestedAnalysis = smedAnalysisIds.find(id => id === params.get('smed-analysis'))
  const requested = smedMachineEvidence.find(item => item.id === params.get('smed-machine'))
  if (requestedAnalysis) setSelection(requestedAnalysis, false, false)
  else if (requested) setSelection(requested.id, false, false)
  else if (params.get('smed-detail') === '1') setSelection('context', false, false)

  return () => {
    alive = false
    cancelAnimationFrame(startupFrame)
    animation?.cancel()
    analysis.dispose()
    stage.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKey, true)
    window.removeEventListener('wheel', onWheel, true)
    window.removeEventListener('deck:slide-active', onActive)
    window.removeEventListener('resize', finish)
    motion.removeEventListener('change', finish)
    portrait.removeEventListener('change', finish)
  }
}
