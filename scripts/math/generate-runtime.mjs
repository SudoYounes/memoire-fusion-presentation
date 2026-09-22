// Build-time only. The deck imports paths, never MathJax or remote fonts.
import { writeFile, readFile } from 'node:fs/promises'
import { mathjax } from '@mathjax/src/js/mathjax.js'
import { TeX } from '@mathjax/src/js/input/tex.js'
import { SVG } from '@mathjax/src/js/output/svg.js'
import { liteAdaptor } from '@mathjax/src/js/adaptors/liteAdaptor.js'
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js'
import { runtimeEvidence as evidence } from '../../src/content/runtimeEvidence.ts'
import { trajectoryPlateData as trajectory } from '../../src/content/trajectoryPlateData.ts'
import { trajectoryEvidence as planned } from '../../src/content/trajectoryEvidence.ts'
import { resultsEvidence as results } from '../../src/content/resultsEvidence.ts'

const number = (value, digits=2) => value.toFixed(digits).replace('.', '{,}')
const ref = String.raw`\mathrm{réf}`
const sources = {
  // J1 CAO window: user-supplied kinematic model. The first equality wraps
  // without changing its six-component torsor or the reference frame.
  j1_torsor: [String.raw`\begin{array}{@{}l@{}}\left\{\mathcal{V}_{\mathrm{colonne/embase}}\right\}_{O_1}\\[4pt]\quad=\left\{\begin{array}{c}\vec{\Omega}_{\mathrm{colonne/embase}}\\\vec{V}_{O_1,\mathrm{colonne/embase}}\end{array}\right\}=\left\{\begin{array}{c}0\\0\\\dot q_1\\0\\0\\0\end{array}\right\}_{(X,Y,Z)}\end{array}`, 'Torseur cinématique de la colonne par rapport à l’embase, au point O1 : vitesse angulaire zéro, zéro, q1 point, et vitesse en O1 nulle, dans le repère X, Y, Z'],
  j1_transport: [String.raw`\vec{V}_P=\vec{V}_{O_1}+\vec{\Omega}\times\overrightarrow{O_1P}`, 'Vitesse en P égale vitesse en O1 plus oméga vectoriel croisé avec le vecteur O1 P'],
  j1_pivot_velocity: [String.raw`\vec{V}_P=\dot q_1\,\vec{z}\times\overrightarrow{O_1P}`, 'Vitesse en P égale q1 point multiplié par z vectoriel croisé avec le vecteur O1 P'],
  j1_point: [String.raw`\overrightarrow{O_1P}=\left[\begin{array}{c}x_P\\y_P\\z_P\end{array}\right]`, 'Vecteur O1 P de composantes x P, y P et z P'],
  j1_velocity_components: [String.raw`\vec{V}_P=\left[\begin{array}{c}-\dot q_1 y_P\\\dot q_1 x_P\\0\end{array}\right]`, 'Vitesse en P de composantes moins q1 point fois y P, q1 point fois x P, et zéro'],
  j2_torsor: [String.raw`\left\{\mathcal{V}_{\mathrm{bras/colonne}}\right\}_{O_2}=\left\{\begin{array}{c}0\\\dot q_2\\0\\0\\0\\0\end{array}\right\}`, 'Torseur cinématique du bras par rapport à la colonne, au point O2 : vitesse angulaire zéro, q2 point, zéro, et vitesse en O2 nulle'],
  j2_transform: [String.raw`\begin{array}{@{}l@{}}{}^{\mathit{column}}T_{\mathit{upper}}(q_2)\\[4pt]\quad=T(0{,}150,\,0,\,0{,}700)\,R_y\!\left(-\frac{\pi}{2}+q_2\right)\end{array}`, 'Transformation du bras upper dans le repère column : translation de 0,150 mètre en X, zéro en Y et 0,700 mètre en Z, suivie de la rotation autour de Y d’angle moins pi sur deux plus q2'],
  j3_torsor: [String.raw`\left\{\mathcal{V}_{\text{avant-bras/bras}}\right\}_{O_3}=\left\{\begin{array}{c}0\\\dot q_3\\0\\0\\0\\0\end{array}\right\}`, 'Torseur cinématique de l’avant-bras par rapport au bras, au point O3 : vitesse angulaire zéro, q3 point, zéro, et vitesse en O3 nulle'],
  j3_transform: [String.raw`{}^{\mathit{upper}}T_{\mathit{forearm}}(q_3)=T_x(0{,}900)\,R_y(q_3)`, 'Transformation de l’avant-bras forearm dans le repère upper : translation de 0,900 mètre suivant X, suivie de la rotation autour de Y d’angle q3'],
  j4_torsor: [String.raw`\left\{\mathcal{V}_{\text{outil/avant-bras}}\right\}_{O_4}=\left\{\begin{array}{c}0\\0\\\dot q_4\\0\\0\\0\end{array}\right\}`, 'Torseur cinématique de l’outil par rapport à l’avant-bras, au point O4 : vitesse angulaire zéro, zéro, q4 point, et vitesse en O4 nulle'],
  j4_transform: [String.raw`\begin{array}{@{}l@{}}{}^{\mathrm{forearm}}T_{\mathrm{tool}}(q_4)\\[4pt]\quad=T(0{,}800,\,0,\,-0{,}308)\,R_z(q_4)\end{array}`, 'Transformation de l’outil tool dans le repère forearm : translation de 0,800 mètre en X, zéro en Y et moins 0,308 mètre en Z, suivie de la rotation autour de Z d’angle q4'],
  command: [String.raw`q,\;\dot q,\;\ddot q,\;t`, 'Position, vitesse, accélération et temps'],
  states: [String.raw`q,\;\dot q`, 'Position et vitesse'],
  simulated: [String.raw`q_{\mathrm{sim}},\;\dot q_{\mathrm{sim}}`, 'Position et vitesse simulées'],
  reference: [String.raw`q_{${ref}},\;\ddot q_{${ref}}`, 'Position et accélération de référence'],
  error: [String.raw`\varepsilon=q_{${ref}}-q_{\mathrm{sim}}`, 'Erreur égale position de référence moins position simulée'],
  inertia: [String.raw`M_c\!\left(q_{${ref}}\right)\,\ddot q_{${ref}}`, 'Matrice d’inertie contrainte à la configuration de référence, multipliée par l’accélération de référence'],
  coupling: [String.raw`\tau_{u_2}=\tau_{q_2}-\tau_{q_3}`, 'Couple moteur u2 égal au couple généralisé q2 moins le couple généralisé q3'],
  appliedStates: [String.raw`\rightarrow q,\;\dot q`, 'Vers les états de position et vitesse'],
  torqueUnit: [String.raw`\mathrm{N\,m}`, 'newton-mètres'],
  errorUnit: [String.raw`\mathrm{mrad}`, 'milliradians'],
  peakError: [String.raw`${number(Math.abs(evidence.maxError[3]))}\,{\scriptstyle\mathrm{mrad}}`, '12,09 milliradians, pic absolu de J1 sur ce transfert'],
  demand: [String.raw`${number(evidence.peak[4],1)}\,{\scriptstyle\mathrm{N\,m}}`, 'Demande motrice, moins 863,8 newton-mètres'],
  limited: [String.raw`${number(evidence.peak[5],1)}\,{\scriptstyle\mathrm{N\,m}}`, 'Commande limitée, moins 863,8 newton-mètres'],
  applied: [String.raw`${number(evidence.peak[6],1)}\,{\scriptstyle\mathrm{N\,m}}`, 'Équivalent appliqué, moins 871,5 newton-mètres'],
  reaction: [String.raw`${number(evidence.peak[7])}\,\mathrm{N\,m}`, 'Réaction d’inertie, 7,71 newton-mètres'],
  instant: [String.raw`t=${number(evidence.peak[0],3)}\,\mathrm{s}`, 'Instant t égal à 0,572 seconde'],
}
// Slides 13 and 15 use the same font and standalone path renderer as slide 14.
Object.assign(sources, {
  tp_level:[String.raw`q_2+q_3=90^\circ`,'Somme des angles q2 et q3 égale à 90 degrés'],
  tp_yaw:[String.raw`q_1+q_4=0^\circ`,'Somme des angles q1 et q4 égale à zéro degré'],
  tp_lacet:[String.raw`\mathrm{lacet}=0^\circ`,'Lacet égal à zéro degré'],
  tp_stops:[String.raw`\dot q=0,\quad\ddot q=0`,'Vitesse et accélération nulles'],
  tp_position:[String.raw`q_1\;({}^\circ)`,'Position J1 en degrés'],
  tp_velocity:[String.raw`\dot q_1\;({}^\circ\! /\mathrm{s})`,'Vitesse J1 en degrés par seconde'],
  tp_acceleration:[String.raw`\ddot q_1\;({}^\circ\! /\mathrm{s}^{2})`,'Accélération J1 en degrés par seconde carrée'],
  tp_q:[String.raw`q`,'Positions articulaires'],tp_qd:[String.raw`\dot q`,'Vitesses articulaires'],tp_qdd:[String.raw`\ddot q`,'Accélérations articulaires'],
  tp_joints:[String.raw`q_1,\ldots,q_4`,'Angles q1 à q4'],
  tp_height:[String.raw`1{,}491\,\mathrm{m}`,'Environ 1,491 mètre'],
  tp_descent:[String.raw`40\,\mathrm{mm}`,'Environ 40 millimètres'],
  rs_level:[String.raw`q_2+q_3\;\text{à}\;90^\circ`,'Écart de la somme q2 plus q3 à 90 degrés'],
})
for (const [i,axis] of ['x','y','z'].entries()) sources[`tp_${axis}`]=[`${axis}=${number(trajectory.ik.requested_j4_output_world_m[i],3)}\\,\\mathrm{m}`,`${axis} : ${trajectory.ik.requested_j4_output_world_m[i].toFixed(3).replace('.',',')} mètre`]
Object.values(trajectory.ik.joint_target_rad).forEach((q,i)=>{sources[`tp_joint${i+1}`]=[`q_${i+1}=${number(q*180/Math.PI)}^\\circ`,`Angle q${i+1} : ${(q*180/Math.PI).toFixed(2).replace('.',',')} degrés`]})
trajectory.boundaries.forEach(b=>{const n=number(b.t,3).replace(/0+$/,'').replace(/\{,\}$/,'');sources[`tp_time${b.id}`]=[`${n}\\,\\mathrm{s}`,`Instant ${b.id} : ${b.t} secondes`]})
for(const [name,ratio] of Object.entries({velocity:planned.dynamicRatios.maximum_velocity_ratio,acceleration:planned.dynamicRatios.maximum_acceleration_ratio,jerk:planned.dynamicRatios.maximum_jerk_ratio}))sources[`tp_ratio_${name}`]=[`${number(ratio*100,1)}\\,\\%`,`${(ratio*100).toFixed(1).replace('.',',')} pour cent de la limite`]
const max=key=>Math.max(...results.cycles.map(c=>c[key]))
for(const [key,unit] of Object.entries({seconds:'s',xyMm:'mm',zMm:'mm',yawDeg:'degree',levelDeg:'degree',saturationMs:'ms'})){
  const texUnit=unit==='degree'?String.raw`^\circ`:String.raw`\,\mathrm{${unit}}`
  const digits=key==='saturationMs'?0:3
  sources[`rs_max_${key}`]=[`${number(max(key),digits)}${texUnit}`,`Maximum ${max(key).toFixed(digits).replace('.',',')} ${unit==='degree'?'degrés':unit}`]
  sources[`rs_limit_${key}`]=[`${number(results.limits[key],0)}${texUnit}`,`Seuil ${results.limits[key]} ${unit==='degree'?'degrés':unit}`]
}
sources.rs_margin=[`${number(results.limits.seconds-max('seconds'),3)}\\,\\mathrm{s}`,'Marge minimale par rapport au seuil : 0,474 seconde']
sources.rs_mean=[`${number(results.meanSeconds,3)}\\,\\mathrm{s}`,'Durée moyenne : 10,556 secondes']
sources.rs_targetZ=[`${number(results.placementCases.zMm.expectedXYZm[2]*1000,0)}\\,\\mathrm{mm}`,'Centre cible à 1 205 millimètres']
sources.rs_observedZ=[`${number(results.placementCases.zMm.observedXYZm[2]*1000,3)}\\,\\mathrm{mm}`,'Hauteur du centre observé dans le cas maximal du critère Z']
mathjax.asyncLoad = name => import(name)
const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)
const document = mathjax.document('', {
  InputJax: new TeX(),
  OutputJax: new SVG({ fontCache:'none', linebreaks:{inline:false} }),
})
const output = {}
for (const [key,[tex,label]] of Object.entries(sources)) {
  const html = adaptor.outerHTML(await document.convertPromise(tex,{display:false}))
  // Matrices contain nested SVG viewports. Keep through the outer closing tag.
  const svg = html.match(/<svg\b[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/)
  if (!svg || /data-mml-node="merror"|<use\b|<text\b|<image\b/.test(html)) throw new Error(`Invalid standalone math: ${key}`)
  output[key] = {tex,label,viewBox:svg[1].split(' ').map(Number),body:svg[2]
    .replaceAll('currentColor','inherit').replace(/ data-(?:mml-node|latex|c)="[^"]*"/g,'')}
}
const result = '// Generated by scripts/math/generate-runtime.mjs. Edit the LaTeX sources there.\nexport const runtimeMath = '+JSON.stringify(output,null,2)+' as const\n'
const target = new URL('../../src/content/runtimeMath.ts',import.meta.url)
if (process.argv.includes('--check')) {
  if (await readFile(target,'utf8') !== result) throw new Error('Runtime math is stale; run npm run math:generate')
} else await writeFile(target,result)
console.log(`${Object.keys(output).length} standalone formulas ${process.argv.includes('--check')?'verified':'generated'}.`)
