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
  const svg = html.match(/<svg\b[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/)
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
