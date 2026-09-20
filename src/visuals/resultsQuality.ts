import { resultsEvidence as evidence } from '../content/resultsEvidence'
import { math, mathWidth, type RuntimeMathKey } from './runtimeMath'

type PlacementKey = keyof typeof evidence.placementCases
type QualityKey = PlacementKey | 'levelDeg' | 'saturationMs'
const fr = (n: number, digits = 3) => n.toFixed(digits).replace('.', ',').replace('-', '−')
const text = (x: number, y: number, content: string, cls = 'rs-note', anchor = 'start') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${content}</text>`
const maximum = (key: QualityKey) => evidence.cycles.reduce((a, b) => a[key] > b[key] ? a : b)[key]
const labelledValue=(x:number,y:number,label:string,key:RuntimeMathKey,size:number,cls:string)=>text(x-mathWidth(key,size)-8,y,label,cls,'end')+math(x,y,key,size,cls,false,'end')
const cross = (x: number, y: number, cls: string) => `<path class="${cls}" d="M${x-8} ${y} h16 M${x} ${y-8} v16"/>`
const centre = (x: number, y: number, observed = false) => observed
  ? `<circle class="qc-centre-observed" cx="${x}" cy="${y}" r="5"/>`
  : cross(x,y,'qc-centre-target')
const figure = (cue: number, body: string) => `<g class="qc-figure" data-quality-view="${cue}" aria-hidden="true">${body}</g>`

function heading(key: PlacementKey, title: string, sub: string) {
  const c=evidence.placementCases[key]
  return text(0,33,title,'rs-panel-title')+text(0,77,sub,'rs-subtitle')+
    text(0,105,`Séquence ${c.sequence} · carton ${c.carton} · couche ${c.layer} — cas maximal de ce critère`)
}

function legend() {
  return `<path class="qc-target" d="M0 518 H42"/>${text(53,524,'Pose cible','qc-legend')}`+
    `<path class="qc-observed-edge" d="M204 518 H246"/>${text(257,524,'Carton observé','qc-legend')}`+
    text(939,524,'Géométrie et poses issues du simulateur','rs-note','end')
}

/** Physical plan: all positions share one mm scale. Only the selected carton is measured. */
function plan(key: PlacementKey, focus: 'centre' | 'corner') {
  const c=evidence.placementCases[key], s=.32, ox=222, oy=329
  const [width,depth]=evidence.geometry.cartonMm
  const [pw,pd]=evidence.geometry.palletMm
  const targetX=evidence.geometry.tangentOffsetsMm[1], targetY=evidence.geometry.rowOffsetsMm.outer
  const tx=ox+targetX*s, ty=oy-targetY*s
  const px=tx+c.deltaMm[0]*s, py=ty-c.deltaMm[1]*s
  const other=evidence.geometry.tangentOffsetsMm.flatMap(x=>Object.values(evidence.geometry.rowOffsetsMm).map(y=>{
    if(x===targetX && y===targetY)return ''
    return `<rect class="qc-slot" x="${ox+(x-width/2)*s}" y="${oy-(y+depth/2)*s}" width="${width*s}" height="${depth*s}"/>`
  })).join('')
  const fx=focus==='centre'?tx:tx+width/2*s, fy=focus==='centre'?ty:ty-depth/2*s
  return text(0,152,'VUE DE DESSUS','rs-eyebrow')+
    `<rect class="qc-pallet" x="${ox-pw/2*s}" y="${oy-pd/2*s}" width="${pw*s}" height="${pd*s}"/>${other}`+
    `<g transform="translate(${px} ${py}) rotate(${-c.observedYawDeg})"><rect class="qc-carton" x="${-width/2*s}" y="${-depth/2*s}" width="${width*s}" height="${depth*s}"/><path class="qc-seam" d="M${-width/2*s} 0 H${width/2*s}"/></g>`+
    `<rect class="qc-target" x="${tx-width/2*s}" y="${ty-depth/2*s}" width="${width*s}" height="${depth*s}"/>`+
    text(tx,ty+39,`C${c.carton}`,'qc-carton-id','middle')+
    centre(tx,ty)+centre(px,py,true)+
    `<rect class="qc-callout-source" x="${fx-15}" y="${fy-15}" width="30" height="30"/><path class="qc-zoom-link" d="M${fx+15} ${fy-15} L487 193 M${fx+15} ${fy+15} L487 459"/>`+
    text(0,489,'Les trois autres contours indiquent les emplacements de la couche.','qc-small')
}

function windowFrame(id: string, label: string, content: string) {
  return text(487,152,label,'rs-eyebrow')+
    `<defs><clipPath id="${id}"><rect x="487" y="177" width="452" height="290"/></clipPath></defs>`+
    `<rect class="qc-window" x="487" y="177" width="452" height="290"/>`+
    `<g clip-path="url(#${id})">${content}</g>`
}

function xy() {
  const c=evidence.placementCases.xyMm, scale=.32*16, x=592,y=323
  const px=x+c.deltaMm[0]*scale, py=y-c.deltaMm[1]*scale
  // The inset is a uniformly scaled crop of the carton centre, not amplified errors.
  const angle=Math.atan2(py-y,px-x), nx=Math.sin(angle),ny=-Math.cos(angle), offset=54
  const ax=x+nx*offset,ay=y+ny*offset,bx=px+nx*offset,by=py+ny*offset
  const inset=`<rect class="qc-face" x="487" y="177" width="452" height="290"/>`+
    `<path class="qc-seam" d="M487 ${py-(px-487)*Math.tan(-c.observedYawDeg*Math.PI/180)} L939 ${py+(939-px)*Math.tan(-c.observedYawDeg*Math.PI/180)}"/>`+
    `<g class="qc-annotation"><path class="qc-extension" d="M${x} ${y-12} L${ax} ${ay-10} M${px} ${py-12} L${bx} ${by-10}"/>`+
    `<path class="qc-dimension" d="M${ax} ${ay} L${bx} ${by} M${ax-4} ${ay-6} l8 12 M${bx-4} ${by-6} l8 12"/>`+
    math(715,234,'rs_max_xyMm',36,'qc-dimension-label',false,'middle')+
    centre(x,y)+centre(px,py,true)+
    `<path class="qc-target-leader" d="M${x} ${y+15} v40 h-57"/>${text(509,407,'Centre cible','qc-legend')}`+
    `<path class="qc-observed-leader" d="M${px+12} ${py+8} l39 40 h176"/>${text(732,407,'Centre observé','qc-legend')}</g>`
  return figure(2,heading('xyMm','Le carton est-il au bon endroit ?','Position XY · décalage du centre par rapport à sa cible')+
    plan('xyMm','centre')+windowFrame('qc-xy-clip','DÉTAIL DES CENTRES · ×16',inset)+legend())
}

function yaw() {
  const c=evidence.placementCases.yawDeg, scale=.32*16
  const [w,d]=evidence.geometry.cartonMm
  // Rotation alone: the inset centres are registered before cropping the corner.
  // The angle is unchanged. Translation is intentionally removed and disclosed below.
  const cornerX=740,cornerY=290, cx=cornerX-w/2*scale,cy=cornerY+d/2*scale
  const inset=`<g transform="translate(${cx} ${cy}) rotate(${-c.observedYawDeg})"><rect class="qc-carton" x="${-w/2*scale}" y="${-d/2*scale}" width="${w*scale}" height="${d*scale}"/></g>`+
    `<path class="qc-target" d="M487 ${cornerY} H${cornerX} V467"/>`+
    `<g class="qc-annotation">${text(516,214,'Écart d’orientation','qc-legend')}${math(516,255,'rs_max_yawDeg',36,'qc-dimension-label')}`+
    `<path class="qc-target-leader" d="M${cornerX-4} ${cornerY-8} l38 -43 h137"/>${text(890,227,'Cible','qc-legend','end')}`+
    `<path class="qc-observed-leader" d="M${cornerX+19} ${cornerY+43} l36 54 h94"/>${text(890,412,'Observé','qc-legend','end')}</g>`
  return figure(3,heading('yawDeg','Le carton garde-t-il la bonne orientation ?','Orientation à la dépose · comparaison des arêtes')+
    plan('yawDeg','corner')+windowFrame('qc-yaw-clip','DÉTAIL D’UN COIN · ×16',inset)+
    text(487,489,'Centres superposés pour isoler la rotation ; angle non amplifié.','qc-small')+legend())
}

function height() {
  const c=evidence.placementCases.zMm, s=.48, x=227,y=248
  const [w,,h]=evidence.geometry.cartonMm
  const py=y-c.deltaMm[2]*s
  const sy=y+(c.expectedXYZm[2]*1000-c.supportCentreZMm)*s
  const target=292,observed=target-c.deltaMm[2]*s*16
  const inset=`<rect class="qc-face" x="487" y="177" width="452" height="290"/>`+
    `<g class="qc-annotation"><path class="qc-target" d="M514 ${target} H850"/><path class="qc-observed-edge" d="M514 ${observed} H850"/>`+
    centre(645,target)+centre(645,observed,true)+
    text(518,261,'Centre cible ·','qc-legend')+math(650,261,'rs_targetZ',23,'qc-legend')+
    text(518,391,'Centre observé ·','qc-legend')+math(678,391,'rs_observedZ',23,'qc-legend')+
    `<path class="qc-extension" d="M850 ${target} H902 M850 ${observed} H902"/><path class="qc-dimension" d="M886 ${target} V${observed} M880 ${target-4} l12 8 M880 ${observed-4} l12 8"/>`+
    math(715,221,'rs_max_zMm',36,'qc-dimension-label',false,'middle')+'</g>'
  return figure(4,heading('zMm','Le carton atteint-il la hauteur attendue ?','Hauteur Z · écart du centre, pas une profondeur de contact')+
    text(0,152,'VUE DE CÔTÉ · PROJECTION Z','rs-eyebrow')+
    `<rect class="qc-support" x="${x-w/2*s}" y="${sy-h/2*s}" width="${w*s}" height="${h*s}"/>`+
    text(x,sy+8,'C8 · support','qc-support-label','middle')+
    `<rect class="qc-carton" x="${x-w/2*s}" y="${py-h/2*s}" width="${w*s}" height="${h*s}"/>`+
    `<rect class="qc-target" x="${x-w/2*s}" y="${y-h/2*s}" width="${w*s}" height="${h*s}"/>`+
    text(x,py-31,'C12 · couche 3','qc-carton-id','middle')+centre(x,y)+centre(x,py,true)+
    `<rect class="qc-callout-source" x="${x-16}" y="${y-16}" width="32" height="32"/><path class="qc-zoom-link" d="M${x+16} ${y-16} L487 193 M${x+16} ${y+16} L487 459"/>`+
    windowFrame('qc-z-clip','DÉTAIL DES HAUTEURS · ×16',inset)+
    text(0,489,'Cible Z : centre du carton à 1 205 mm, avec 5 mm de marge de pose.','qc-small')+legend())
}

function behavior() {
  const plots: Array<{key:'levelDeg'|'saturationMs',title:string,unit:string,top:number,bottom:number}> = [
    {key:'levelDeg',title:'Horizontalité · écart de q2 + q3 à 90°',unit:'°',top:141,bottom:262},
    {key:'saturationMs',title:'Saturation · plus longue plage contiguë par carton',unit:'ms',top:351,bottom:455},
  ]
  const charts=plots.map(({key,title,unit,top,bottom})=>{
    const limit=evidence.limits[key], max=maximum(key), x=(i:number)=>64+(i-1)/107*851
    const y=(v:number)=>bottom-v/limit*(bottom-top)
    const separators=Array.from({length:8},(_,i)=>`<path class="rs-separator" d="M${x((i+1)*12+.5)} ${top} V${bottom}"/>`).join('')
    const marks=evidence.cycles.map(c=>`<circle class="qc-behavior-dot${c[key]===max?' qc-behavior-peak':''}" cx="${x(c.index)}" cy="${y(c[key])}" r="${c[key]===max?3.9:2.8}"><title>S${c.sequence}, carton ${c.carton} : ${fr(c[key],key==='saturationMs'?0:3)} ${unit}</title></circle>`).join('')
    return (key==='levelDeg'?text(0,top-31,'Horizontalité · écart de','rs-subtitle')+math(260,top-31,'rs_level',27,'rs-subtitle'):text(0,top-31,title,'rs-subtitle'))+separators+
      `<path class="rs-grid" d="M64 ${bottom} H915"/><path class="rs-threshold" d="M64 ${top} H915"/>`+
      text(51,top+6,`${limit}`,'rs-tick','end')+text(51,bottom+6,'0','rs-tick','end')+
      labelledValue(917,top-12,'Seuil',`rs_limit_${key}`,24,'rs-threshold-label')+marks+
      labelledValue(917,key==='saturationMs'?top+43:bottom-16,'Maximum',`rs_max_${key}`,23,'rs-annotation')
  }).join('')
  const labels=Array.from({length:9},(_,i)=>text(64+(i*12+5.5)/107*851,486,`S${i+1}`,'rs-axis','middle')).join('')
  return figure(5,text(0,33,'Et pendant le mouvement ?','rs-panel-title')+
    text(0,76,'Deux critères de comportement, suivis sur les 108 cartons.','rs-note')+charts+labels+
    text(0,530,'1 point = le maximum d’un cycle. Ce ne sont pas des signaux temporels.','rs-note'))
}

function summary() {
  const rows: Array<[QualityKey,string,string,number,number]> = [
    ['xyMm','Position XY','mm',129,2],['yawDeg','Orientation','°',219,3],['zMm','Hauteur Z','mm',309,4],
    ['levelDeg','Horizontalité','°',425,5],['saturationMs','Saturation contiguë','ms',502,5],
  ]
  return `<path class="rs-rule" d="M986 5 V539"/>`+
    text(1024,33,'Maxima de la campagne','rs-panel-title')+
    text(1024,76,'108 CYCLES · 5 CRITÈRES','rs-eyebrow')+
    rows.map(([key,label,unit,y,cue])=>{
      const value=maximum(key),limit=evidence.limits[key],end=1034+350*value/limit
      return `<g class="qc-row" data-results-metric="${key}" data-results-goto="${cue}" tabindex="-1" role="button" aria-label="Afficher ${label} : maximum ${fr(value,key==='saturationMs'?0:3)} ${unit}, seuil ${limit} ${unit}">`+
        `<rect class="qc-row-surface" x="1014" y="${y-31}" width="580" height="75" rx="3"/><path class="qc-row-accent" d="M1015 ${y-24} V${y+36}"/>`+
        text(1034,y,label,'qc-metric-label')+
        math(1578,y,`rs_max_${key}`,33,'qc-metric-value',false,'end')+
        `<path class="rs-bar-track" d="M1034 ${y+25} H1384"/><path class="rs-bar-value" d="M1034 ${y+25} H${end}"/><circle class="rs-bar-dot" cx="${end}" cy="${y+25}" r="4"/><path class="rs-limit" d="M1384 ${y+16} v18"/>`+
        labelledValue(1578,y+31,'seuil',`rs_limit_${key}`,21,'qc-limit-label')+`</g>`
    }).join('')+
    text(1024,380,'COMPORTEMENT DU ROBOT','rs-eyebrow')
}

export function qualityMarkup() {
  return `<g class="rs-panel rs-quality-panel" data-results-panel="2 3 4 5" aria-hidden="true">${xy()}${yaw()}${height()}${behavior()}${summary()}</g>`
}

export function updateQuality(view: HTMLElement,cue: number) {
  view.querySelectorAll<SVGGElement>('[data-quality-view]').forEach(el=>{
    const active=Number(el.dataset.qualityView)===cue
    el.classList.toggle('is-visible',active)
    el.setAttribute('aria-hidden',String(!active))
  })
  view.querySelectorAll<SVGGElement>('.qc-row').forEach(el=>el.setAttribute('tabindex',cue>=2?'0':'-1'))
}
