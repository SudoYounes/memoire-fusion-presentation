import { trajectoryPlateData as data } from '../content/trajectoryPlateData'
import { math, type RuntimeMathKey } from './runtimeMath'

type Comment = {
  topic: string
  title: string[]
  body: string[]
  consequence: string[]
  focus: string[]
  values?: string[][]
  pose?: number
}
const q=Object.values(data.ik.joint_target_rad).map(n=>(n*180/Math.PI).toFixed(2).replace('.',','))

/** A card stays in place while its comments advance under presenter control. */
export const trajectoryComments: readonly (readonly Comment[])[] = [
  [{topic:'Le transfert étudié',title:['Un exemple commun','à toute la préparation'],body:['Carton 9 de la séquence 4.','Le robot quitte le convoyeur pour rejoindre','la troisième couche de la palette.'],consequence:['Les repères A–B–C–D relient le passage','aux courbes de la commande.'],focus:['route-ab','route-bc','route-cd']}],
  [
    {topic:'Cible',title:['Une pose d’arrivée','pour la sortie J4'],body:['Coordonnées dans le repère monde.','Le lacet demandé vaut ici 0°.'],values:[['x = −0,315 m','y = 1,534 m'],['z = 1,451 m','lacet = 0°']],consequence:['L’IK reçoit cette pose pour calculer','la configuration articulaire d’arrivée.'],focus:['target']},
    {topic:'Angles',title:['L’IK calcule','les quatre angles'],body:['Solveur analytique : analytic_ik.py'],values:[[`q₁ = ${q[0]}°`,`q₂ = ${q[1]}°`],[`q₃ = ${q[2]}°`,`q₄ = ${q[3]}°`]],consequence:['Chaque angle correspond à une articulation','repérée sur le modèle à gauche.'],focus:['joint1','joint2','joint3','joint4']},
    {topic:'Orientation',title:['L’outil conserve','son orientation'],body:['q₂ + q₃ = 90° : outil horizontal.','q₁ + q₄ = 0° : lacet conservé ici.'],consequence:['La configuration d’arrivée est définie.','Il reste à construire le passage.'],focus:['joint2','joint3','joint4','target']},
  ],
  [
    {topic:'A–B · Élévation',title:['Dégager la charge','côté prise'],body:['Le robot rejoint une posture de dégagement','avant sa rotation principale.'],consequence:['Le repère B fixe la fin','de cette première élévation.'],focus:['route-ab'],pose:1},
    {topic:'B–C · Rotation',title:['Pivoter à hauteur'],body:['J1 change l’azimut du robot.','La sortie J4 reste proche de 1,491 m','pendant cette portion du passage.'],consequence:['Le robot rejoint le côté palette','avant l’approche finale.'],focus:['route-bc'],pose:2},
    {topic:'C–D · Approche',title:['Rejoindre la destination'],body:['La dernière portion descend d’environ','40 mm jusqu’à la pose d’arrivée.'],consequence:['Le passage est construit. MoveIt devra','encore vérifier ses états dans la scène.'],focus:['route-cd'],pose:3},
  ],
  [
    {topic:'Position',title:['J1 pivote surtout','entre B et C'],body:['La courbe décrit l’azimut commandé.','Les quintiques relient les configurations','avec un calendrier commun aux axes.'],consequence:['Une position J1 constante ne signifie pas','que les autres axes sont immobiles.'],focus:['profile-q','time-bc']},
    {topic:'Vitesse',title:['Accélérer, puis ralentir','la rotation'],body:['La vitesse de J1 augmente pendant','le transfert, puis revient à zéro','à l’arrivée en C.'],consequence:['Cette loi fixe le rythme du mouvement','entre les configurations.'],focus:['profile-qd','time-bc']},
    {topic:'Raccords',title:['B et C imposent','des arrêts dans cet exemple'],body:['Vitesse = 0 et accélération = 0','aux deux jonctions.','Position, vitesse et accélération sont continues.'],consequence:['La commande présentée utilise','des raccords avec arrêts imposés.'],focus:['profile-qd','profile-qdd','time-bc','stops']},
  ],
  [
    {topic:'Vitesse',title:['La vitesse conserve','de la marge'],body:['Le maximum atteint environ 73,5 %','de la limite déclarée.','J1 et J4 sont les axes dimensionnants.'],consequence:['Le rythme ne dépend donc pas','de la seule limite de vitesse.'],focus:['limit-velocity']},
    {topic:'Accélération et jerk',title:['Deux limites','plus contraignantes ici'],body:['L’accélération atteint environ 99,1 %.','Le jerk atteint lui aussi environ 99,1 %.','Le jerk mesure la variation de l’accélération.'],consequence:['Ces deux grandeurs contraignent','davantage la durée de ce transfert.'],focus:['limit-acceleration','limit-jerk']},
    {topic:'Ajustement',title:['Allonger la durée','si une limite est dépassée'],body:['Le constructeur étire le calendrier,','puis contrôle de nouveau les limites.','Le passage géométrique reste inchangé.'],consequence:['Les barres montrent la commande finale,','sans comparaison avant et après étirement.'],focus:['limit-velocity','limit-acceleration','limit-jerk']},
  ],
  [
    {topic:'Scène',title:['Contrôler le passage','dans son environnement'],body:['MoveIt tient compte du carton attaché','au robot et des cartons déjà placés.','Service : /check_state_validity'],consequence:['Le contrôle évalue les configurations','dans la scène actualisée.'],focus:['validation-scene']},
    {topic:'Verdict',title:['256 états vérifiés','256 états valides'],body:['Les états échantillonnés passent le contrôle.','Un refus bloque l’envoi de la trajectoire.'],consequence:['Ce contrôle discret ne prouve pas l’absence','de collision entre deux échantillons.'],focus:['validation-samples']},
  ],
  [
    {topic:'Message',title:['Une consigne articulée','et horodatée'],body:['RobotTrajectory contient les positions,','les vitesses et les accélérations','avec leurs instants d’application.'],consequence:['Le message comprend aussi les points','intermédiaires entre A, B, C et D.'],focus:['output-message']},
    {topic:'Transmission',title:['La référence rejoint','le contrôleur JTC'],body:['L’action /execute_trajectory transmet','la consigne au JointTrajectoryController.'],consequence:['L’étape suivante étudie le suivi','de cette consigne dans la physique.'],focus:['output-message']},
  ],
]

const lines=(x:number,y:number,content:readonly string[],cls:string,lineHeight=29)=>`<text class="${cls}" x="${x}" y="${y}">${content.map((s,i)=>`<tspan x="${x}" dy="${i?lineHeight:0}">${s}</tspan>`).join('')}</text>`
function commentBody(c:Comment,cue:number,step:number) {
  if(c.values) {
    const keys:RuntimeMathKey[][]=step===0?[['tp_x','tp_y'],['tp_z','tp_lacet']]:[['tp_joint1','tp_joint2'],['tp_joint3','tp_joint4']]
    return lines(1040,382,[c.body[0]],'tp-comment-body')+keys.map((row,r)=>row.map((key,col)=>math(1040+col*270,418+r*32,key,27,'tp-numeric')).join('')).join('')
  }
  if(cue===1&&step===2)return math(1040,392,'tp_level',27,'tp-comment-body')+lines(1230,392,[': outil horizontal.'],'tp-comment-body')+math(1040,430,'tp_yaw',27,'tp-comment-body')+lines(1230,430,[': lacet conservé ici.'],'tp-comment-body')
  if(cue===3&&step===2)return math(1040,392,'tp_stops',27,'tp-comment-body')+lines(1040,421,c.body.slice(1),'tp-comment-body')
  if(cue===2&&step===1)return lines(1040,392,[c.body[0]],'tp-comment-body')+lines(1040,421,['La sortie J4 reste proche de'],'tp-comment-body')+math(1355,421,'tp_height',25,'tp-comment-body')+lines(1040,450,[c.body[2]],'tp-comment-body')
  if(cue===2&&step===2)return lines(1040,392,[c.body[0]],'tp-comment-body')+math(1040,421,'tp_descent',25,'tp-comment-body')+lines(1125,421,['jusqu’à la pose d’arrivée.'],'tp-comment-body')
  return lines(1040,392,c.body,'tp-comment-body',29)
}
export function trajectoryCommentary(cue:number) {
  const comments=trajectoryComments[cue]
  return `<g class="tp-commentary">${comments.map((c,i)=>`<g class="tp-comment" data-traj-comment="${i}" aria-hidden="true">
    ${lines(1040,277,[`${String(i+1).padStart(2,'0')} / ${String(comments.length).padStart(2,'0')}   ${c.topic}`],'tp-comment-topic')}
    ${lines(1040,315,c.title,'tp-comment-title',33)}
    ${commentBody(c,cue,i)}
    <path class="tp-rule" d="M1040 482 H1560"/>
    ${lines(1040,514,c.consequence,'tp-comment-consequence',27)}
  </g>`).join('')}
  ${comments.length>1?`<g class="tp-comment-nav" role="group" aria-label="Commentaires de cette carte">${comments.map((c,i)=>`<g class="tp-comment-step" data-traj-step="${i}" tabindex="-1" role="button" aria-label="Commentaire ${i+1} sur ${comments.length} : ${c.topic}" transform="translate(${1040+i*72} 558)"><rect width="58" height="33" rx="3"/><path d="M8 31 H50"/><text x="29" y="23" text-anchor="middle">${String(i+1).padStart(2,'0')}</text></g>`).join('')}<text class="tp-note" x="1560" y="581" text-anchor="end">${comments.length} temps de lecture</text></g>`:''}
  </g>`
}

export function updateTrajectoryCommentary(view:HTMLElement,cue:number,step:number) {
  const focus=trajectoryComments[cue][step].focus
  view.dataset.trajectoryStep=String(step)
  view.querySelectorAll<SVGGElement>('[data-traj-panel]').forEach(panel=>{
    const active=Number(panel.dataset.trajPanel)===cue
    panel.querySelectorAll<SVGGElement>('[data-traj-comment]').forEach(el=>{
      const visible=active&&Number(el.dataset.trajComment)===step
      el.classList.toggle('is-visible',visible)
      el.setAttribute('aria-hidden',String(!visible))
    })
    panel.querySelectorAll<SVGGElement>('[data-traj-step]').forEach(el=>{
      el.setAttribute('tabindex',active?'0':'-1')
      if(active&&Number(el.dataset.trajStep)===step)el.setAttribute('aria-current','step')
      else el.removeAttribute('aria-current')
    })
    panel.querySelectorAll<SVGElement>('[data-tp-focus]').forEach(el=>el.classList.toggle('is-focus',active&&focus.includes(el.dataset.tpFocus!)))
  })
}
