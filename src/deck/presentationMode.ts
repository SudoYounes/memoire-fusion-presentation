type DeckSlideEvent = CustomEvent<{ id: string; index: number }>

const screenIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 5.5h16v11H4zM8.5 20h7M12 16.5V20" />
  </svg>`

const exitIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>`

export function mountPresentationMode(): () => void {
  const root = document.documentElement
  const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'))
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const params = new URLSearchParams(window.location.search)
  if (!slides.length || params.has('capture') || params.has('print')) return () => {}

  const launch = document.createElement('button')
  launch.type = 'button'
  launch.className = 'presenter-launch'
  launch.setAttribute('aria-label', 'Démarrer le mode présentation en plein écran')
  launch.setAttribute('aria-pressed', 'false')
  launch.title = 'Mode présentation · raccourci F'
  launch.innerHTML = `${screenIcon}<span>Présenter</span><kbd>F</kbd>`

  const dock = document.createElement('div')
  dock.className = 'presenter-dock'
  dock.setAttribute('role', 'toolbar')
  dock.setAttribute('aria-label', 'Commandes du mode présentation')
  dock.setAttribute('aria-hidden', 'true')
  dock.innerHTML = `
    <button type="button" data-presenter-previous aria-label="Diapositive ou étape précédente">←</button>
    <p><span data-presenter-index>01 / ${String(slides.length).padStart(2, '0')}</span><strong data-presenter-title></strong></p>
    <button type="button" data-presenter-next aria-label="Diapositive ou étape suivante">→</button>
    <i aria-hidden="true"></i>
    <button type="button" data-presenter-exit aria-label="Quitter le plein écran">${exitIcon}</button>`

  document.body.append(launch, dock)
  const index = dock.querySelector<HTMLElement>('[data-presenter-index]')
  const title = dock.querySelector<HTMLElement>('[data-presenter-title]')
  const previous = dock.querySelector<HTMLButtonElement>('[data-presenter-previous]')
  const next = dock.querySelector<HTMLButtonElement>('[data-presenter-next]')
  const exit = dock.querySelector<HTMLButtonElement>('[data-presenter-exit]')
  const handlers: Array<() => void> = []
  let hideTimer = 0

  const updateSlide = (slideIndex: number) => {
    const safeIndex = Math.max(0, Math.min(slides.length - 1, slideIndex))
    if (index) index.textContent = `${String(safeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`
    if (title) title.textContent = slides[safeIndex].dataset.title ?? ''
  }
  updateSlide(Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active'))))

  const clearHideTimer = () => {
    if (hideTimer) window.clearTimeout(hideTimer)
    hideTimer = 0
  }
  const showControls = () => {
    if (!document.fullscreenElement) return
    clearHideTimer()
    root.classList.add('presenter-controls-visible')
    hideTimer = window.setTimeout(() => {
      if (!dock.contains(document.activeElement)) root.classList.remove('presenter-controls-visible')
    }, 2800)
  }
  const announce = (message: string) => {
    if (live) live.textContent = message
  }
  const syncFullscreen = () => {
    const presenting = Boolean(document.fullscreenElement)
    root.classList.toggle('is-presenting', presenting)
    launch.setAttribute('aria-pressed', String(presenting))
    dock.setAttribute('aria-hidden', String(!presenting))
    if (presenting) {
      showControls()
      announce('Mode présentation activé. Échap permet de quitter le plein écran.')
    } else {
      clearHideTimer()
      root.classList.remove('presenter-controls-visible')
      announce('Mode présentation quitté.')
    }
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
  }
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen({ navigationUI: 'hide' })
    } catch {
      announce('Le navigateur a refusé le plein écran. Utilisez le bouton ou la touche F après avoir cliqué dans la page.')
    }
  }
  const step = (key: 'ArrowLeft' | 'ArrowRight') => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
    ;(document.activeElement as HTMLElement | null)?.blur()
    showControls()
  }

  const onLaunch = () => void toggleFullscreen()
  const onPrevious = () => step('ArrowLeft')
  const onNext = () => step('ArrowRight')
  const onExit = () => void document.exitFullscreen()
  const onActive = (event: Event) => updateSlide((event as DeckSlideEvent).detail.index)
  const onPointerMove = () => showControls()
  const onFocusIn = () => { if (document.fullscreenElement) { clearHideTimer(); root.classList.add('presenter-controls-visible') } }
  const onFocusOut = () => showControls()

  launch.addEventListener('click', onLaunch)
  previous?.addEventListener('click', onPrevious)
  next?.addEventListener('click', onNext)
  exit?.addEventListener('click', onExit)
  window.addEventListener('deck:slide-active', onActive)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  dock.addEventListener('focusin', onFocusIn)
  dock.addEventListener('focusout', onFocusOut)
  document.addEventListener('fullscreenchange', syncFullscreen)
  handlers.push(
    () => launch.removeEventListener('click', onLaunch),
    () => previous?.removeEventListener('click', onPrevious),
    () => next?.removeEventListener('click', onNext),
    () => exit?.removeEventListener('click', onExit),
    () => window.removeEventListener('deck:slide-active', onActive),
    () => window.removeEventListener('pointermove', onPointerMove),
    () => dock.removeEventListener('focusin', onFocusIn),
    () => dock.removeEventListener('focusout', onFocusOut),
    () => document.removeEventListener('fullscreenchange', syncFullscreen),
  )

  if (!document.fullscreenEnabled) launch.hidden = true
  return () => {
    clearHideTimer()
    handlers.forEach(dispose => dispose())
    launch.remove()
    dock.remove()
    root.classList.remove('is-presenting', 'presenter-controls-visible')
  }
}
