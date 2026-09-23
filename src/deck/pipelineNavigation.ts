import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const steps = [
  { id: 'modeles-contrats', label: 'Décrire — Modèles & contrats' },
  { id: 'prehension', label: 'Observer — Perception' },
  { id: 'dynamique', label: 'Préparer — Trajectoire vérifiée' },
  { id: 'stack', label: 'Exécuter — Commande & physique' },
  { id: 'indexeur', label: 'Décider — Orchestration' },
  { id: 'cycle', label: 'Évaluer — Résultats' },
] as const

/** Clone visual content with its own SVG definitions and no animation residue. */
function cloneVisual<T extends Element>(original: T, prefix: string): T {
  const clone = original.cloneNode(true) as T
  const ids = new Map<string, string>()
  clone.querySelectorAll<Element>('[id]').forEach(element => {
    ids.set(element.id, prefix + element.id)
    element.id = prefix + element.id
  })
  clone.querySelectorAll<HTMLElement | SVGElement>('*').forEach(element => {
    for (const attribute of Array.from(element.attributes)) {
      let value = attribute.value
      ids.forEach((replacement, id) => {
        value = value.replaceAll('url(#' + id + ')', 'url(#' + replacement + ')')
        if (attribute.name === 'aria-labelledby') value = value.split(' ').map(token => ids.get(token) ?? token).join(' ')
      })
      if (value !== attribute.value) element.setAttribute(attribute.name, value)
    }
    if (element.matches('[data-reveal], [data-visual], [data-pipeline-visual], [data-ce-node], [data-ce-wire], [data-ce-foundation]')) {
      for (const property of ['opacity', 'visibility', 'transform', 'filter']) element.style.removeProperty(property)
    }
    if (element.matches('.pipeline-wire, .ce-pipeline__wire')) element.style.strokeDashoffset = '0'
  })
  clone.querySelectorAll<SVGMarkerElement>('marker').forEach(marker => {
    const source = document.getElementById(marker.id.slice(prefix.length))?.querySelector('path')
    const path = marker.querySelector('path')
    if (source && path) path.style.fill = getComputedStyle(source).fill
  })
  clone.querySelectorAll<SVGElement>('.ce-pipeline__node-frame').forEach(frame => {
    frame.style.filter = 'none'
  })
  return clone
}

/** The same six nodes and return loop as the overview, with one active place. */
export function mountPipelineMaps(): void {
  const master = document.querySelector<SVGSVGElement>('#chaine-numerique .ce-pipeline__canvas')
  if (!master) return
  steps.forEach((step, active) => {
    const slide = document.getElementById(step.id)
    const stage = slide?.querySelector<HTMLElement>('.slide-stage')
    if (!slide || !stage) return
    slide.dataset.pipelineNode = String(active)
    const nav = document.createElement('nav')
    nav.className = 'pipeline-minimap'
    nav.setAttribute('aria-label', 'Position dans la chaîne numérique : ' + step.label)
    const svg = cloneVisual(master, 'minimap-' + active + '-')
    svg.classList.add('pipeline-minimap__graph')
    svg.setAttribute('viewBox', '0 150 1780 275')
    svg.removeAttribute('role')
    svg.querySelectorAll('.ce-pipeline__foundation, .ce-pipeline__legend, .ce-pipeline__detail, .ce-pipeline__divider, .ce-pipeline__label, .ce-pipeline__label-bg, .ce-pipeline__feedback-label, .ce-pipeline__feedback-label-bg').forEach(element => element.remove())
    svg.querySelectorAll<SVGGElement>('[data-ce-node]').forEach((node, index) => {
      const link = document.createElementNS('http://www.w3.org/2000/svg', 'a')
      link.setAttribute('href', '#' + steps[index].id)
      link.setAttribute('aria-label', steps[index].label)
      if (index === active) {
        link.setAttribute('aria-current', 'step')
        node.classList.add('is-minimap-active')
      }
      node.replaceWith(link)
      link.append(node)
    })
    nav.append(svg)
    stage.querySelector('.pipeline-context')?.remove()
    stage.append(nav)
  })
}

type Camera = { scale: number; x: number; y: number }

function alignModelOutlet(stage: HTMLElement) {
  const body = stage.querySelector<HTMLElement>('.models-source--bodies')
  const lanes = stage.querySelector<HTMLElement>('.models-lanes')
  if (!body || !lanes) return
  const from = body.getBoundingClientRect()
  const to = lanes.getBoundingClientRect()
  const scale = stage.getBoundingClientRect().width / stage.offsetWidth || 1
  lanes.style.setProperty('--models-branch-y', (from.top + from.height / 2 - to.top) / scale + 'px')
}

/** One scroll interval = pull out, read the master map, then enter the next node. */
export function setupPipelineZooms(): () => void {
  const overview = document.getElementById('chaine-numerique')
  const master = overview?.querySelector<HTMLElement>('.slide-stage')
  const frames = overview?.querySelectorAll<SVGRectElement>('.ce-pipeline__canvas > [data-ce-node] .ce-pipeline__node-frame')
  if (!overview || !master || !frames || frames.length !== steps.length) return () => {}
  const sequence = [overview, ...steps.map(step => document.getElementById(step.id))]
  const disposers: (() => void)[] = []

  for (let index = 0; index < sequence.length - 1; index++) {
    const from = sequence[index]
    const to = sequence[index + 1]
    const fromStage = from?.querySelector<HTMLElement>('.slide-stage')
    const toStage = to?.querySelector<HTMLElement>('.slide-stage')
    if (!from || !to || !fromStage || !toStage) continue
    const intro = index === 0
    const fromNode = index - 1
    const toNode = index
    const overlay = document.createElement('div')
    overlay.className = 'pipeline-camera'
    overlay.setAttribute('aria-hidden', 'true')
    overlay.setAttribute('inert', '')
    const viewport = document.createElement('div')
    viewport.className = 'pipeline-camera__viewport'
    overlay.append(viewport)

    const addPane = (stage: HTMLElement, name: string, theme: string) => {
      const pane = document.createElement('div')
      pane.className = 'pipeline-camera__pane ' + theme
      pane.dataset.cameraPane = name
      const clone = cloneVisual(stage, 'camera-' + index + '-' + name + '-')
      pane.append(clone)
      viewport.append(pane)
      return { pane, clone }
    }
    const graph = addPane(master, 'graph', 'theme-paper')
    const departing = intro ? null : addPane(fromStage, 'departing', from.dataset.theme === 'dark' ? 'theme-ink' : from.classList.contains('theme-mist') ? 'theme-mist' : 'theme-paper')
    const arriving = addPane(toStage, 'arriving', to.dataset.theme === 'dark' ? 'theme-ink' : to.classList.contains('theme-mist') ? 'theme-mist' : 'theme-paper')
    document.body.append(overlay)

    let cameras: Camera[] = []
    const measure = () => {
      const stage = master.getBoundingClientRect()
      cameras = Array.from(frames, frame => {
        const rect = frame.getBoundingClientRect()
        const scale = Math.max(stage.width / rect.width, stage.height / rect.height) * 1.03
        return {
          scale,
          x: stage.width / 2 - (rect.left - stage.left + rect.width / 2) * scale,
          y: stage.height / 2 - (rect.top - stage.top + rect.height / 2) * scale,
        }
      })
      alignModelOutlet(arriving.clone)
      if (departing) alignModelOutlet(departing.clone)
    }
    measure()
    const nodes = graph.clone.querySelectorAll<SVGGElement>('.ce-pipeline__canvas > [data-ce-node]')
    const targetCopy = nodes[toNode].querySelectorAll('text, line, circle')
    const targetFrame = nodes[toNode].querySelector('.ce-pipeline__node-frame')
    const targetCamera = () => cameras[toNode]
    const timeline = gsap.timeline({ paused: true })

    if (departing) {
      const previousCamera = () => cameras[fromNode]
      timeline
        .fromTo(graph.pane, {
          x: () => previousCamera().x, y: () => previousCamera().y, scale: () => previousCamera().scale,
        }, { x: 0, y: 0, scale: 1, duration: .36, ease: 'power2.inOut' }, 0)
        .fromTo(departing.pane, { x: 0, y: 0, scale: 1, opacity: 1 }, {
          x: () => -previousCamera().x / previousCamera().scale,
          y: () => -previousCamera().y / previousCamera().scale,
          scale: () => 1 / previousCamera().scale,
          duration: .36, ease: 'power2.inOut',
        }, 0)
        .to(departing.pane, { opacity: 0, duration: .18, ease: 'power1.inOut' }, .17)
        .fromTo(nodes[fromNode].querySelectorAll('text, line, circle'), { opacity: 0 }, { opacity: 1, duration: .17 }, .18)
        .fromTo(nodes[fromNode].querySelector('.ce-pipeline__node-frame'), { fill: '#f5e8d5', stroke: '#b9782c', strokeWidth: 3 }, { fill: '#fbfcfa', stroke: '#174863', strokeWidth: 1.65, duration: .1 }, .43)
        .to(targetFrame, { fill: '#e5f1ef', stroke: '#087f8c', strokeWidth: 3, duration: .1 }, .48)
    } else {
      timeline.set(graph.pane, { x: 0, y: 0, scale: 1 }, 0)
      timeline.to(targetFrame, { fill: '#f5e8d5', stroke: '#b9782c', strokeWidth: 3, duration: .13 }, 0)
    }

    const enterAt = intro ? .08 : .62
    const enterDuration = 1 - enterAt
    timeline
      .to(graph.pane, {
        x: () => targetCamera().x, y: () => targetCamera().y, scale: () => targetCamera().scale,
        duration: enterDuration, ease: 'power2.inOut',
      }, enterAt)
      .to(targetCopy, { opacity: 0, duration: intro ? .26 : .14, ease: 'power1.in' }, intro ? .35 : .72)
      .fromTo(arriving.pane, {
        x: () => -targetCamera().x / targetCamera().scale,
        y: () => -targetCamera().y / targetCamera().scale,
        scale: () => 1 / targetCamera().scale,
      }, { x: 0, y: 0, scale: 1, duration: enterDuration, ease: 'power2.inOut' }, enterAt)
      .fromTo(arriving.pane, { opacity: 0 }, { opacity: 1, duration: intro ? .3 : .18, ease: 'power1.inOut' }, intro ? .7 : .82)

    const show = (progress: number) => {
      overlay.style.visibility = progress > .00001 && progress < .99999 ? 'visible' : 'hidden'
    }
    const trigger = ScrollTrigger.create({
      id: intro ? 'pipeline-enter-models' : 'pipeline-' + from.id + '-to-' + to.id,
      trigger: from, start: 'top top', endTrigger: to, end: 'top top',
      animation: timeline, scrub: true, invalidateOnRefresh: true,
      onRefreshInit: measure,
      onUpdate: self => show(self.progress),
      onRefresh: self => show(self.progress),
    })
    disposers.push(() => { trigger.kill(); timeline.kill(); overlay.remove() })
  }
  return () => disposers.reverse().forEach(dispose => dispose())
}
