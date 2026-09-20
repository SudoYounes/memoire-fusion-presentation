import { gsap } from 'gsap'
import { resultsEvidence as evidence } from '../content/resultsEvidence'
import { qualityMarkup, updateQuality } from './resultsQuality'
import { math, mathWidth } from './runtimeMath'

export const resultsCues = [
  { label: '01 · Résultat d’ensemble', text: 'Neuf séquences complètes de douze cartons, avec un verdict accepté pour chacun des 108 cycles.' },
  { label: '02 · Cadence', text: 'Le cycle le plus lent reste à 11,526 s. La marge minimale observée par rapport au seuil de 12 s est de 0,474 s.' },
  { label: '03a · Position XY', text: 'Le plus grand décalage du centre vaut 14,492 mm, sous le seuil de 25 mm. Le détail agrandi conserve les proportions de la mesure.' },
  { label: '03b · Orientation', text: 'Le cas le plus tourné présente un écart de 0,985°, sous le seuil de 2°. Le zoom superpose les centres pour isoler la rotation.' },
  { label: '03c · Hauteur Z', text: 'Le centre du carton est à 5,121 mm sous sa cible, pour un seuil de 15 mm. Ce n’est pas une mesure d’enfoncement dans le support.' },
  { label: '03d · Comportement du robot', text: 'Horizontalité : 0,805° au maximum ; saturation contiguë : 10 ms. Chaque critère retient son propre cas maximal, pas nécessairement le même cycle.' },
] as const

type Metric = 'seconds' | 'xyMm' | 'zMm' | 'yawDeg' | 'levelDeg' | 'saturationMs'
const maximum = (key: Metric) => evidence.cycles.reduce((best, row) => row[key] > best[key] ? row : best)
const fr = (n: number, digits = 3) => n.toFixed(digits).replace('.', ',').replace('-', '−')
const text = (x: number, y: number, lines: string[], cls = 'rs-body', step = 29) => `<text class="${cls}" x="${x}" y="${y}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? step : 0}">${line}</tspan>`).join('')}</text>`
const panel = (cue: number, contents: string) => `<g class="rs-panel" data-results-panel="${cue}" aria-hidden="true">${contents}</g>`

function overview() {
  const matrix = Array.from({ length: evidence.sequenceCount }, (_, i) =>
    `<g class="rs-sequence">${text(1070,314+i*23,[`S${i+1}`],'rs-tick')}${evidence.cycles.filter(row=>row.sequence===i+1).map((row,j)=>`<circle class="rs-accepted" cx="${1140+j*32}" cy="${309+i*23}" r="6"><title>Séquence ${row.sequence}, carton ${row.carton} : cycle accepté</title></circle>`).join('')}</g>`).join('')
  return panel(0,
    text(0,33,['Palettisation multicouche'],'rs-panel-title')+
    `<svg class="rs-scene" x="0" y="65" width="970" height="441" viewBox="700 955 1100 500" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Capture documentaire Gazebo du robot et de cartons empilés, distincte de la campagne v6"><image href="./media/multilayer-02.png" width="2880" height="1800"/></svg>`+
    text(0,536,['Capture documentaire Gazebo, distincte de la campagne v6.'],'rs-note')+
    `<path class="rs-rule" d="M1020 65 V506"/>`+
    text(1070,49,['CAMPAGNE V6'],'rs-eyebrow')+
    `<text class="rs-hero-number rs-highlight" x="1062" y="174">108<tspan class="rs-hero-denominator"> / 108</tspan></text>`+
    text(1070,240,['cycles acceptés'],'rs-result-label')+
    text(1070,280,['9 séquences × 12 cartons'],'rs-body')+matrix+
    text(1070,536,['Chaque point représente un cycle accepté.'],'rs-note'))
}

function cadence() {
  const left=80, right=1115, top=89, bottom=452
  // Equal spacing is ordinal cycle order, not elapsed campaign time.
  const x=(index:number)=>left+(index-1)/107*(right-left)
  const y=(seconds:number)=>bottom-(seconds-9.4)/(12.3-9.4)*(bottom-top)
  const peak=maximum('seconds')
  const bands=Array.from({length:9},(_,i)=>{
    const start=i===0?left:x(i*12+.5), end=i===8?right:x((i+1)*12+.5)
    return `<rect class="rs-band" x="${start}" y="${top}" width="${end-start}" height="${bottom-top}" opacity="${i%2?.035:0}"/>`+
      (i?`<path class="rs-separator" d="M${start} ${top} V${bottom}"/>`:'')+
      `<text class="rs-axis" x="${(start+end)/2}" y="484" text-anchor="middle">S${i+1}</text>`
  }).join('')
  const grid=[9.5,10,10.5,11,11.5,12].map(t=>`<path class="rs-grid" d="M${left} ${y(t)} H${right}"/><text class="rs-tick" x="${left-19}" y="${y(t)+5}" text-anchor="end">${fr(t,1)}</text>`).join('')
  const paths=Array.from({length:9},(_,i)=>`<path class="rs-cycle-line" d="${evidence.cycles.filter(row=>row.sequence===i+1).map((row,j)=>`${j?'L':'M'}${x(row.index).toFixed(3)} ${y(row.seconds).toFixed(3)}`).join(' ')}"/>`).join('')
  const points=evidence.cycles.map(row=>`<circle class="rs-cycle-point" data-results-cycle="${row.index}" cx="${x(row.index)}" cy="${y(row.seconds)}" r="3.7"><title>S${row.sequence}, carton ${row.carton} : ${fr(row.seconds)} s</title></circle>`).join('')
  const high=`<g class="rs-highlight"><path class="rs-peak-guide" d="M${x(peak.index)} ${y(peak.seconds)} V${bottom}"/><circle class="rs-peak-halo" cx="${x(peak.index)}" cy="${y(peak.seconds)}" r="12"/><circle class="rs-peak-dot" cx="${x(peak.index)}" cy="${y(peak.seconds)}" r="5"/><path class="rs-leader" d="M${x(peak.index)+10} ${y(peak.seconds)-4} l24 -24 h126"/>${text(x(peak.index)+43,y(peak.seconds)-38,['Cycle le plus lent'],'rs-annotation')}</g>`
  return panel(1,
    text(0,33,['108 durées, toutes sous le seuil de 12 secondes'],'rs-panel-title')+
    text(left,69,['Temps simulé par carton (s)'],'rs-axis')+bands+grid+
    `<path class="rs-threshold" d="M${left} ${y(12)} H${right}"/><text class="rs-threshold-label" x="${right-mathWidth('rs_limit_seconds',24)-9}" y="${y(12)-14}" text-anchor="end">Seuil</text>`+math(right,y(12)-14,'rs_limit_seconds',24,'rs-threshold-label',false,'end')+paths+points+high+
    text(80,535,['1 point = 1 carton. Les séparations marquent les neuf séquences distinctes.'],'rs-note')+
    `<path class="rs-rule" d="M1160 89 V493"/>`+
    text(1200,103,['MAXIMUM OBSERVÉ'],'rs-eyebrow')+
    math(1200,168,'rs_max_seconds',66,'rs-number rs-highlight')+
    text(1200,202,[`Séquence ${peak.sequence}, carton ${peak.carton}`],'rs-note')+
    text(1200,261,['MARGE MINIMALE'],'rs-eyebrow')+
    math(1200,335,'rs_margin',66,'rs-number rs-highlight')+
    text(1200,369,['12 s − cycle le plus lent'],'rs-note')+
    text(1200,442,['MOYENNE'],'rs-eyebrow')+
    math(1200,496,'rs_mean',51,'rs-number rs-number--secondary'))
}


export function mountResultsFlow(stage: HTMLElement) {
  const holder=stage.querySelector<HTMLElement>('[data-results-flow]')!
  holder.innerHTML=`<svg class="results-flow-svg" viewBox="0 0 1600 550" role="group" aria-labelledby="rs-title rs-desc"><title id="rs-title">Résultats de simulation, campagne v6</title><desc id="rs-desc">Six temps de lecture : bilan, cadence, position XY, orientation, hauteur Z et comportement du robot. Les vues de cartons reprennent les dimensions et poses enregistrées de trois cas distincts. Les agrandissements sont cotés. Les maxima de chaque critère ne sont pas nécessairement simultanés. La capture Gazebo est documentaire.</desc>${overview()}${cadence()}${qualityMarkup()}</svg>`
  let animation: gsap.core.Timeline | undefined
  const finish=()=>{
    animation?.kill()
    gsap.set(stage.querySelectorAll('.rs-panel, .rs-highlight, .qc-figure, .qc-annotation'),{clearProps:'opacity,transform'})
    stage.querySelectorAll('.rs-panel, .rs-highlight, .qc-figure, .qc-annotation').forEach(el=>el.removeAttribute('transform'))
  }
  const update=(view:HTMLElement,cue:number,noMotion:boolean)=>{
    view.dataset.resultsCue=String(cue)
    view.dataset.resultsStatic=String(noMotion)
    view.querySelectorAll<SVGGElement>('[data-results-panel]').forEach(el=>{
      const visible=el.dataset.resultsPanel!.split(' ').map(Number).includes(cue)
      el.classList.toggle('is-visible',visible)
      el.setAttribute('aria-hidden',String(!visible))
    })
    view.querySelectorAll<HTMLButtonElement>('[data-results-goto]').forEach(el=>{
      const selected=el.closest('.results-tabs') ? Number(el.dataset.resultsGoto)===Math.min(cue,2) : Number(el.dataset.resultsGoto)===cue
      if(selected)el.setAttribute('aria-current','step')
      else el.removeAttribute('aria-current')
    })
    updateQuality(view,cue)
    const label=view.querySelector('[data-results-label]'),caption=view.querySelector('[data-results-caption]'),position=view.querySelector('[data-results-position]')
    if(label)label.textContent=resultsCues[cue].label
    if(caption)caption.textContent=resultsCues[cue].text
    if(position)position.textContent=`0${cue+1} / 0${resultsCues.length}`
    const prev=view.querySelector<HTMLButtonElement>('[data-results-prev]'),next=view.querySelector<HTMLButtonElement>('[data-results-next]')
    if(prev)prev.disabled=cue===0
    if(next)next.disabled=cue===resultsCues.length-1
  }
  const play=()=>{
    finish()
    const current=stage.querySelector('.qc-figure.is-visible') ?? stage.querySelector('.rs-panel.is-visible')!
    animation=gsap.timeline()
      .fromTo(current,{opacity:0,y:8},{opacity:1,y:0,duration:.34,ease:'power2.out',clearProps:'opacity,transform'})
      .fromTo(current.querySelectorAll('.rs-highlight, .qc-annotation'),{opacity:.12},{opacity:1,duration:.55,ease:'power1.out',clearProps:'opacity'},.22)
  }
  return {finish,update,play,dispose:finish}
}
