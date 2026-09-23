/** The video remains entirely unloaded until the presenter requests playback. */
export function mountGazeboVideo(): () => void {
  const slide = document.querySelector<HTMLElement>('#simulation-gazebo')
  const video = slide?.querySelector<HTMLVideoElement>('[data-gazebo-video]')
  const toggle = slide?.querySelector<HTMLButtonElement>('[data-demo-toggle]')
  const error = slide?.querySelector<HTMLElement>('[data-demo-error]')
  if (!slide || !video || !toggle || !error) return () => {}

  let playRequested = false
  let alive = true
  const ready = () => slide.classList.contains('is-active') && Math.abs(slide.getBoundingClientRect().top) < 3
  const update = () => {
    toggle.textContent = video.ended ? 'Revoir la vidéo' : playRequested || !video.paused ? 'Mettre en pause' : video.currentTime > 0 ? 'Reprendre la vidéo' : 'Lire la vidéo'
  }
  const pause = () => {
    playRequested = false
    video.pause()
    update()
  }
  const fail = () => {
    pause()
    error.hidden = false
  }
  const playPause = async () => {
    if (!slide.classList.contains('is-active')) return
    if (playRequested || !video.paused) { pause(); return }
    error.hidden = true
    // data-src prevents even a metadata request on the earlier slides.
    if (!video.hasAttribute('src')) video.src = video.dataset.src ?? ''
    if (video.ended) video.currentTime = 0
    playRequested = true
    update()
    try {
      await video.play()
      if (!alive || !playRequested || !slide.classList.contains('is-active') || document.hidden) pause()
    } catch (cause) {
      if (alive && cause instanceof DOMException && cause.name === 'AbortError') return
      if (alive) fail()
    }
  }
  const click = () => { void playPause() }
  const onPlay = () => {
    if (!alive || !slide.classList.contains('is-active') || document.hidden) { pause(); return }
    playRequested = true
    update()
  }
  const onPause = () => { playRequested = false; update() }
  const onActive = (event: Event) => {
    if ((event as CustomEvent<{id:string}>).detail.id !== slide.id) pause()
  }
  const onVisibility = () => { if (document.hidden) pause() }
  const key = (event: KeyboardEvent) => {
    if (!ready() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if (!['ArrowDown', 'ArrowUp', ' '].includes(event.key)) return
    // Keep the two presentation keys working even when video controls have focus.
    event.preventDefault()
    event.stopImmediatePropagation()
    if (event.repeat) return
    if (event.key === 'ArrowUp') {
      pause()
      const slides = Array.from(document.querySelectorAll('[data-slide]'))
      document.querySelector<HTMLButtonElement>(`[data-deck-index="${slides.indexOf(slide) - 1}"]`)?.click()
      ;(document.activeElement as HTMLElement | null)?.blur()
    } else void playPause()
  }

  toggle.addEventListener('click', click)
  video.addEventListener('play', onPlay)
  video.addEventListener('pause', onPause)
  video.addEventListener('ended', onPause)
  video.addEventListener('error', fail)
  window.addEventListener('keydown', key, true)
  window.addEventListener('deck:slide-active', onActive)
  document.addEventListener('visibilitychange', onVisibility)
  return () => {
    alive = false
    pause()
    toggle.removeEventListener('click', click)
    video.removeEventListener('play', onPlay)
    video.removeEventListener('pause', onPause)
    video.removeEventListener('ended', onPause)
    video.removeEventListener('error', fail)
    window.removeEventListener('keydown', key, true)
    window.removeEventListener('deck:slide-active', onActive)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
