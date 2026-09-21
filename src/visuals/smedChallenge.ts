import { smedMachineEvidence, type SmedMachineId } from '../content/smedMachineEvidence'

type SlideActivation = CustomEvent<{ id: string }>
type Selection = SmedMachineId | 'context' | null

/** Optional evidence windows, never mandatory narration steps. */
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
  const params = new URLSearchParams(window.location.search)
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const portrait = window.matchMedia('(max-aspect-ratio: 4 / 5)')
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const reduced = () => motion.matches || params.has('capture') || params.has('print') || params.get('motion') === 'off'
  let animation: Animation | undefined
  let selected: Selection = null
  let lastTrigger: HTMLButtonElement = open
  let alive = true

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

    const visible = machine ? panel : value === 'context' ? context : null
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
        const closeButton = machine ? closeMachine : closeContext
        closeButton.focus({ preventScroll: true })
      } else lastTrigger.focus({ preventScroll: !portrait.matches })
      if (live) live.textContent = machine
        ? `${machine.name}. Extrait d’observation. ${machine.operations.length} opérations. ${machine.summary}`
        : value === 'context' ? 'Le changement étudié et ses intervenants.' : 'Retour à la ligne de conditionnement.'
    }
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null
    if (!target) return
    const machine = smedMachineEvidence.find(item => item.id === target.dataset.smedMachine)
    if (machine) setSelection(selected === machine.id ? null : machine.id)
    else if (target === open) setSelection(selected === 'context' ? null : 'context')
    else if (target === closeContext || target === closeMachine) setSelection(null)
  }
  const onKey = (event: KeyboardEvent) => {
    if (!selected || !slide.classList.contains('is-active') || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopImmediatePropagation()
      setSelection(null)
      return
    }
    const fromWindow = event.target instanceof Node && (panel.contains(event.target) || context.contains(event.target))
    const fromNode = event.target instanceof Element && Boolean(event.target.closest('[data-smed-machine]'))
    if (!fromWindow && !fromNode) return
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
      event.stopImmediatePropagation()
      if (selected !== 'context' && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault()
        const current = smedMachineEvidence.findIndex(item => item.id === selected)
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? nodes.length - 1
          : Math.max(0, Math.min(nodes.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)))
        if (next !== current) setSelection(smedMachineEvidence[next].id)
      } else if (!portrait.matches) event.preventDefault()
    }
  }
  const onWheel = (event: WheelEvent) => {
    if (!selected || portrait.matches || event.ctrlKey || !(event.target instanceof Node)) return
    if (panel.contains(event.target) || context.contains(event.target)) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }
  const onActive = (event: Event) => {
    if ((event as SlideActivation).detail.id !== slide.id && selected) {
      if (panel.contains(document.activeElement) || context.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur()
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
  void document.fonts.ready.then(() => { if (alive) positionLink() })
  const requested = smedMachineEvidence.find(item => item.id === params.get('smed-machine'))
  if (requested) setSelection(requested.id, false, false)
  else if (params.get('smed-detail') === '1') setSelection('context', false, false)

  return () => {
    alive = false
    animation?.cancel()
    stage.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKey, true)
    window.removeEventListener('wheel', onWheel, true)
    window.removeEventListener('deck:slide-active', onActive)
    window.removeEventListener('resize', finish)
    motion.removeEventListener('change', finish)
    portrait.removeEventListener('change', finish)
  }
}
