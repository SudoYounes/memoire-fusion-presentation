import { gsap } from 'gsap'

type Node = { id: string; cue: number; x: number; y: number; w: number; h: number; label: string; title: string; detail: string; software: string }
const nodes: Node[] = [
  { id: 'destination', cue: 1, x: 100, y: 74, w: 270, h: 116, label: '01 · PRÉPARER', title: 'Choisir la destination', detail: 'Emplacement libre · support présent', software: 'État de palette + perception admise' },
  { id: 'grasp', cue: 2, x: 490, y: 74, w: 270, h: 116, label: '02 · PRENDRE', title: 'Confirmer la prise', detail: 'Vide → attachement → libération', software: 'Gazebo ↔ scène MoveIt' },
  { id: 'transfer', cue: 3, x: 880, y: 74, w: 270, h: 116, label: '03 · TRANSFÉRER', title: 'Exécuter le transfert', detail: 'Trajectoire vérifiée · états suivis', software: 'MoveIt 2 · ROS 2' },
  { id: 'deposit', cue: 4, x: 1270, y: 74, w: 270, h: 116, label: '04 · DÉPOSER', title: 'Valider la dépose', detail: 'Stabiliser → libérer → vérifier', software: 'Pose & contacts · Gazebo' },
  { id: 'clearance', cue: 5, x: 1270, y: 348, w: 270, h: 116, label: '05 · DÉGAGER', title: 'Dégager l’outil', detail: 'Retour validé en amont', software: 'Hauteur J4 mesurée · /joint_states' },
  { id: 'robot', cue: 5, x: 760, y: 286, w: 320, h: 94, label: 'ROBOT', title: 'Poursuivre le retour à vide', detail: '', software: 'Exécution et états articulaires suivis' },
  { id: 'indexer', cue: 5, x: 760, y: 448, w: 320, h: 94, label: 'INDEXEUR · SI NÉCESSAIRE', title: 'Présenter la rangée suivante', detail: '', software: 'PalletIndexerController · pose_command' },
  { id: 'authorize', cue: 6, x: 130, y: 347, w: 385, h: 118, label: '06 · SYNCHRONISER', title: 'Autoriser le carton suivant', detail: 'Retour terminé · présentation confirmée', software: 'Mesures récentes · scène cohérente' },
]

type Edge = { id: string; d: string; cues: number[]; label?: string; x?: number; y?: number; order?: number; anchor?: string }
const edges: Edge[] = [
  { id: 'observation', d: 'M235 42 V74', cues: [1] },
  { id: 'target', d: 'M370 132 H490', cues: [2], label: 'cible · rangée', x: 430, y: 117 },
  { id: 'attached', d: 'M760 132 H880', cues: [3], label: 'charge attachée', x: 820, y: 117 },
  { id: 'executed', d: 'M1150 132 H1270', cues: [4], label: 'fin du mouvement', x: 1210, y: 117 },
  { id: 'placed', d: 'M1405 190 V348', cues: [4, 5], label: 'dépose vérifiée', x: 1387, y: 251, anchor: 'end', order: 1 },
  { id: 'clear', d: 'M1270 406 H1172', cues: [5], order: 2 },
  { id: 'robot-command', d: 'M1166 333 H1080', cues: [5], order: 3 },
  { id: 'index-command', d: 'M1166 495 H1080', cues: [5], order: 3 },
  { id: 'robot-done', d: 'M760 333 H631', cues: [6], label: 'retour terminé', x: 695, y: 315 },
  { id: 'index-done', d: 'M760 495 H631', cues: [6], label: 'acquittement', x: 695, y: 477 },
  { id: 'join', d: 'M623 406 H515', cues: [6], order: 1 },
  { id: 'next', d: 'M130 406 H47 V132 H100', cues: [7] },
]

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const nodeMarkup = (n: Node) => `<g class="of-node" data-of-node="${n.id}" data-of-cues="${n.cue}" data-orch-goto="${n.cue}" tabindex="0" role="button" aria-label="${escape(n.title)} : éclairer cette phase" transform="translate(${n.x} ${n.y})">
  <rect class="of-node-surface" width="${n.w}" height="${n.h}" rx="7"/>
  <path class="of-node-accent" d="M16 0 H${n.w - 16}"/>
  <text class="of-node-label" x="20" y="24">${escape(n.label)}</text>
  <text class="of-node-title" x="20" y="54">${escape(n.title)}</text>
  ${n.detail ? `<text class="of-node-detail" x="20" y="77">${escape(n.detail)}</text>` : ''}
  <text class="of-node-software" x="20" y="${n.h - 15}">${escape(n.software)}</text>
</g>`
const edgeMarkup = (edge: Edge) => `<g class="of-edge" data-of-edge="${edge.id}" data-of-cues="${edge.cues.join(' ')}" data-of-order="${edge.order ?? 0}">
  <path class="of-edge-base" d="${edge.d}" marker-end="url(#of-arrow-muted)"/>
  <path class="of-edge-lit" d="${edge.d}" pathLength="1" marker-end="url(#of-arrow-red)"/>
  <path class="of-edge-pulse" d="${edge.d}" pathLength="1"/>
  ${edge.label ? `<text class="of-edge-label" x="${edge.x}" y="${edge.y}" text-anchor="${edge.anchor ?? 'middle'}">${escape(edge.label)}</text>` : ''}
</g>`

export const flowCues = [
  {
    label: 'Vue d’ensemble',
    text: 'Observer, agir, confirmer : l’état du procédé fait avancer le cycle.',
    script: 'La pose du carton est maintenant exploitable. Notre programme <strong>MultiCartonCycle</strong>, écrit en Python avec rclpy, coordonne le cycle dans ROS&nbsp;2. En haut, nous suivons le carton jusqu’à sa dépose. En bas, nous préparons la suite. Chaque phase attend une confirmation avant de progresser.',
  },
  {
    label: '01 · Préparer',
    text: 'Une pose admise, une destination libre et supportée, une rangée confirmée.',
    script: 'À partir de la pose admise, nous choisissons un <strong>emplacement libre avec le support requis</strong>. La mémoire des déposes validées guide ce choix. Pour passer à la couche suivante, la précédente doit être complète. Nous attendons aussi la confirmation de la bonne rangée avant la prise.',
  },
  {
    label: '02 · Prendre',
    text: 'Confirmer la prise physique, puis répercuter la charge dans MoveIt.',
    script: 'À la pose de prise, nous attendons le vide puis la <strong>confirmation de l’attachement dans Gazebo</strong>. Nous libérons ensuite le maintien au poste d’alimentation. Avant le transfert, nous représentons aussi le carton comme une charge attachée dans MoveIt, pour garder les deux scènes cohérentes.',
  },
  {
    label: '03 · Transférer',
    text: 'Contrôler le passage dans la scène actualisée ; suivre le résultat du mouvement.',
    script: 'L’orchestrateur fournit la destination et le cas de charge. Notre programme construit les corridors, puis <strong>MoveIt vérifie les états dans la scène actualisée</strong>, avec les cartons déjà déposés. Pendant le transfert, nous suivons le résultat du mouvement et les états articulaires. La dépose reste encore à vérifier.',
  },
  {
    label: '04 · Déposer',
    text: 'La pose et le support vérifiés transforment la destination en emplacement occupé.',
    script: 'Nous attendons une stabilisation mesurée avant de libérer le carton. Après confirmation du détachement et mise à jour de MoveIt, de nouvelles observations de pose et de contacts <strong>vérifient la dépose et son support</strong>. L’emplacement devient occupé dans la mémoire du cycle seulement après cette validation.',
  },
  {
    label: '05 · Recouvrement',
    text: 'Après dégagement J4 : poursuivre le retour et, si nécessaire, indexer en parallèle.',
    script: 'Si la présentation de la palette doit changer, le retour à vide est d’abord vérifié contre le volume balayé de la palette chargée. Pendant le mouvement, les articulations mesurées permettent de vérifier le <strong>dégagement de J4</strong>. Une fois ce dégagement acquis, le robot poursuit son retour pendant que l’indexeur présente la rangée suivante.',
  },
  {
    label: '06 · Synchroniser',
    text: 'Attendre les confirmations ; un défaut ou un délai dépassé bloque la progression.',
    script: 'Avant d’autoriser le carton suivant, nous attendons la <strong>fin du retour et la confirmation de la présentation</strong> de la palette. Les mesures doivent être récentes, l’axe stabilisé et la scène MoveIt cohérente. Sans confirmation, le programme attend. Un défaut ou un délai dépassé bloque la progression.',
  },
  {
    label: 'Boucler & tracer',
    text: 'La palette actualisée prépare la décision suivante ; les phases sont tracées sur ROS 2.',
    script: 'Nous revenons au choix du carton suivant avec la mémoire de palette mise à jour. Le cycle se répète jusqu’aux <strong>douze déposes validées</strong>. L’enregistrement des phases ROS&nbsp;2 permet de retracer les actions et les attentes. Voyons maintenant comment les points de passage deviennent une trajectoire vérifiée.',
  },
]

/** Fixed coordinates keep topology and port connections invariant during narration. */
export function mountOrchestrationFlow(stage: HTMLElement) {
  const narration = stage.querySelector<HTMLElement>('[data-orch-narration]')
  if (narration) narration.innerHTML = flowCues.map((cue, index) => `<p data-orch-script="${index}" aria-hidden="true">${cue.script}</p>`).join('')
  const holder = stage.querySelector<HTMLElement>('[data-orch-graph]')!
  holder.innerHTML = `<svg class="orch-flow-svg" viewBox="0 0 1600 590" role="group" aria-labelledby="of-title of-desc">
    <title id="of-title">Flux du cycle multicartons et recouvrement robot–indexeur</title>
    <desc id="of-desc">Choisir la destination, confirmer la prise, transférer et valider la dépose. Après dégagement mesuré de J4, le retour robot peut se poursuivre pendant l’indexation, si la présentation change. Les deux branches se rejoignent avant d’autoriser le carton suivant. Sans confirmation, attendre ; en cas de défaut, bloquer la progression.</desc>
    <defs>
      <marker id="of-arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#739095" stroke-width="1.6"/></marker>
      <marker id="of-arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#f13c30" stroke-width="1.8"/></marker>
    </defs>
    <g class="of-region" data-of-cues="5 6"><rect x="598" y="258" width="625" height="309" rx="14"/><text x="916" y="241" text-anchor="middle">RECOUVREMENT · SI LA PRÉSENTATION CHANGE</text></g>
    <g class="of-entry" data-of-cues="1"><text x="100" y="32">ENTRÉE · pose du carton admise</text></g>
    ${edges.map(edgeMarkup).join('')}
    <g class="of-fork" data-of-cues="5"><path d="M1169 330 V498"/><text x="1187" y="397">ET</text></g>
    <g class="of-fork" data-of-cues="6"><path d="M627 330 V498"/><text x="606" y="397" text-anchor="end">ET</text></g>
    ${nodes.map(nodeMarkup).join('')}
    <g class="of-memory" data-of-cues="4 7"><text x="1424" y="263">Mémoire actualisée</text><text x="1424" y="284">emplacement occupé</text></g>
    <g class="of-loop-label" data-of-cues="7" data-orch-goto="7" tabindex="0" role="button" aria-label="Éclairer la boucle vers le carton suivant"><text x="29" y="285" transform="rotate(-90 29 285)" text-anchor="middle">CARTON SUIVANT</text><text x="130" y="500">Jusqu’aux 12 déposes validées</text></g>
    <g class="of-wait" data-of-cues="6"><text x="130" y="533">Sans confirmation : attente</text><text x="130" y="554">Défaut ou délai dépassé : progression bloquée</text></g>
  </svg>`
  let animation: gsap.core.Timeline | undefined
  const finish = () => {
    animation?.kill()
    stage.querySelectorAll<SVGElement>('.of-edge-lit').forEach(path => { path.style.removeProperty('stroke-dashoffset'); path.style.removeProperty('stroke-dasharray') })
  }
  const update = (view: HTMLElement, cue: number, noMotion: boolean) => {
    view.dataset.orchestrationCue = String(cue)
    view.dataset.orchestrationStatic = String(noMotion)
    view.querySelectorAll<HTMLElement>('[data-orch-script]').forEach(script => {
      const current = Number(script.dataset.orchScript) === cue
      script.classList.toggle('is-current', current)
      script.setAttribute('aria-hidden', String(!current))
    })
    view.querySelectorAll<SVGElement>('[data-of-cues]').forEach(el => {
      const active = el.dataset.ofCues?.split(' ').includes(String(cue)) ?? false
      el.classList.toggle('is-current', active)
      if (el.hasAttribute('data-orch-goto')) {
        if (active) el.setAttribute('aria-current', 'step')
        else el.removeAttribute('aria-current')
      }
    })
    if (cue === 7) view.querySelectorAll('.of-node[data-of-node="authorize"], .of-node[data-of-node="destination"]').forEach(node => node.classList.add('is-current'))
    const caption = view.querySelector<HTMLElement>('[data-orch-caption]')
    const label = view.querySelector<HTMLElement>('[data-orch-label]')
    const position = view.querySelector<HTMLElement>('[data-orch-position]')
    if (caption) caption.textContent = flowCues[cue].text
    if (label) label.textContent = flowCues[cue].label
    if (position) position.textContent = `${String(cue + 1).padStart(2, '0')} / 08`
    const prev = view.querySelector<HTMLButtonElement>('[data-orch-prev]')
    const next = view.querySelector<HTMLButtonElement>('[data-orch-next]')
    if (prev) prev.disabled = cue === 0
    if (next) next.disabled = cue === flowCues.length - 1
  }
  const play = () => {
    finish()
    animation = gsap.timeline()
    stage.querySelectorAll<SVGElement>('.of-edge.is-current').forEach(edge => {
      const path = edge.querySelector('.of-edge-lit')
      if (path) animation!.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .48, ease: 'power1.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, Number(edge.dataset.ofOrder) * .17)
    })
  }
  return { update, play, finish, dispose: finish }
}
