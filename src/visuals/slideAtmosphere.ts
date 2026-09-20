const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const VIEWBOX_WIDTH = 1600
const VIEWBOX_HEIGHT = 900
const TRIANGLE_SIDE = 280
const TRIANGLE_HEIGHT = Math.sqrt(3) * TRIANGLE_SIDE / 2
const GRADE_COUNT = 8

type Point = { x: number; y: number }
type Facet = { path: string; grade: number }

function coordinate(value: number): string {
  return Number(value.toFixed(2)).toString()
}

function createFacet(points: [Point, Point, Point]): Facet {
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / 3
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / 3

  // Broad tonal waves coordinate neighbours; the small local variation keeps
  // the tessellation from reading as alternating lit faces of a 3D solid.
  const field = 0.5
    + 0.24 * Math.sin(centerX / 370 + centerY / 280)
    + 0.17 * Math.cos(centerX / 230 - centerY / 360)
    + 0.09 * Math.sin(centerX / 97 + centerY / 139)
  const grade = Math.round(Math.max(0, Math.min(1, field)) * (GRADE_COUNT - 1))
  const path = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'}${coordinate(point.x)} ${coordinate(point.y)}`,
  ).join('') + 'Z'

  return { path, grade }
}

function buildTriangleMesh(): Facet[] {
  const facets: Facet[] = []
  const rowCount = Math.ceil(VIEWBOX_HEIGHT / TRIANGLE_HEIGHT)
  const columnCount = Math.ceil(VIEWBOX_WIDTH / TRIANGLE_SIDE)

  for (let row = 0; row < rowCount; row += 1) {
    const y = row * TRIANGLE_HEIGHT
    const nextY = (row + 1) * TRIANGLE_HEIGHT
    const rowOffset = (row % 2) * TRIANGLE_SIDE / 2

    for (let column = -1; column <= columnCount; column += 1) {
      const x = column * TRIANGLE_SIDE + rowOffset

      // Both orientations share exactly the same vertices. Every cell has a
      // graded fill; there is no independent grid or separation stroke.
      facets.push(createFacet([
        { x, y },
        { x: x + TRIANGLE_SIDE, y },
        { x: x + TRIANGLE_SIDE / 2, y: nextY },
      ]))
      facets.push(createFacet([
        { x, y },
        { x: x + TRIANGLE_SIDE / 2, y: nextY },
        { x: x - TRIANGLE_SIDE / 2, y: nextY },
      ]))
    }
  }

  return facets
}

const triangleMesh = buildTriangleMesh()

function atmosphereGeometry(index: number): string {
  const prefix = `mesh-${index}`
  const gradients = Array.from({ length: GRADE_COUNT }, (_, grade) => {
    const tone = grade / (GRADE_COUNT - 1)

    // All cells follow one soft colour direction, with no bevel or edge light.
    return `
      <linearGradient id="${prefix}-grade-${grade}" x1="0%" y1="0%" x2="100%" y2="75%">
        <stop offset="0%" class="atmosphere__tone" stop-opacity="${coordinate(0.06 + tone * 0.36)}" />
        <stop offset="58%" class="atmosphere__tone" stop-opacity="${coordinate(0.16 + tone * 0.78)}" />
        <stop offset="100%" class="atmosphere__tone" stop-opacity="${coordinate(0.1 + tone * 0.49)}" />
      </linearGradient>
    `
  }).join('')

  return `
    <defs>
      ${gradients}
      <radialGradient id="${prefix}-falloff" cx="50%" cy="47%" r="66%">
        <stop offset="0%" stop-color="white" stop-opacity="0.09" />
        <stop offset="34%" stop-color="white" stop-opacity="0.2" />
        <stop offset="74%" stop-color="white" stop-opacity="0.78" />
        <stop offset="100%" stop-color="white" stop-opacity="1" />
      </radialGradient>
      <mask id="${prefix}-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${VIEWBOX_WIDTH}" height="${VIEWBOX_HEIGHT}">
        <rect width="${VIEWBOX_WIDTH}" height="${VIEWBOX_HEIGHT}" fill="url(#${prefix}-falloff)" />
      </mask>
    </defs>
    <g class="atmosphere__mesh" mask="url(#${prefix}-mask)">
      ${triangleMesh.map(({ path, grade }) =>
        `<path class="atmosphere__facet" d="${path}" fill="url(#${prefix}-grade-${grade})" />`,
      ).join('')}
    </g>
  `
}

export function mountSlideAtmospheres(): void {
  document.querySelectorAll<HTMLElement>('.slide-stage').forEach((stage, index) => {
    if (stage.querySelector('.slide-atmosphere')) return

    const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
    svg.classList.add('slide-atmosphere')
    svg.setAttribute('viewBox', `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('focusable', 'false')
    svg.innerHTML = atmosphereGeometry(index)
    stage.prepend(svg)
  })
}
