type SlideActivation = CustomEvent<{ id: string }>

/** A contextual evidence window. The framing slide remains a single deck step. */
export function mountSmedChallenge(): () => void {
  const slide = document.querySelector<HTMLElement>('#smed-enjeu')
  const stage = slide?.querySelector<HTMLElement>('.smed-challenge-stage')
  const panel = stage?.querySelector<HTMLElement>('#smed-challenge-detail')
  const open = stage?.querySelector<HTMLButtonElement>('[data-smed-detail-open]')
  const close = stage?.querySelector<HTMLButtonElement>('[data-smed-detail-close]')
  const line = stage?.querySelector<HTMLElement>('.smed-line')
  if (!slide || !stage || !panel || !open || !close || !line) return () => {}

  const params = new URLSearchParams(window.location.search)
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const portrait = window.matchMedia('(max-aspect-ratio: 4 / 5)')
  const reduced = () => motion.matches || params.has('capture') || params.has('print') || params.get('motion') === 'off'
  let animation: Animation | undefined
  let opened = false

  const setOpen = (value: boolean, focus = true, animate = true) => {
    animation?.cancel()
    opened = value
    panel.hidden = !value
    stage.classList.toggle('has-smed-detail', value)
    open.setAttribute('aria-expanded', String(value))
    line.setAttribute('aria-hidden', String(value))
    line.inert = value
    if (value && animate && !reduced()) {
      animation = panel.animate([
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 340, easing: 'cubic-bezier(.22, 1, .36, 1)' })
    }
    if (focus) {
      if (value) {
        if (portrait.matches) panel.scrollIntoView({ behavior: 'instant', block: 'center' })
        close.focus({ preventScroll: true })
      } else open.focus({ preventScroll: true })
    }
  }

  const onOpen = () => setOpen(!opened)
  const onClose = () => setOpen(false)
  const onKey = (event: KeyboardEvent) => {
    if (!opened || !slide.classList.contains('is-active') || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopImmediatePropagation()
      setOpen(false)
      return
    }
    // Reading a table must not unexpectedly advance the deck. Tab remains free:
    // this is a non-modal region, just like the existing Robot evidence panels.
    const fromPanel = event.target instanceof Node && panel.contains(event.target)
    if (fromPanel && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
      event.stopImmediatePropagation()
      if (!portrait.matches) event.preventDefault()
    }
  }
  const onActive = (event: Event) => {
    if ((event as SlideActivation).detail.id !== slide.id && opened) {
      if (panel.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur()
      setOpen(false, false, false)
    }
  }

  open.addEventListener('click', onOpen)
  close.addEventListener('click', onClose)
  window.addEventListener('keydown', onKey, true)
  window.addEventListener('deck:slide-active', onActive)
  const finish = () => animation?.cancel()
  motion.addEventListener('change', finish)
  if (params.get('smed-detail') === '1') setOpen(true, false, false)

  return () => {
    animation?.cancel()
    open.removeEventListener('click', onOpen)
    close.removeEventListener('click', onClose)
    window.removeEventListener('keydown', onKey, true)
    window.removeEventListener('deck:slide-active', onActive)
    motion.removeEventListener('change', finish)
  }
}
