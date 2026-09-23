import { observerCapture as capture } from '../content/observerCapture'

/** All crops and annotations use the original sensor-pixel coordinate system. */
function cameraPlate(): string {
  const s = 420 / 480
  const crop = { x: 370, y: 155, width: 510 / s, height: 480 }
  const X = (u: number) => 650 + (u - crop.x) * s
  const Y = (v: number) => (v - crop.y) * s
  const cx = X(capture.center[0]), cy = Y(capture.center[1])
  const [left, top, right, bottom] = capture.bounds
  const halfAxis = (bottom - top) * .425
  const dx = Math.cos(capture.imageAxisRad) * halfAxis * s
  const dy = Math.sin(capture.imageAxisRad) * halfAxis * s
  const imageAttributes = `x="${650 - crop.x*s}" y="${-crop.y*s}" width="${capture.width*s}" height="${capture.height*s}"`
  const zoom = { x: (crop.x - 270) * .5, y: crop.y * .5, width: crop.width * .5, height: crop.height * .5 }
  return `<svg class="observer-camera-canvas" viewBox="0 0 1160 420" role="img" aria-labelledby="observer-photo-title observer-photo-desc">
    <title id="observer-photo-title">Capture caméra native et profondeur annotée du même carton</title>
    <desc id="observer-photo-desc">Images couleur et profondeur capturées dans Gazebo au même instant, 36,762 secondes. À gauche, vue du carton et du robot. À droite, agrandissement de la zone encadrée avec le masque réellement calculé, le centre à 577 et 401,5 pixels, et l’axe principal PCA. Profondeur médiane : 2,240 mètres. Résolution HD dédiée à l’illustration, géométrie de simulation simplifiée.</desc>
    <defs>
      <clipPath id="observer-rgb-clip"><rect width="600" height="420"/></clipPath>
      <clipPath id="observer-detail-clip"><rect x="650" width="510" height="420"/></clipPath>
      <marker id="observer-photo-arrow" markerWidth="11" markerHeight="11" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 6 6"><path d="M0 0L6 3L0 6Z" fill="#ed3f2f"/></marker>
      <marker id="observer-axis-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#f6ffff"/></marker>
    </defs>
    <g class="observer-camera-source" clip-path="url(#observer-rgb-clip)">
      <image href="./media/observer-camera/rgb.png" x="-135" y="0" width="960" height="720"/>
      <rect x="${zoom.x}" y="${zoom.y}" width="${zoom.width}" height="${zoom.height}" class="observer-photo-crop-halo"/>
      <rect x="${zoom.x}" y="${zoom.y}" width="${zoom.width}" height="${zoom.height}" class="observer-photo-crop"/>
      <path d="M${zoom.x+zoom.width} ${zoom.y+16}H371" class="observer-photo-leader"/>
      <rect x="371" y="${zoom.y-2}" width="196" height="37" rx="3" class="observer-photo-tag"/>
      <text x="383" y="${zoom.y+23}" class="observer-photo-label">Détail agrandi →</text>
      <rect x="18" y="368" width="217" height="34" rx="3" class="observer-photo-dark-tag"/>
      <text x="30" y="391" class="observer-photo-white observer-photo-small">Caméra fixe · vue zénithale</text>
    </g>
    <path d="M605 210H640" pathLength="1" class="observer-photo-flow" marker-end="url(#observer-photo-arrow)"/>
    <g class="observer-camera-extraction" clip-path="url(#observer-detail-clip)">
      <image href="./media/observer-camera/rgb.png" ${imageAttributes}/>
      <image class="observer-depth-layer" href="./media/observer-camera/depth.png" ${imageAttributes}/>
      <image class="observer-surface-layer" href="./media/observer-camera/surface-mask.png" ${imageAttributes}/>
      <rect x="${X(left)}" y="${Y(top)}" width="${(right-left+1)*s}" height="${(bottom-top+1)*s}" class="observer-photo-bounds"/>
      <path d="M${cx+dx} ${cy+dy}L${cx-dx} ${cy-dy}" class="observer-photo-axis-under"/>
      <path d="M${cx+dx} ${cy+dy}L${cx-dx} ${cy-dy}" class="observer-photo-axis" marker-end="url(#observer-axis-arrow)"/>
      <path d="M${cx-17} ${cy}H${cx+17}" class="observer-photo-axis"/>
      <circle cx="${cx}" cy="${cy}" r="9" fill="#174863" stroke="#f7ffff" stroke-width="2.5"/>
      <circle cx="${cx}" cy="${cy}" r="2.3" fill="#f7ffff"/>
      <path d="M${cx-dx} ${cy-dy+10}H967" class="observer-photo-leader"/>
      <rect x="967" y="${cy-dy-13}" width="173" height="60" rx="3" class="observer-photo-tag"/>
      <text x="979" y="${cy-dy+11}" class="observer-photo-label">Axe principal</text>
      <text x="979" y="${cy-dy+34}" class="observer-photo-small">orientation · PCA</text>
      <path d="M${cx+10} ${cy}H967" class="observer-photo-leader"/>
      <rect x="967" y="${cy-25}" width="173" height="62" rx="3" class="observer-photo-tag"/>
      <text x="979" y="${cy-1}" class="observer-photo-label">Centre détecté</text>
      <text x="979" y="${cy+23}" class="observer-photo-small">577 ; 401,5 px</text>
      <rect x="669" y="373" width="298" height="32" rx="3" class="observer-photo-dark-tag"/>
      <text x="681" y="396" class="observer-photo-white observer-photo-small">Dessus retenu · profondeur 2,240 m</text>
    </g>
  </svg>`
}

export function mountObserverFigure(): () => void {
  const stage = document.querySelector<HTMLElement>('#prehension .slide-stage')
  if (!stage) return () => {}
  const slide = stage.closest<HTMLElement>('#prehension')
  const host = stage.querySelector<HTMLElement>('[data-observer-camera]')
  if (host) host.innerHTML = cameraPlate()
  const pose = stage.querySelector<HTMLElement>('[data-observer-pose]')
  const fr = (n: number) => n.toFixed(3).replace('.', ',')
  if (pose) pose.innerHTML = capture.position.map((value, index) => `<div><dt>${['X','Y','Z'][index]} <small>m</small></dt><dd>${fr(value)}</dd></div>`).join('') + '<div><dt>θ <small>°</small></dt><dd>≈ 0</dd></div>'

  const handlers: Array<() => void> = []
  const live = stage.querySelector<HTMLElement>('[data-observer-live]')
  const labels = [
    'Capter les deux flux synchronisés', 'Isoler le dessus du carton',
    'Projeter la pose dans la cellule', 'A — Présence du carton',
    'B — Validité des flux et de l’estimation', 'C — Fraîcheur de l’observation',
    'D — Association au carton courant', 'Pose acceptée si les quatre contrôles passent',
  ]
  const params = new URLSearchParams(window.location.search)
  const layoutQuery = window.matchMedia('(min-aspect-ratio: 4 / 5)')
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const isProgressive = () => layoutQuery.matches && !params.has('capture') && !params.has('print')
    && params.get('motion') !== 'off' && !motionQuery.matches
  let cue = isProgressive() ? 0 : labels.length - 1
  let wheelLockedUntil = 0
  let lastWheelAt = -Infinity

  const setCue = (next: number, announce = true) => {
    cue = isProgressive() ? Math.max(0, Math.min(labels.length - 1, next)) : labels.length - 1
    const phase = Math.min(cue, 3)
    // Keep both immersion copies aligned with the presenter, in either direction.
    const stages = [stage, ...document.querySelectorAll<HTMLElement>('.pipeline-camera .observer-stage')]
    stages.forEach(view => {
      view.dataset.observerStatic = String(!isProgressive())
      view.dataset.observerStep = String(phase)
      view.dataset.observerCueIndex = String(cue)
      view.dataset.observerComplete = String(cue === 7)
      view.querySelectorAll<HTMLElement>('[data-observer-script]').forEach(script => {
        const current = Number(script.dataset.observerScript) === phase
        script.classList.toggle('is-current', current)
        script.setAttribute('aria-hidden', String(!current))
      })
      view.querySelectorAll<HTMLButtonElement>('[data-observer-beat]').forEach(beat => {
        const index = Number(beat.dataset.observerBeat)
        beat.classList.toggle('is-past', index < phase)
        if (index === phase) beat.setAttribute('aria-current', 'step')
        else beat.removeAttribute('aria-current')
      })
      view.querySelectorAll<HTMLButtonElement>('[data-observer-cue]').forEach(button => {
        const current = isProgressive() && Number(button.dataset.observerCue) === cue
        if (current) button.setAttribute('aria-current', 'step')
        else button.removeAttribute('aria-current')
        button.closest('li')?.classList.toggle('is-current', current)
      })
    })
    if (announce && live) live.textContent = `Observer, temps ${cue + 1} sur ${labels.length} : ${labels[cue]}.`
  }
  setCue(cue, false)

  stage.querySelectorAll<HTMLButtonElement>('[data-observer-beat], [data-observer-cue]').forEach(button => {
    const click = (event: MouseEvent) => {
      setCue(Number(button.dataset.observerCue ?? button.dataset.observerBeat))
      if (event.detail > 0) button.blur()
    }
    button.addEventListener('click', click)
    handlers.push(() => button.removeEventListener('click', click))
  })

  const settled = () => slide?.classList.contains('is-active') && Math.abs(slide.getBoundingClientRect().top) < 3
  const key = (event: KeyboardEvent) => {
    if (!isProgressive() || !settled() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    const interactive = event.target instanceof Element && Boolean(event.target.closest('button, a, input, textarea, select, [contenteditable="true"]'))
    const cameraPan = event.target === host && host && host.scrollWidth > host.clientWidth
    if (interactive || cameraPan) return
    const forward = ['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key) && !event.shiftKey
    const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
    if (!forward && !backward) return
    if (event.repeat) { event.preventDefault(); event.stopImmediatePropagation(); return }
    const next = cue + (forward ? 1 : -1)
    if (next < 0 || next >= labels.length) return
    event.preventDefault()
    event.stopImmediatePropagation()
    setCue(next)
  }
  window.addEventListener('keydown', key, true)
  handlers.push(() => window.removeEventListener('keydown', key, true))

  const wheel = (event: WheelEvent) => {
    if (!isProgressive() || !settled() || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    const now = performance.now()
    const continuingGesture = now - lastWheelAt < 190
    lastWheelAt = now
    if (now < wheelLockedUntil || continuingGesture) {
      event.preventDefault(); event.stopImmediatePropagation(); return
    }
    const next = cue + Math.sign(event.deltaY)
    if (next < 0 || next >= labels.length) return
    event.preventDefault(); event.stopImmediatePropagation()
    wheelLockedUntil = now + 520
    setCue(next)
  }
  window.addEventListener('wheel', wheel, { capture: true, passive: false })
  handlers.push(() => window.removeEventListener('wheel', wheel, true))

  const active = (event: Event) => {
    const detail = (event as CustomEvent<{ id: string; direction: number }>).detail
    if (detail.id !== 'prehension') return
    setCue(isProgressive() ? (detail.direction < 0 ? labels.length - 1 : 0) : labels.length - 1, false)
    wheelLockedUntil = 0
    lastWheelAt = -Infinity
  }
  window.addEventListener('deck:slide-active', active)
  handlers.push(() => window.removeEventListener('deck:slide-active', active))
  const onLayoutChange = () => setCue(isProgressive() ? 0 : labels.length - 1, false)
  layoutQuery.addEventListener('change', onLayoutChange)
  handlers.push(() => layoutQuery.removeEventListener('change', onLayoutChange))
  if (host) {
    const pan = (event: KeyboardEvent) => {
      if (host.scrollWidth <= host.clientWidth || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
      event.preventDefault()
      event.stopPropagation()
      host.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * host.clientWidth * .8 })
    }
    host.addEventListener('keydown', pan)
    handlers.push(() => host.removeEventListener('keydown', pan))
  }
  stage.querySelectorAll<HTMLButtonElement>('[data-observer-channel]').forEach(button => {
    const click = () => {
      const channel = button.dataset.observerChannel!
      document.querySelectorAll<HTMLElement>('.observer-measurement[data-camera-mode]').forEach(element => { element.dataset.cameraMode = channel })
      document.querySelectorAll<HTMLButtonElement>('[data-observer-channel]').forEach(element => element.setAttribute('aria-pressed', String(element.dataset.observerChannel === channel)))
      button.blur()
    }
    button.addEventListener('click', click)
    handlers.push(() => button.removeEventListener('click', click))
  })

  const layout = () => {
    const from = stage.querySelector<HTMLElement>('.observer-pose__port')
    const to = stage.querySelector<HTMLElement>('.observer-supervision__port')
    const svg = stage.querySelector<SVGSVGElement>('.observer-handoff')
    if (!from || !to || !svg || !from.offsetWidth) return
    const origin = svg.getBoundingClientRect()
    const start = from.getBoundingClientRect(), end = to.getBoundingClientRect()
    const scale = stage.getBoundingClientRect().width / stage.offsetWidth || 1
    const x1 = (start.right - origin.left) / scale
    const y1 = (start.top + start.height / 2 - origin.top) / scale
    const x2 = (end.left - origin.left) / scale
    const y2 = (end.top + end.height / 2 - origin.top) / scale
    const mid = (x1 + x2) / 2
    svg.querySelector('path')?.setAttribute('d', `M${x1},${y1}H${mid}V${y2}H${x2 - 7}`)
    svg.querySelector('polygon')?.setAttribute('points', `${x2},${y2} ${x2-10},${y2-5} ${x2-10},${y2+5}`)
    document.querySelectorAll<SVGSVGElement>('.pipeline-camera .observer-handoff').forEach(clone => { clone.innerHTML = svg.innerHTML })
  }
  layout()
  void document.fonts.ready.then(layout)
  const observer = new ResizeObserver(layout)
  observer.observe(stage)
  return () => { observer.disconnect(); handlers.forEach(dispose => dispose()) }
}
