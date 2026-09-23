import { trajectoryPlateData as data } from '../content/trajectoryPlateData'
import { trajectoryProjection as projection } from '../content/trajectoryProjection'
import { trajectoryEvidence as evidence } from '../content/trajectoryEvidence'
import { trajectoryCommentary } from './trajectoryCommentary'
import { math, type RuntimeMathKey } from './runtimeMath'

const fixed = (n: number) => n.toFixed(2)
const deg = (n: number) => n * 180 / Math.PI
const text = (x: number, y: number, lines: string[], cls = 'tp-body', lineHeight = 29) => `<text class="${cls}" x="${x}" y="${y}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? lineHeight : 0}">${line}</tspan>`).join('')}</text>`
const title = (heading: string, scope: string) => `<text class="tp-title" x="32" y="227">${heading}</text><text class="tp-scope" x="1568" y="226" text-anchor="end">${scope}</text>`
const frame = (cue: number, content: string, step?: number) => `<g class="tp-panel" data-traj-panel="${cue}"${step===undefined?'':` data-traj-panel-step="${step}"`} aria-hidden="true"><rect class="tp-surface" x="0" y="190" width="1600" height="410" rx="8"/><g class="tp-panel-content">${content}</g></g>`
const image = (pose: string, extra = '') => `<image class="tp-scene-image" ${extra} href="./media/trajectory/pose-${pose}.png" x="0" y="225" width="1000" height="390" preserveAspectRatio="xMidYMid meet"/>`
const project = (p: readonly number[]) => [p[0] * .5, 225 + p[1] * .5]
const pxy = (p: readonly number[]) => { const [x,y] = project(p); return `${fixed(x)} ${fixed(y)}` }
const path = projection.points.map((p,i) => `${i ? 'L':'M'}${pxy(p)}`).join(' ')
const badge = (id: string, x: number, y: number) => `<circle class="tp-letter-disc" cx="${x}" cy="${y}" r="14"/><text class="tp-letter" x="${x}" y="${y+5}" text-anchor="middle">${id}</text>`
function route(focused=false) {
  const offsets = [[-55,15],[-58,-28],[30,-31],[68,23]]
  const segments=focused?['ab','bc','cd'].map((name,i)=>{
    const start=data.boundaries[i].t,end=data.boundaries[i+1].t
    const points=projection.points.filter((_,j)=>data.points[j].t>=start-1e-8&&data.points[j].t<=end+1e-8)
    const segment=points.map((p,j)=>`${j?'L':'M'}${pxy(p)}`).join(' ')
    return `<path class="tp-route-segment tp-figure-focus" data-tp-focus="route-${name}" d="${segment}"/>`
  }).join(''):''
  return `<g class="tp-route${focused?' tp-route--focused':''}"><path class="tp-route-halo" d="${path}"/><path class="tp-route-line" d="${path}"/>${segments}
    ${projection.boundaries.map((b,i)=>{const [x,y]=project(b.xy),[dx,dy]=offsets[i];return `<circle class="tp-route-point" cx="${x}" cy="${y}" r="4"/><path class="tp-leader" d="M${x} ${y} L${x+dx} ${y+dy}"/>${badge(b.id,x+dx,y+dy)}`}).join('')}</g>`
}
const divider = `<path class="tp-separator" d="M1000 256 V558"/>`

function overview() {
  return frame(0,title('Un transfert chargé, quatre repères','Carton 9 · séquence 4')+image('B')+route()+divider+trajectoryCommentary(0)+
    text(32,583,['Reconstruction du modèle de simulation · commande planifiée'],'tp-note'))
}

function geometryTarget() {
  const [tx,ty]=project(projection.target)
  const jointLabels=projection.poses[3].joints.map((p,i)=>{
    const [x,y]=project(p), left=i<3, lx=left?210:814, ly=[486,377,295,338][i]
    return `<g class="tp-figure-focus" data-tp-focus="joint${i+1}"><path class="tp-leader" d="M${x} ${y} H${left?lx+95:lx-16} V${ly-6}"/><circle class="tp-joint-dot" cx="${x}" cy="${y}" r="4"/><text class="tp-joint-label" x="${lx}" y="${ly}">J${i+1}</text></g>`
  }).join('')
  return frame(1,title('La cible devient une configuration articulaire','Géométrie · 1 / 2')+image('D')+jointLabels+
    `<g class="tp-figure-focus" data-tp-focus="target"><circle class="tp-target-ring" cx="${tx}" cy="${ty}" r="12"/><path class="tp-target-axis" d="M${tx-21} ${ty} H${tx+21} M${tx} ${ty-21} V${ty+21}"/></g>`+divider+trajectoryCommentary(1)+
    text(32,583,['Pose D de la commande · représentation URDF simplifiée'],'tp-note'))
}

function geometryRoute() {
  return frame(2,trajectoryCommentary(2)+`<text class="tp-scope" x="1568" y="226" text-anchor="end">Géométrie · 2 / 2</text>`+
    `<g class="tp-route-visual" transform="translate(300 0)">${image('B','data-traj-scene')}${route(true)}</g>`)
}

const profileEnd=1536
const timeX=(t:number)=>215+t/evidence.durationS*(profileEnd-215)
function profiles() {
  const rows=[{key:'q',title:'Position',unit:'°',min:10,max:110,y:278,color:'tp-curve--q'}, {key:'qd',title:'Vitesse',unit:'°/s',min:-5,max:75,y:371,color:'tp-curve--v'}, {key:'qdd',title:'Accélération',unit:'°/s²',min:-100,max:100,y:464,color:'tp-curve--a'}] as const
  const profiles=rows.map(row=>{
    const y=(v:number)=>row.y+60-(v-row.min)/(row.max-row.min)*60
    const d=data.points.map((p,i)=>`${i?'L':'M'}${fixed(timeX(p.t))} ${fixed(y(deg(p[row.key][0])))}`).join(' ')
    const ticks=row.key==='q'?[20,100]:row.key==='qd'?[0,60]:[-80,0,80]
    return `<g class="tp-figure-focus" data-tp-focus="profile-${row.key}"><text class="tp-chart-label" x="32" y="${row.y+23}">${row.title}</text>${math(32,row.y+47,({q:'tp_position',qd:'tp_velocity',qdd:'tp_acceleration'} as const)[row.key],19,'tp-note')}
      ${ticks.map(v=>`<path class="tp-grid" d="M215 ${y(v)} H${profileEnd}"/><text class="tp-tick" x="203" y="${y(v)+4}" text-anchor="end">${v}</text>`).join('')}
      <path class="tp-curve ${row.color}" d="${d}"/>
      ${data.boundaries.map(b=>`<circle class="tp-curve-point" cx="${timeX(b.t)}" cy="${y(deg(b[row.key][0]))}" r="3.5"/>`).join('')}</g>`
  }).join('')
  return frame(3,title('Les points de passage deviennent des lois de mouvement','Temporisation')+
    `${data.boundaries.map(b=>`<g ${b.id==='B'||b.id==='C'?'class="tp-figure-focus" data-tp-focus="time-bc"':''}><path class="tp-time-guide" d="M${timeX(b.t)} 271 V534"/>${badge(b.id,timeX(b.t),254)}</g>`).join('')}`+profiles+
    `<g class="tp-stop-rings tp-figure-focus" data-tp-focus="stops">${data.boundaries.slice(1,3).map(b=>`<circle cx="${timeX(b.t)}" cy="${371+60-5/80*60}" r="8"/><circle cx="${timeX(b.t)}" cy="494" r="8"/>`).join('')}</g>`+
    `${data.boundaries.map(b=>math(timeX(b.t),555,`tp_time${b.id}` as RuntimeMathKey,16,'tp-tick',false,'middle')).join('')}`+
    `<text class="tp-note" x="215" y="583">J1 · azimut du robot · mêmes repères A–B–C–D</text>`)
}

function validation(cue: number, step: number) {
  const dots=projection.points.filter((_,i)=>i%5===0).map(p=>{const [x,y]=project(p);return `<circle class="tp-check-dot" cx="${x}" cy="${y}" r="2.9"/>`}).join('')
  return frame(cue,title('Vérifier le passage dans la scène actualisée','MoveIt 2 · /check_state_validity')+`<g class="tp-figure-focus tp-scene-focus" data-tp-focus="validation-scene">${image('C')}</g>`+route()+`<g class="tp-figure-focus" data-tp-focus="validation-samples">${dots}</g>`+divider+trajectoryCommentary(cue)+
    text(32,583,['Points affichés espacés pour la lecture · le contrôle porte sur les 256 états'],'tp-note'),step)
}

function output(cue: number, step: number) {
  return frame(cue,title('Une consigne articulée et horodatée pour le contrôleur','Sortie · RobotTrajectory')+
    `<g class="tp-figure-focus" data-tp-focus="output-message">`+text(40,285,['Chaque point contient'],'tp-heading')+
    `<text class="tp-table-head" x="40" y="335">Temps</text><text class="tp-table-head" x="250" y="335">Positions</text>${math(351,335,'tp_q',23,'tp-table-head')}<text class="tp-table-head" x="485" y="335">Vitesses</text>${math(575,335,'tp_qd',23,'tp-table-head')}<text class="tp-table-head" x="708" y="335">Accélérations</text>${math(848,335,'tp_qdd',23,'tp-table-head')}<path class="tp-rule" d="M40 350 H947"/>`+
    data.boundaries.map((b,i)=>{const y=388+i*47;return `<text class="tp-table-body" x="40" y="${y}">${b.id} ·</text>${math(80,y,`tp_time${b.id}` as RuntimeMathKey,23,'tp-table-body')}${math(250,y,'tp_joints',25,'tp-table-body')}<text class="tp-table-body" x="485" y="${y}">0 aux arrêts</text><text class="tp-table-body" x="708" y="${y}">0 aux arrêts</text>`}).join('')+
    text(40,583,['Le message contient aussi tous les points intermédiaires, pas seulement A–B–C–D.'],'tp-note')+'</g>'+divider+
    trajectoryCommentary(cue),step)
}

export const trajectoryPlatesMarkup = () => `<defs><clipPath id="tp-area"><rect x="-8" y="176" width="1616" height="432"/></clipPath></defs>
  <g class="tp-origin" data-tp-origin="0"><path d="M225 164 V190"/><circle cx="225" cy="190" r="3"/></g>
  <g class="tp-origin" data-tp-origin="1"><path d="M800 164 V190"/><circle cx="800" cy="190" r="3"/></g>
  <g class="tp-origin" data-tp-origin="2"><path d="M1375 164 V190"/><circle cx="1375" cy="190" r="3"/></g>
  <g clip-path="url(#tp-area)" class="tp-panels">${overview()}${geometryTarget()}${geometryRoute()}${profiles()}${validation(4,0)}${output(4,1)}${validation(5,0)}${output(5,1)}</g>`

export function updateTrajectoryPlates(view: HTMLElement, cue: number, step: number) {
  view.querySelectorAll<SVGElement>('[data-traj-panel]').forEach(panel=>{
    const active=Number(panel.dataset.trajPanel)===cue && (panel.dataset.trajPanelStep===undefined || Number(panel.dataset.trajPanelStep)===step)
    panel.classList.toggle('is-visible',active)
    panel.setAttribute('aria-hidden',String(!active))
    panel.querySelectorAll('[tabindex]').forEach(el=>el.setAttribute('tabindex',active?'0':'-1'))
  })
  view.querySelectorAll<SVGElement>('[data-tp-origin]').forEach(el=>el.classList.toggle('is-current',cue>0&&Number(el.dataset.tpOrigin)===(cue<3?0:cue===3?1:2)))
}

export function updateTrajectoryPose(view: HTMLElement, pose: number) {
  view.dataset.trajectoryPose=String(pose)
  view.querySelectorAll<SVGImageElement>('[data-traj-scene]').forEach(el=>el.setAttribute('href',`./media/trajectory/pose-${'ABCD'[pose]}.png`))
  view.querySelectorAll<SVGElement>('[data-traj-pose]').forEach(el=>{
    const selected=Number(el.dataset.trajPose)===pose
    el.classList.toggle('is-selected',selected)
    el.setAttribute('aria-pressed',String(selected))
  })
}
