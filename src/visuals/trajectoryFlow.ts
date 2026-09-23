import { gsap } from 'gsap'
import { trajectoryPlatesMarkup, updateTrajectoryPlates, updateTrajectoryPose } from './trajectoryPlates'
import { trajectoryComments, updateTrajectoryCommentary } from './trajectoryCommentary'
import { math } from './runtimeMath'
import { runtimeMath } from '../content/runtimeMath'

const scriptMath = (key: 'tp_sample_time' | 'tp_sample_q' | 'tp_sample_qd' | 'tp_sample_qdd') => {
  const { viewBox, body, label } = runtimeMath[key]
  const [x,y,width,height] = viewBox
  return `<svg class="trajectory-script-math" viewBox="${x} ${y} ${width} ${height}" style="width:${width/1000}em;height:${height/1000}em;vertical-align:${-(y+height)/1000}em" role="img" aria-label="${label}">${body}</svg>`
}

export const trajectoryCues = [
  { label: 'Vue d’ensemble', text: 'Un même transfert pour comprendre le passage, sa temporisation et la vérification avant envoi.' },
  { label: '01 · Géométrie — la cible', text: 'L’IK relie la cible de la sortie J4 aux quatre angles, avec un outil horizontal et le lacet demandé.' },
  { label: '02 · Géométrie — le passage', text: 'A–B : élever. B–C : pivoter à hauteur. C–D : approcher. Les poses sont comparables avec une caméra fixe.' },
  { label: '03 · Composer la trajectoire', text: 'Les quintiques raccordent les configurations. Aux arrêts B et C de cet exemple, vitesse et accélération sont nulles.' },
  { label: '04 · Scène et consigne', text: 'La scène actualisée et la consigne horodatée fournissent les éléments du contrôle.' },
  { label: '05 · Valider et transmettre', text: 'Après validation des états échantillonnés, la consigne rejoint /execute_trajectory, puis JTC.' },
] as const

const node = (x: number, cues: string, goto: number, label: string, title: string, detail: string, software: string) => `
  <g class="tf-node" transform="translate(${x} 36)" data-tf-cues="${cues}" data-traj-goto="${goto}" tabindex="0" role="button" aria-label="${title} : éclairer cette étape">
    <rect class="tf-node-surface" width="450" height="128" rx="6"/>
    <path class="tf-node-accent" d="M20 0 H430"/>
    <text class="tf-eyebrow" x="24" y="29">${label}</text>
    <text class="tf-node-title" x="24" y="62">${title}</text>
    <text class="tf-body" x="24" y="89">${detail}</text>
    <text class="tf-code" x="24" y="112">${software}</text>
  </g>`
const edge = (id: string, d: string, cues: string, label = '', x = 0, y = 0) => `
  <g class="tf-edge" data-tf-edge="${id}" data-tf-cues="${cues}">
    <path class="tf-edge-base" d="${d}" marker-end="url(#tf-arrow-muted)"/>
    <path class="tf-edge-lit" d="${d}" pathLength="1" marker-end="url(#tf-arrow-red)"/>
    <path class="tf-edge-pulse" d="${d}" pathLength="1"/>
    ${label ? `<text class="tf-edge-label" x="${x}" y="${y}" text-anchor="middle">${label}</text>` : ''}
  </g>`

/** Native plots use the 256 recorded planned samples; emphasis never changes data. */
export function mountTrajectoryFlow(stage: HTMLElement) {
  stage.querySelector<HTMLElement>('[data-traj-narration]')!.innerHTML = `
    <p data-traj-script="default" aria-hidden="true"><strong>Constructeur Python</strong><br>MoveIt 2 · ROS 2</p>
    <p data-traj-script="example" aria-hidden="true">Prenons l’exemple du <strong>carton 9 de la séquence 4</strong>.</p>
    <p data-traj-script="target" aria-hidden="true">Après avoir choisi la cible de dépose, ici la position <strong>outer-left de la 3ᵉ couche</strong>, on extrait les coordonnées cartésiennes du centre prédéfini qui lui correspond.</p>
    <p data-traj-script="angles" aria-hidden="true">La cinématique inverse calcule les <strong>quatre angles <var>q</var><sub>1</sub>, <var>q</var><sub>2</sub>, <var>q</var><sub>3</sub>, <var>q</var><sub>4</sub></strong>.</p>
    <p data-traj-script="orientation" aria-hidden="true">En tenant compte de <strong>l’horizontalité de l’outil</strong> et de <strong>la conservation du lacet</strong>.</p>
    <p data-traj-script="route" aria-hidden="true">Les stations clés de notre trajectoire sont :</p>
    <p data-traj-script="scene" aria-hidden="true">Le contrôle <strong>/check_state_validity</strong>, exécuté par MoveIt, évalue les configurations fournies par la cinématique inverse dans une <strong>scène virtuelle</strong>.</p>
    <p data-traj-script="verdict" aria-hidden="true">Après échantillonnage, les points de la trajectoire passent le contrôle des <strong>collisions et des limites articulaires</strong>. Ici, les <strong>256 états sont valides</strong>.</p>
    <p data-traj-script="message" aria-hidden="true">Le message <strong>RobotTrajectory</strong> regroupe les positions, vitesses et accélérations articulaires, avec le temps prévu pour chaque point.</p>
    <p data-traj-script="transmission" aria-hidden="true">L’action <strong>/execute_trajectory</strong> transmet cette consigne au <strong>JTC</strong>. Le contrôleur assure ensuite son suivi dans la simulation.</p>
    <p data-traj-script="quintic" aria-hidden="true">L’orchestrateur reçoit les configurations articulaires de <strong>prise et de dépose</strong> pour produire une courbe quintique qui définit, à chaque instant ${scriptMath('tp_sample_time')}, la position ${scriptMath('tp_sample_q')}, la vitesse ${scriptMath('tp_sample_qd')} et l’accélération ${scriptMath('tp_sample_qdd')} correspondantes.</p>`
  const holder = stage.querySelector<HTMLElement>('[data-traj-graph]')!
  holder.innerHTML = `<svg class="trajectory-flow-svg" viewBox="0 0 1600 604" role="group" aria-labelledby="tf-title tf-desc">
    <title id="tf-title">Préparation d’une trajectoire du robot 2</title>
    <desc id="tf-desc">La cible est résolue par cinématique inverse, puis un corridor organise le passage. Des quintiques définissent la durée et les raccords sous contraintes de vitesse, accélération et jerk. Des vues successives du même transfert chargé montrent la cible, les poses A–B–C–D, les profils planifiés de J1 et les marges aux limites dynamiques. MoveIt valide 256 états échantillonnés dans la scène avant d’autoriser l’envoi au contrôleur. Ce contrôle discret ne prouve pas l’absence de collision entre les échantillons.</desc>
    <defs>
      <marker id="tf-arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#8ba4b0" stroke-width="1.6"/></marker>
      <marker id="tf-arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#ff493d" stroke-width="1.8"/></marker>
    </defs>
    <text class="tf-entry" x="24" y="17" data-tf-cues="1">ENTRÉE · cible de prise ou de dépose</text>
    ${edge('waypoints','M450 100 H575','3','points de passage',512.5,84)}
    ${edge('trajectory','M1025 100 H1150','4')}
    <g class="tf-edge" data-tf-cues="4">${math(1087.5,84,'command',18,'tf-edge-label',false,'middle')}</g>
    ${node(0,'1 2',1,'01 · GÉOMÉTRIE','Construire le passage','IK analytique + points de passage','analytic_ik.py · multi_carton_cycle.py')}
    ${node(575,'3',3,'02 · TEMPORISATION','Composer la trajectoire','Quintiques · raccords · limites dynamiques','multi_carton_core.py')}
    ${node(1150,'4 5',4,'03 · VALIDATION','Vérifier dans la scène','Charge attachée + cartons déjà placés','MoveIt 2 · /check_state_validity')}
    ${trajectoryPlatesMarkup()}
  </svg>`

  let animation: gsap.core.Timeline | undefined
  const finish = () => {
    animation?.kill()
    stage.querySelectorAll<SVGElement>('.tp-panel, .tp-surface, .tp-panel-content, .tp-comment').forEach(panel => {
      panel.style.removeProperty('transform'); panel.style.removeProperty('transform-origin'); panel.style.removeProperty('opacity')
      panel.removeAttribute('transform')
      gsap.set(panel, { clearProps: 'transform,transformOrigin,opacity' })
    })
    stage.querySelectorAll<SVGElement>('.tf-edge-lit').forEach(path => {
      path.style.removeProperty('stroke-dashoffset')
      path.style.removeProperty('stroke-dasharray')
    })
  }
  const update = (view: HTMLElement, cue: number, noMotion: boolean, step = 0, poseOverride?: number) => {
    view.dataset.trajectoryCue = String(cue)
    const script = cue === 0 ? 'example'
      : cue === 1 && step === 0 ? 'target'
      : cue === 1 && step === 1 ? 'angles'
      : cue === 1 && step === 2 ? 'orientation'
      : cue === 2 ? 'route'
      : cue === 4 ? step === 0 ? 'scene' : 'message'
      : cue === 5 ? step === 0 ? 'verdict' : 'transmission'
      : cue === 3 ? 'quintic' : 'default'
    view.querySelectorAll<HTMLElement>('[data-traj-script]').forEach(el => {
      const current = el.dataset.trajScript === script
      el.classList.toggle('is-current', current)
      el.setAttribute('aria-hidden', String(!current))
    })
    updateTrajectoryPlates(view, cue, step)
    updateTrajectoryPose(view, poseOverride ?? trajectoryComments[cue][step].pose ?? 1)
    updateTrajectoryCommentary(view, cue, step)
    view.dataset.trajectoryStatic = String(noMotion)
    view.querySelectorAll<SVGElement>('[data-tf-cues]').forEach(el => {
      const active = el.dataset.tfCues?.split(' ').includes(String(cue)) ?? false
      el.classList.toggle('is-current', active)
      if (el.hasAttribute('data-traj-goto')) {
        if (active) el.setAttribute('aria-current','step')
        else el.removeAttribute('aria-current')
      }
    })
    const caption = view.querySelector<HTMLElement>('[data-traj-caption]')
    const label = view.querySelector<HTMLElement>('[data-traj-label]')
    const position = view.querySelector<HTMLElement>('[data-traj-position]')
    if (caption) caption.textContent = ''
    if (label) label.textContent = `${trajectoryCues[cue].label} · ${trajectoryComments[cue][step].topic}`
    if (position) position.textContent = `${String(cue+1).padStart(2,'0')} / ${String(trajectoryCues.length).padStart(2,'0')}`
    const prev = view.querySelector<HTMLButtonElement>('[data-traj-prev]')
    const next = view.querySelector<HTMLButtonElement>('[data-traj-next]')
    if (prev) prev.disabled = cue === 0
    if (next) next.disabled = cue === trajectoryCues.length - 1 && step === trajectoryComments[cue].length - 1
  }
  const play = (newCard = true) => {
    finish()
    animation = gsap.timeline()
    const cue = Number(stage.dataset.trajectoryCue)
    const panel = stage.querySelector('.tp-panel.is-visible')
    if (panel && cue > 0 && newCard) {
      const origin = String(cue < 3 ? 225 : cue === 3 ? 800 : 1375) + ' 190'
      const surface = panel.querySelector('.tp-surface')
      const content = panel.querySelector('.tp-panel-content')
      if (surface) animation.fromTo(surface,
        { opacity: 0, scaleX: .46, scaleY: .08, svgOrigin: origin },
        { opacity: 1, scaleX: 1, scaleY: 1, duration: .46, ease: 'power2.out', clearProps: 'transform,transformOrigin,opacity' }, 0)
      // Keep raster evidence at its native display scale. Scaling the complete SVG
      // panel makes Chromium cache the scene as a low-resolution texture.
      if (content) animation.fromTo(content,
        { opacity: 0 },
        { opacity: 1, duration: .3, ease: 'power1.out', clearProps: 'opacity' }, .14)
    }

    const comment = stage.querySelector('.tp-comment.is-visible')
    if (comment) animation.fromTo(comment,{opacity:0,y:7},{opacity:1,y:0,duration:.32,ease:'power2.out',clearProps:'transform,opacity'},newCard ? .24 : 0)

    if(newCard)stage.querySelectorAll('.tf-edge.is-current .tf-edge-lit').forEach(path => {
      animation!.fromTo(path,{ strokeDasharray:1, strokeDashoffset:1 },{ strokeDashoffset:0, duration:.65, ease:'power1.inOut', clearProps:'strokeDasharray,strokeDashoffset' },0)
    })
  }
  return { update, play, finish, dispose: finish }
}
