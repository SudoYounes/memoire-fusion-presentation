import { gsap } from 'gsap'
import { runtimeEvidence as evidence } from '../content/runtimeEvidence'
import { math, mathWidth, type RuntimeMathKey } from './runtimeMath'

export const runtimeCues = [
  { label: 'Vue d’ensemble', text: 'Une référence de mouvement, des efforts appliqués et des états simulés qui ferment la boucle.' },
  { label: '01 · Corriger le suivi', text: 'JTC compare sa référence aux états simulés. Le PID corrige les écarts de position et de vitesse.' },
  { label: '02 · Construire l’effort', text: 'Correction, gravité et anticipation inertielle contribuent à une même demande, avec leurs signes.' },
  { label: '03a · Appliquer les limites', text: 'Les limites motrices portent sur les coordonnées d’actionneur. La réaction des transmissions reste distincte.' },
  { label: '03b · Faire évoluer la physique', text: 'Gazebo / DART calcule le mouvement sous les efforts, la gravité et les contacts du modèle simulé.' },
] as const

const text = (x: number, y: number, lines: string[], cls = 'rf-body', step = 27) => `<text class="${cls}" x="${x}" y="${y}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? step : 0}">${line}</tspan>`).join('')}</text>`
const panel = (cue: number, heading: string, scope: string, contents: string) => `<g class="rf-panel" data-runtime-panel="${cue}" aria-hidden="true"><rect class="rf-panel-surface" x="0" y="270" width="1600" height="330" rx="7"/><text class="rf-panel-title" x="30" y="305">${heading}</text><text class="rf-note" x="1570" y="304" text-anchor="end">${scope}</text>${contents}</g>`
const divider = '<path class="rf-rule" d="M1004 335 V575"/>'
// One editorial hierarchy per view; no extra reading steps or hidden commentary.
const goldText = (y: number, lines: string[], cls: 'title' | 'key', step = 29) =>
  text(1040,y,lines,`rf-comment-${cls}`,step).replace('<text ',`<text fill="url(#rf-gold-${cls})" `)
const commentary = (title: string[], body: string[], takeaway: string[], note: string, typeset: {body?:string; takeaway?:string} = {}) =>
  `<g class="rf-commentary">${goldText(355,title,'title',32)}${typeset.body ?? text(1040,429,body,'rf-comment-body',27)}
    <path class="rf-comment-rule" d="M1040 491 H1560"/>
    ${typeset.takeaway ?? goldText(525,takeaway,'key',27)}${text(1040,580,[note],'rf-note')}</g>`
const timeX = (t: number) => 150 + t / 5.4 * 800
const timeAxis = (y = 577) => [0, 1, 2, 3, 4, 5].map(t => `<text class="rf-tick" x="${timeX(t)}" y="${y}" text-anchor="middle">${t}</text>`).join('') + `<text class="rf-tick" x="950" y="${y}" text-anchor="end">s</text>`
const path = (rows: readonly (readonly number[])[], column: number, y: (value: number) => number) => rows.map((row, i) => `${i ? 'L' : 'M'}${timeX(row[0]).toFixed(2)} ${y(row[column]).toFixed(2)}`).join(' ')
const line = (d: string, cls: string) => `<path class="rf-curve ${cls}" d="${d}"/>`
const legend = (x: number, y: number, label: string, cls: string) => `<path class="rf-curve ${cls}" d="M${x} ${y-5} h30"/>${text(x+40,y,[label],'rf-legend')}`
const grid = (ticks: number[], y: (v: number) => number) => ticks.map(t => `<path class="rf-grid" d="M150 ${y(t)} H950"/><text class="rf-tick" x="133" y="${y(t)+4}" text-anchor="end">${t}</text>`).join('')

function tracking(detail: boolean) {
  const qY = (q: number) => (detail ? 438 : 544) - (q-10)/100*(detail ? 90 : 170)
  const errorY = (e: number) => 550 - (e+15)/20*64
  const peak = evidence.maxError
  const plot = legend(150,335,'Consigne J1','rf-curve--reference') + legend(360,335,'Réponse simulée','rf-curve--feedback') +
    text(30,386,['Position','J1 (°)'],'rf-chart-label',23) + grid([20,60,100],qY) +
    `<g${detail?'':' data-rf-highlight'}>${line(path(evidence.controller,1,qY),'rf-curve--reference')}${line(path(evidence.controller,2,qY),'rf-curve--feedback')}</g>`
  if (!detail) return panel(0,'Un transfert chargé pour lire la boucle','Carton 9 · séquence 4',plot+timeAxis()+divider+
    commentary(['Une référence préparée,','une réponse simulée'],
      ['JTC reçoit la trajectoire vérifiée','à l’étape précédente.'],
      ['Le retour des états permet de corriger','le suivi pendant le mouvement.'],
      'Même transfert que la slide 13 · temps simulé'))
  return panel(1,'Le suivi devient lisible en agrandissant l’erreur','J1 · référence et retour du même message',plot+
    text(30,507,['Erreur'],'rf-chart-label')+math(30,530,'errorUnit',17,'rf-chart-label')+grid([-10,0],errorY)+
    line(path(evidence.controller,3,errorY),'rf-curve--error')+
    `<g data-rf-highlight><path class="rf-guide" d="M${timeX(peak[0])} 347 V554"/><circle class="rf-point" cx="${timeX(peak[0])}" cy="${errorY(peak[3])}" r="4"/></g>`+timeAxis()+divider+
    `<g class="rf-commentary">${goldText(355,['Corriger l’écart','pendant le mouvement'],'title',32)}
    ${math(1040,425,'error',29)}
    ${math(1040,477,'peakError',46,'rf-comment-metric',true)}
    ${text(1325,453,['Pic absolu de J1','sur ce transfert'],'rf-note',21)}
    <path class="rf-comment-rule" d="M1040 491 H1560"/>
    ${goldText(525,['Le PID corrige à partir des écarts','de position et de vitesse.'],'key',27)}
    ${text(1040,580,['Pic transitoire ≠ erreur finale de dépose.'],'rf-note')}</g>`)
}

function effort() {
  const y = (n: number) => 542-(n+1000)/1400*163
  const rows = evidence.efforts.filter(row=>row[0]>=0)
  return panel(2,'Une demande de couple, plusieurs contributions','Sortie motrice J2 couplée',
    legend(150,337,'Gravité','rf-curve--gravity')+legend(400,337,'Anticipation inertielle','rf-curve--inertia')+
    legend(150,361,'Correction PID','rf-curve--correction')+legend(400,361,'Total demandé','rf-curve--total')+
    text(30,420,['Couple'],'rf-chart-label')+math(30,443,'torqueUnit',17,'rf-chart-label')+grid([-900,-600,-300,0,300],y)+
    line(path(rows,1,y),'rf-curve--gravity')+line(path(rows,2,y),'rf-curve--inertia')+
    line(path(rows,3,y),'rf-curve--correction')+`<g data-rf-highlight>${line(path(rows,4,y),'rf-curve--total')}</g>`+timeAxis()+divider+
    `<g class="rf-commentary">
      ${goldText(380,['Relation générale de commande'],'title')}
      ${math(1040,445,'effortCommand',Math.min(30,520/mathWidth('effortCommand',1)),'rf-comment-key',true)}
      ${text(1040,523,['Traces ci-contre : sans contribution','explicite de Coriolis.'],'rf-note',23)}
    </g>`)
}

function limitations() {
  const box = (x: number, heading: string, key: RuntimeMathKey, caption: string) => `<g><rect class="rf-detail-box" x="${x}" y="376" width="264" height="128" rx="5"/>${text(x+20,405,[heading],'rf-heading')}${math(x+20,452,key,35,'rf-snapshot-value')}${text(x+20,482,[caption],'rf-note')}</g>`
  return panel(3,'De la demande motrice à l’effort appliqué','',
    text(1270,304,['J2 couplé · instant'],'rf-note')+math(1420,304,'instant',16,'rf-note')+
    text(32,345,['Instant de demande maximale en valeur absolue sur cet extrait'],'rf-note')+
    box(32,'Demande','demand','Somme des contributions')+`<g data-rf-highlight>${box(368,'Commande limitée','limited','Après limites motrices')}</g>`+box(704,'Équivalent appliqué','applied','Après réaction d’inertie')+
    `<path class="rf-detail-arrow" d="M296 440 H368" marker-end="url(#rf-red)"/><path class="rf-detail-arrow" d="M632 440 H704" marker-end="url(#rf-red)"/>`+
    text(32,549,['Aucun écrêtage moteur sur ce transfert.'],'rf-emphasis')+
    text(32,580,['À cet instant : réaction d’inertie ='],'rf-note')+math(257,580,'reaction',16,'rf-note')+text(350,580,['; frein passif = 0.'],'rf-note')+divider+
    commentary(['Limiter la demande','dans le repère moteur'],
      [],
      ['La réaction d’inertie de la transmission','reste distincte de la commande limitée.'],
      'Puis reconversion des efforts vers les articulations',
      {body:text(1040,429,['J2 couplé :'],'rf-comment-body')+math(1160,429,'coupling',28)+text(1040,459,['Les plafonds portent sur cette sortie motrice.'],'rf-comment-body')}))
}

function physics() {
  // Documentary Gazebo capture, displayed through an SVG viewport only.
  // The source bitmap is unchanged; this is not a timed frame from the trace above.
  const crop = {x:770,y:1010,w:970,h:379}, image = {x:32,y:331,w:620,h:242}
  // Match the crop and image aspect ratio without stretching the source.
  const height = image.w/crop.w*crop.h
  const point = (x:number,y:number) => [image.x+(x-crop.x)*image.w/crop.w,image.y+(y-crop.y)*image.w/crop.w]
  const [jx,jy] = point(1310,1140), [cx,cy] = point(1080,1195)
  return panel(4,'La scène évolue sous les efforts et les contacts','Gazebo / DART',
    `<svg class="rf-scene" x="${image.x}" y="${image.y}" width="${image.w}" height="242" viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" preserveAspectRatio="xMidYMid slice"><image href="./media/multilayer-03.png" width="2880" height="1800"/></svg>`+
    // Labels sit outside the crop. Vertical positions are adjusted for the crop's slice offset.
    `<g class="rf-scene-callout" data-rf-highlight><path d="M${jx} ${jy-(height-242)/2} H670 V361"/><circle cx="${jx}" cy="${jy-(height-242)/2}" r="4"/>${text(686,357,['Corps articulés'],'rf-scene-label')}</g>`+
    `<g class="rf-scene-callout" data-rf-highlight><path d="M${cx} ${cy-(height-242)/2} H670 V487"/><circle cx="${cx}" cy="${cy-(height-242)/2}" r="4"/>${text(686,500,['Charge et appuis'],'rf-scene-label')}</g>`+
    text(32,589,['Capture documentaire de la cellule · non synchronisée avec les courbes'],'rf-note')+divider+
    commentary(['DART calcule','la réponse des corps'],
      ['Masses, inerties, gravité et contacts','déterminent l’évolution du modèle.'],
      [], 'Substitut série à 4 axes · modèle de simulation',
      {takeaway:goldText(525,['JointForceCmd transmet les efforts.'],'key')+goldText(555,['Nouveaux états :'],'key')+math(1220,555,'states',27,'rf-comment-key',true)}))
}

const edge = (d: string, cues: string, label = '', x = 0, y = 0, labelMarkup='') => `<g class="rf-edge" data-rf-cues="${cues}"><path class="rf-edge-base" d="${d}" marker-end="url(#rf-muted)"/><path class="rf-edge-lit" d="${d}" pathLength="1" marker-end="url(#rf-red)"/><path class="rf-edge-pulse" d="${d}" pathLength="1"/>${labelMarkup || (label ? `<text class="rf-edge-label" x="${x}" y="${y}" text-anchor="middle">${label}</text>` : '')}</g>`
const node = (x:number,w:number,goto:number,cues:string,eyebrow:string,title:string,detail:string,code:string,typeset:{detail?:string;code?:string}={}) => `<g class="rf-node" transform="translate(${x} 102)" data-runtime-goto="${goto}" data-rf-cues="${cues}" tabindex="0" role="button" aria-label="${title} : ouvrir l’explication"><rect class="rf-node-surface" width="${w}" height="110" rx="5"/><path class="rf-node-accent" d="M18 0 H${w-18}"/>${text(20,25,[eyebrow],'rf-eyebrow')}${text(20,54,[title],'rf-node-title')}${typeset.detail??text(20,79,[detail],'rf-node-detail')}${typeset.code??text(20,99,[code],'rf-code')}</g>`

export function mountRuntimeFlow(stage: HTMLElement) {
  const holder = stage.querySelector<HTMLElement>('[data-runtime-graph]')!
  holder.innerHTML = `<svg class="runtime-flow-svg" viewBox="0 0 1600 604" role="group" aria-labelledby="rf-title rf-desc">
    <title id="rf-title">Commande en effort et réponse simulée du robot 2</title>
    <desc id="rf-desc">La trajectoire alimente JTC. Sa correction rejoint l’anticipation inertielle et la gravité dans le module d’effort. Ce module applique les limites motrices et les contributions de transmission avant Gazebo et DART. Les états simulés reviennent au contrôle. Cinq vues expliquent cette boucle avec des traces du transfert chargé du carton 9, et une capture documentaire non synchronisée.</desc>
    <defs><marker id="rf-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#8ba4b0" stroke-width="1.6"/></marker><marker id="rf-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#ff493d" stroke-width="1.8"/></marker>
      ${(['title','key'] as const).map(kind=>`<linearGradient id="rf-gold-${kind}" class="rf-gold-gradient" gradientUnits="userSpaceOnUse" x1="730" y1="0" x2="1030" y2="0">
        <stop offset="0" stop-color="${kind==='title'?'#e5eeee':'#efd4a6'}"/><stop offset=".24" stop-color="#e7b85d"/><stop offset=".5" stop-color="#fff6d5"/><stop offset=".76" stop-color="#efc46b"/><stop offset="1" stop-color="${kind==='title'?'#e5eeee':'#efd4a6'}"/>
      </linearGradient>`).join('')}
    </defs>
    ${edge('M250 157 H350','1','consigne',300,142)}
    ${edge('M690 157 H850','1 2','correction',770,142)}
    ${edge('M1190 157 H1280','3 4','efforts',1235,142)}
    ${edge('M520 102 V44 H730','2','',0,0,math(568,29,'reference',18,'rf-edge-label'))}
    ${edge('M1020 44 H1080 V102','2')}
    ${edge('M1440 212 V242 H520 V212','1 4')}
    ${edge('M1020 242 V212','2 3 4')}
    ${node(0,250,0,'0','ENTRÉE','Trajectoire validée','','FollowJointTrajectory',{detail:math(20,79,'command',20,'rf-node-detail')})}
    ${node(350,340,1,'1','01 · CORRIGER','JointTrajectoryController','Référence interpolée + PID','ros2_control · controllers.yaml')}
    ${node(850,340,2,'2 3','02 · PRODUIRE L’EFFORT','Module d’effort','Somme · limites · transmissions','effort_plant_system.cpp')}
    ${node(1280,320,4,'4','03 · FAIRE ÉVOLUER','Gazebo / DART','Corps, charge et contacts','',{code:text(20,99,['JointForceCmd'],'rf-code')+math(128,99,'appliedStates',17,'rf-code')})}
    <g class="rf-branch" data-rf-cues="2" data-runtime-goto="2" tabindex="0" role="button" aria-label="Anticipation inertielle : ouvrir l’explication"><rect class="rf-node-surface" x="730" y="12" width="290" height="64" rx="5"/>${text(750,38,['Anticipation inertielle'],'rf-branch-title')}${text(750,61,['modèle fermé · NumPy'],'rf-code')}</g>
    <g class="rf-return-label" data-rf-cues="1 4" data-runtime-goto="1" tabindex="0" role="button" aria-label="États simulés : ouvrir le suivi"><rect x="692" y="229" width="302" height="25" rx="3"/>${text(710,247,['ÉTATS SIMULÉS ·'],'rf-return-text')}${math(850,247,'states',18,'rf-return-text')}</g>
    ${tracking(false)}${tracking(true)}${effort()}${limitations()}${physics()}
  </svg>`
  let animation: gsap.core.Timeline | undefined
  const finish = () => {
    animation?.kill()
    gsap.set(stage.querySelectorAll('.rf-panel'), { clearProps: 'transform,opacity' })
    stage.querySelectorAll('.rf-panel').forEach(panel => panel.removeAttribute('transform'))
    gsap.set(stage.querySelectorAll('.rf-edge-lit'), { clearProps: 'strokeDasharray,strokeDashoffset' })
    gsap.set(stage.querySelectorAll('.rf-gold-gradient'), { attr: { x1:730, x2:1030 } })
    gsap.set(stage.querySelectorAll('[data-rf-highlight], .rf-comment-title, .rf-comment-key, .rf-comment-metric'), { clearProps:'filter' })
  }
  const update = (view: HTMLElement, cue: number, noMotion: boolean) => {
    view.dataset.runtimeCue = String(cue)
    view.dataset.runtimeStatic = String(noMotion)
    view.querySelectorAll<SVGElement>('[data-rf-cues]').forEach(el => {
      const active = el.dataset.rfCues?.split(' ').includes(String(cue)) ?? false
      el.classList.toggle('is-current', active)
      if (el.hasAttribute('data-runtime-goto')) {
        if (active) el.setAttribute('aria-current','step')
        else el.removeAttribute('aria-current')
      }
    })
    view.querySelectorAll<SVGElement>('[data-runtime-panel]').forEach(el => {
      const active = Number(el.dataset.runtimePanel) === cue
      el.classList.toggle('is-visible',active)
      el.setAttribute('aria-hidden',String(!active))
    })
    const label = view.querySelector('[data-runtime-label]'), caption = view.querySelector('[data-runtime-caption]'), position = view.querySelector('[data-runtime-position]')
    if (label) label.textContent = runtimeCues[cue].label
    // The plate carries the explanation; avoid a second paragraph competing below it.
    if (caption) caption.textContent = ''
    const source = view.querySelector('[data-runtime-source]')
    if (source) source.textContent = cue === 4
      ? 'Capture documentaire Gazebo · contexte physique · image non synchronisée avec l’extrait v6'
      : 'Traces de simulation · campagne v6 · séquence 4 · carton 9 · transfert chargé'
    if (position) position.textContent = `${String(cue+1).padStart(2,'0')} / ${String(runtimeCues.length).padStart(2,'0')}`
    const prev = view.querySelector<HTMLButtonElement>('[data-runtime-prev]'), next = view.querySelector<HTMLButtonElement>('[data-runtime-next]')
    if (prev) prev.disabled = cue === 0
    if (next) next.disabled = cue === runtimeCues.length-1
  }
  const play = () => {
    finish()
    animation = gsap.timeline()
    animation.fromTo(stage.querySelector('.rf-panel.is-visible'), { opacity:0, y:10 }, { opacity:1, y:0, duration:.38, ease:'power2.out', clearProps:'transform,opacity' },0)
    stage.querySelectorAll('.rf-edge.is-current .rf-edge-lit').forEach(el => {
      animation!.fromTo(el,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.65,ease:'power1.inOut',clearProps:'strokeDasharray,strokeDashoffset'},0)
    })
    // A single sweep on appearance, never a loop or a timed advance of the content.
    animation.to(stage.querySelectorAll('.rf-gold-gradient'), {attr:{x1:1590,x2:1890},duration:1.45,ease:'none'},.38)
    const focus = stage.querySelectorAll('.rf-panel.is-visible :is([data-rf-highlight], .rf-comment-title, .rf-comment-key, .rf-comment-metric)')
    animation.fromTo(focus,{filter:'drop-shadow(0px 0px 0px rgba(250, 204, 112, 0))'},
      {filter:'drop-shadow(0px 0px 4px rgba(250, 204, 112, 0.48))',duration:.45,ease:'power1.out'},.38)
    animation.to(focus,{filter:'drop-shadow(0px 0px 0px rgba(250, 204, 112, 0))',duration:.65,ease:'power1.in',clearProps:'filter'},1.18)
  }
  return { update, finish, play, dispose:finish }
}
