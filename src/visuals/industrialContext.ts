type SlideActivation = CustomEvent<{ id: string; direction: number }>

const captions = [
  'Changement de format et automatisation',
  'Définition du CDF · Changement de format',
  'Définition · Automatisation de la palettisation',
  'Contexte industriel · Site de Meyzieu',
  'Impact sur la production · Changement de format',
  'Impact sur la production · Automatisation',
] as const

export function mountIndustrialContext(): () => void {
  const slide = document.querySelector<HTMLElement>('#contexte-industriel')
  const stage = slide?.querySelector<HTMLElement>('[data-industrial-stage]')
  if (!slide || !stage) return () => {}

  const params = new URLSearchParams(window.location.search)
  const layout = window.matchMedia('(min-aspect-ratio: 4 / 5)')
  const capture = params.has('capture') || params.has('print')
  const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-industrial-card]'))
  const previous = stage.querySelector<HTMLButtonElement>('[data-industrial-prev]')
  const next = stage.querySelector<HTMLButtonElement>('[data-industrial-next]')
  const caption = stage.querySelector<HTMLElement>('[data-industrial-caption]')
  const counter = stage.querySelector<HTMLElement>('[data-industrial-count]')
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const requested = Number(params.get('industrial-step') ?? 0)
  let step = Number.isInteger(requested) ? Math.max(0, Math.min(5, requested)) : 0
  let entered = false
  let wheelLock = 0
  let lastWheel = -Infinity

  if (params.get('industrial-theme') === 'light') {
    slide.classList.remove('theme-teal')
    slide.classList.add('theme-industrial-light')
    slide.dataset.theme = 'light'
  }

  const setStep = (value: number, announce = true) => {
    step = Math.max(0, Math.min(5, value))
    stage.dataset.industrialStep = String(step)
    const activeCard = step === 0 ? null : step < 3 ? 'definition' : step === 3 ? 'context' : 'impact'
    cards.forEach(card => {
      const id = card.dataset.industrialCard
      const active = id === activeCard
      const turned = id === 'definition' ? step >= 2 : id === 'impact' && step === 5
      card.classList.toggle('is-current', active)
      card.classList.toggle('is-turned', turned)
      const heading = card.querySelector<HTMLButtonElement>('[data-industrial-goto]')
      if (active) heading?.setAttribute('aria-current', 'step')
      else heading?.removeAttribute('aria-current')
      card.querySelectorAll<HTMLElement>('[data-industrial-page]').forEach(page => {
        const hidden = page.dataset.industrialPage === 'automation' ? !turned : turned
        page.setAttribute('aria-hidden', String(hidden))
        page.inert = hidden
      })
      const label = card.querySelector<HTMLElement>('[data-industrial-perimeter-label]')
      if (label) label.innerHTML = turned ? 'Automatisation <span>02 / 02</span>' : 'CDF <span>01 / 02</span>'
      const turn = card.querySelector<HTMLButtonElement>('[data-industrial-turn]')
      if (turn) turn.setAttribute('aria-label', `${id === 'definition' ? 'Définition' : 'Impact'} : tourner la page vers ${turned ? 'le changement de format' : 'l’automatisation'}`)
    })
    if (caption) caption.textContent = captions[step]
    if (counter) counter.textContent = `${String(step).padStart(2, '0')} / 05`
    if (previous) previous.disabled = step === 0
    if (next) next.disabled = step === 5
    if (announce && live) live.textContent = `Contexte industriel, étape ${step} sur 5. ${captions[step]}.`
  }
  setStep(step, false)

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null
    if (!target) return
    if (target.dataset.industrialGoto) setStep(Number(target.dataset.industrialGoto))
    else if (target.dataset.industrialTurn === 'definition') setStep(step === 2 ? 1 : 2)
    else if (target.dataset.industrialTurn === 'impact') setStep(step === 5 ? 4 : 5)
    else if (target.hasAttribute('data-industrial-prev')) setStep(step - 1)
    else if (target.hasAttribute('data-industrial-next')) setStep(step + 1)
  }
  const settled = () => !capture && layout.matches && slide.classList.contains('is-active') && Math.abs(slide.getBoundingClientRect().top) < 3
  const onKey = (event: KeyboardEvent) => {
    if (!settled() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [contenteditable="true"]')) return
    const forward = ['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key) && !event.shiftKey
    const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
    if (!forward && !backward) return
    if (event.repeat) { event.preventDefault(); event.stopImmediatePropagation(); return }
    const destination = step + (forward ? 1 : -1)
    if (destination < 0 || destination > 5) return
    event.preventDefault()
    event.stopImmediatePropagation()
    setStep(destination)
  }
  const onWheel = (event: WheelEvent) => {
    if (!settled() || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    const now = performance.now()
    const continuing = now - lastWheel < 190
    lastWheel = now
    if (now < wheelLock || continuing) { event.preventDefault(); event.stopImmediatePropagation(); return }
    const destination = step + Math.sign(event.deltaY)
    if (destination < 0 || destination > 5) return
    event.preventDefault()
    event.stopImmediatePropagation()
    wheelLock = now + 900
    setStep(destination)
  }
  const onActive = (event: Event) => {
    const detail = (event as SlideActivation).detail
    if (detail.id !== slide.id) return
    setStep(!entered || !layout.matches ? step : detail.direction < 0 ? 5 : 0, false)
    entered = true
    wheelLock = 0
    lastWheel = -Infinity
  }

  stage.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey, true)
  window.addEventListener('wheel', onWheel, { capture: true, passive: false })
  window.addEventListener('deck:slide-active', onActive)
  return () => {
    stage.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKey, true)
    window.removeEventListener('wheel', onWheel, true)
    window.removeEventListener('deck:slide-active', onActive)
  }
}
