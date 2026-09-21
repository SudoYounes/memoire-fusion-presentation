type Point = { x: number; y: number }
type Strip = { element: HTMLDivElement; copy: HTMLElement; distance: number }

// Sample the sheet along a diagonal from its upper-right corner. Each narrow
// band follows a different tangent of a cylinder, so the paper bends while its
// native HTML text follows the surface. No screenshot, canvas or new dependency.
const STRIP_COUNT = 96
export const PAGE_CURL_DURATION = 1350

function clipAt(points: Point[], distance: (point: Point) => number, boundary: number, keepAbove: boolean): Point[] {
  const result: Point[] = []
  points.forEach((point, index) => {
    const previous = points[(index + points.length - 1) % points.length]
    const here = distance(point) - boundary
    const there = distance(previous) - boundary
    const inside = keepAbove ? here >= 0 : here <= 0
    const wasInside = keepAbove ? there >= 0 : there <= 0
    if (inside !== wasInside) {
      const t = there / (there - here)
      result.push({ x: previous.x + t * (point.x - previous.x), y: previous.y + t * (point.y - previous.y) })
    }
    if (inside) result.push(point)
  })
  return result
}

function polygon(points: Point[]): string {
  return points.length ? `polygon(${points.map(point => `${point.x.toFixed(2)}px ${point.y.toFixed(2)}px`).join(',')})` : 'polygon(0 0,0 0,0 0)'
}

export function createIndustrialPageCurl(card: HTMLElement) {
  const viewport = card.querySelector<HTMLElement>('.industrial-pages')
  const sheet = card.querySelector<HTMLElement>('.industrial-page--sheet')
  let overlay: HTMLDivElement | null = null
  let shadow: HTMLDivElement | null = null
  let strips: Strip[] = []
  let frame = 0
  let progress = 0
  let target = false
  let width = 0
  let height = 0
  let nx = 0
  let ny = 0
  let extent = 0
  let page: Point[] = []
  const distance = (point: Point) => nx * (point.x - width) + ny * point.y
  const band = (from: number, to: number) => clipAt(clipAt(page, distance, from, true), distance, to, false)

  const clear = () => {
    cancelAnimationFrame(frame)
    frame = 0
    overlay?.remove()
    overlay = null
    shadow = null
    strips = []
    card.classList.remove('is-curling')
  }

  const prepare = () => {
    if (!viewport || !sheet) return false
    width = viewport.clientWidth
    height = viewport.clientHeight
    if (!width || !height) return false
    const length = Math.hypot(width, height * .68)
    nx = -width / length
    ny = height * .68 / length
    extent = -nx * width + ny * height
    page = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }]

    overlay = document.createElement('div')
    overlay.className = 'industrial-page-curl'
    overlay.setAttribute('aria-hidden', 'true')
    overlay.inert = true
    shadow = document.createElement('div')
    shadow.className = 'industrial-page-curl__shadow'
    overlay.append(shadow)
    for (let i = 0; i < STRIP_COUNT; i++) {
      const element = document.createElement('div')
      element.className = 'industrial-page-curl__strip'
      // A subpixel overlap avoids hairline gaps between adjacent tangents.
      element.style.clipPath = polygon(band(i * extent / STRIP_COUNT - .8, (i + 1) * extent / STRIP_COUNT + .8))
      const copy = sheet.cloneNode(true) as HTMLElement
      copy.classList.remove('industrial-page--sheet')
      copy.removeAttribute('data-industrial-page')
      copy.removeAttribute('id')
      copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'))
      copy.setAttribute('aria-hidden', 'true')
      copy.inert = true
      element.append(copy)
      overlay.append(element)
      strips.push({ element, copy, distance: (i + .5) * extent / STRIP_COUNT })
    }
    viewport.append(overlay)
    card.classList.add('is-curling')
    return true
  }

  const render = () => {
    const radius = Math.min(width, height) * (.12 + .025 * Math.sin(Math.PI * progress))
    const crease = progress * (extent + Math.PI * radius / 2 + 12)
    const camera = Math.max(width, height) * 3.5
    const corner = nx * width
    const gradientAngle = Math.atan2(nx, -ny) * 180 / Math.PI
    strips.forEach(({ element, copy, distance: s }) => {
      const angle = Math.max(0, Math.min(Math.PI, (crease - s) / radius))
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const projected = angle >= Math.PI ? 2 * crease - s - Math.PI * radius : angle > 0 ? crease - radius * sin : s
      const z = radius * (1 - cos)
      const offset = projected - cos * s - (cos - 1) * corner
      const tx = nx * offset
      const ty = ny * offset
      const tz = z + sin * (corner + s)
      const matrix = [
        1 + nx * nx * (cos - 1), nx * ny * (cos - 1), -nx * sin, 0,
        nx * ny * (cos - 1), 1 + ny * ny * (cos - 1), -ny * sin, 0,
        nx * sin, ny * sin, cos, 0,
        tx, ty, tz, 1,
      ]
      element.style.transform = `translate(${width / 2}px,${height / 2}px) perspective(${camera}px) translate(${-width / 2}px,${-height / 2}px) matrix3d(${matrix.join(',')})`
      element.style.zIndex = String(Math.round(z * 10) + 1)
      copy.style.visibility = cos < 0 ? 'hidden' : 'visible'
      // The lifted back catches light, while the inside of the bend darkens.
      const halfBand = extent / STRIP_COUNT / 2
      const shadeAt = (position: number) => {
        const bend = Math.sin(Math.max(0, Math.min(Math.PI, (crease - position) / radius)))
        return cos < 0 ? `rgb(221 237 227 / ${.10 + .24 * bend})` : `rgb(0 24 32 / ${.19 * bend})`
      }
      const start = s - halfBand
      const end = s + halfBand
      element.style.setProperty('--curl-shading', `linear-gradient(${gradientAngle}deg, ${shadeAt(start)} ${100 * start / extent}%, ${shadeAt(end)} ${100 * end / extent}%)`)
    })
    if (shadow) {
      shadow.style.clipPath = polygon(band(crease - radius * 1.7, crease + radius * .2))
      shadow.style.opacity = String(.25 * Math.sin(Math.PI * progress))
    }
  }

  const set = (turned: boolean, animate: boolean) => {
    if (target === turned && animate) return
    target = turned
    cancelAnimationFrame(frame)
    if (!animate) { progress = turned ? 1 : 0; clear(); return }
    if (!overlay && !prepare()) { progress = turned ? 1 : 0; return }
    const from = progress
    const to = turned ? 1 : 0
    const duration = PAGE_CURL_DURATION * Math.max(.3, Math.abs(to - from))
    const started = performance.now()
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - started) / duration)
      const eased = elapsed * elapsed * elapsed * (elapsed * (elapsed * 6 - 15) + 10)
      progress = from + (to - from) * eased
      render()
      if (elapsed < 1) frame = requestAnimationFrame(tick)
      else clear()
    }
    render()
    frame = requestAnimationFrame(tick)
  }
  const finish = () => { progress = target ? 1 : 0; clear() }
  return { set, finish, dispose: clear }
}
