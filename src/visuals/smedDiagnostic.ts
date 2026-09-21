/** Native, editable reconstruction of the source Pareto (VIATRIS, slide 21). */
const categories = [
  { id: 'attente', label: 'Attente', minutes: 179 },
  { id: 'controle', label: 'Contrôle', minutes: 173 },
  { id: 'transport', label: 'Transport', minutes: 25 },
] as const
const total = categories.reduce((sum, item) => sum + item.minutes, 0)
const chart = { left: 52, right: 650, top: 32, bottom: 348, height: 316 }
const centers = [160, 351, 542]
const percent = (value: number) => value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
let cumulative = 0
const points = categories.map((item, index) => {
  cumulative += item.minutes
  return { x: centers[index], y: chart.bottom - cumulative / total * chart.height, percent: cumulative / total * 100 }
})

function pareto(): string {
  return `<figure class="smed-pareto-vertical" aria-labelledby="smed-pareto-caption">
    <figcaption id="smed-pareto-caption"><strong>Pareto NVA</strong><span>Classement du diagnostic source</span></figcaption>
    <svg viewBox="0 0 712 410" role="img" aria-labelledby="smed-pareto-title smed-pareto-desc">
      <title id="smed-pareto-title">Pareto des temps classés : attente, contrôle, transport</title>
      <desc id="smed-pareto-desc">Barres en minutes : 179, 173 et 25. Cumul : 47,5 %, 93,4 % et 100 %. Seuil de référence : 80 % sur l’axe droit. Total : 377 minutes.</desc>
      <text class="smed-pareto-unit" x="52" y="12">Minutes</text><text class="smed-pareto-unit" x="650" y="12" text-anchor="end">Cumul</text>
      ${[0, 40, 80, 120, 160, 200].map(value => {
        const y = chart.bottom - value / 200 * chart.height
        return `<g class="smed-pareto-grid"><line x1="${chart.left}" y1="${y}" x2="${chart.right}" y2="${y}"/><text x="39" y="${y + 5}" text-anchor="end">${value}</text><text x="662" y="${y + 5}">${value / 2} %</text></g>`
      }).join('')}
      ${categories.map((item, index) => {
        const height = item.minutes / 200 * chart.height
        return `<g class="smed-pareto-category" data-pareto-category="${item.id}"><rect x="${centers[index] - 43}" y="${chart.bottom - height}" width="86" height="${height}"/><text class="smed-pareto-value" x="${centers[index]}" y="${chart.bottom - 12}" text-anchor="middle">${item.minutes}</text><text class="smed-pareto-label" x="${centers[index]}" y="378" text-anchor="middle">${item.label}</text></g>`
      }).join('')}
      <line class="smed-pareto-threshold" x1="${chart.left}" y1="${chart.bottom - .8 * chart.height}" x2="${chart.right}" y2="${chart.bottom - .8 * chart.height}"/>
      <polyline class="smed-pareto-cumulative-halo" points="${points.map(point => `${point.x},${point.y}`).join(' ')}"/>
      <polyline class="smed-pareto-cumulative" points="${points.map(point => `${point.x},${point.y}`).join(' ')}"/>
      ${points.map((point, index) => `<g class="smed-pareto-point" data-pareto-point="${index}"><circle cx="${point.x}" cy="${point.y}" r="4.5"/><text x="${point.x + (index === 0 ? 14 : 0)}" y="${point.y - (index === 0 ? 12 : 13)}" text-anchor="${index === 0 ? 'start' : 'middle'}">${percent(point.percent)} %</text></g>`).join('')}
    </svg>
    <div class="smed-pareto-legend" aria-hidden="true"><span><i></i>Temps</span><span><i></i>% cumulé</span><span><i></i>Seuil 80 %</span></div>
    <p class="smed-chart-scope">377 min classées — ce Pareto ne représente pas toute la durée d’arrêt.</p>
  </figure>`
}

const causes = [
  { key: 'visserie', step: 3, number: '02', cause: 'Visserie mal organisée', effect: 'Recherches au remontage, pièces indisponibles.', lever: 'Organisation et identification de la visserie', purpose: 'Limiter les pertes, les recherches et les mélanges.' },
  { key: 'gestes', step: 4, number: '03', cause: 'Maîtrise inégale des opérations', effect: 'Hésitations et demandes d’assistance.', lever: 'Support de formation des opérateurs', purpose: 'Standardiser la formation et faciliter la maîtrise des gestes.' },
  { key: 'blocages', step: 5, number: '04', cause: 'Absence de règle commune de mobilisation', effect: 'Résolution autonome prolongée, pratiques d’appel variables.', lever: 'Système de prise de décision', purpose: 'Réduire l’attente en cas de blocage.' },
] as const

export function renderSmedDiagnostic(): void {
  const slide = document.querySelector<HTMLElement>('#smed-diagnostic')
  if (!slide) return
  slide.dataset.smedSteps = '7'
  slide.innerHTML = `<div class="slide-stage smed-story-stage smed-diagnostic-stage">
    <header class="smed-story-heading" data-reveal><p class="kicker">SMED · Diagnostic → Amélioration</p><h2 class="display" id="smed-diagnostic-title">Du diagnostic aux <em>leviers d’amélioration</em></h2></header>
    <div class="smed-story-body">
      <div class="smed-pareto-layout" data-smed-scene="0,1,2">
        ${pareto()}
        <aside class="smed-reading" data-smed-scene="0" data-smed-caption="Le Pareto classe 377 minutes : attente 179, contrôle 173 et transport 25. La ligne montre leur cumul."><p class="smed-eyebrow">Comprendre le classement</p><p class="smed-reading-number">377 <span>min</span></p><h3>Trois catégories<br>de temps classés</h3><p>Les barres donnent les minutes.<br>La courbe donne leur poids cumulé.</p></aside>
        <aside class="smed-reading" data-smed-scene="1" data-smed-caption="L’attente représente 179 minutes, soit 47,5 % des minutes classées." hidden><p class="smed-eyebrow">01 · Attente</p><p class="smed-reading-number">179 <span>min</span></p><h3>Près de la moitié<br>du temps classé</h3><p>47,5 % du classement.<br>Un premier point d’attention pour l’analyse de terrain.</p></aside>
        <aside class="smed-reading" data-smed-scene="2" data-smed-caption="Attente et contrôle : 352 minutes, soit 93,4 % du classement. Ensemble, ces deux catégories dépassent le seuil de 80 %. Les contrôles nécessaires sont conservés." hidden><p class="smed-eyebrow">02 · Attente et contrôle</p><p class="smed-reading-number">93,4 <span>%</span></p><h3>352 des 377 min<br>du classement</h3><p>À deux, ces catégories dépassent le seuil de 80 %.</p><p class="smed-small-note">Les contrôles nécessaires restent présents : leur préparation et leur coordination font partie du chantier.</p></aside>
      </div>
      <div class="smed-cause-transform" data-smed-scene="3,4,5" hidden>
        <div class="smed-transform-heading"><p>Causes diagnostiquées <span>Analyse de terrain · source 22</span></p><p>Leviers d’amélioration <span>Réponses retenues · source 23</span></p></div>
        <div class="smed-transform-rows">${causes.map((cause, index) => `<div class="smed-transform-row" data-cause-row="${index + 1}">
          <div class="smed-cause-origin"><span class="smed-transform-index">${String(index + 1).padStart(2, '0')}</span><div><h3>${cause.cause}</h3><p>${cause.effect}</p></div></div>
          <span class="smed-transform-link" aria-hidden="true"><i></i><b>→</b></span>
          <div class="smed-cause-lever"><span class="smed-transform-index">${cause.number}</span><div><h3>${cause.lever}</h3><p>${cause.purpose}</p></div></div>
        </div>`).join('')}</div>
        ${causes.map(cause => `<p class="smed-transform-caption" data-smed-scene="${cause.step}" data-smed-caption="Constat : ${cause.cause}. À ce constat répond le levier : ${cause.lever}. ${cause.purpose}" hidden>${cause.purpose}</p>`).join('')}
        <p class="smed-small-note">Correspondances qualitatives : aucune part du gain n’est attribuée à un levier.</p>
      </div>
      <div class="smed-lever-overview" data-smed-scene="6" data-smed-caption="Quatre leviers d’amélioration sont retenus. Le nouveau scénario opératoire vient de l’observation du déroulement ; les trois autres répondent aux causes diagnostiquées." hidden>
        <div class="smed-lever-overview-heading"><h3>Quatre leviers pour agir</h3><p>De l’analyse à la mise en œuvre</p></div>
        <ol class="smed-lever-list">
          <li class="smed-lever-scenario"><span>01</span><div><p>Issu de l’observation du déroulement</p><h3>Nouveau scénario opératoire</h3><small>Paralléliser les opérations et organiser le temps masqué.</small></div></li>
          ${causes.map(cause => `<li data-lever-number="${cause.number}"><span>${cause.number}</span><div><p>Issu des causes diagnostiquées</p><h3>${cause.lever}</h3><small>${cause.purpose}</small></div></li>`).join('')}
        </ol>
        <p class="smed-lever-bridge">La suite montre les solutions et leurs artefacts, une à une.</p>
      </div>
    </div>
    <footer class="smed-story-footer"><p>Soutenance VIATRIS, slides 21–23.</p><nav aria-label="Étapes du diagnostic"><button type="button" data-smed-goto="0">Pareto</button><button type="button" data-smed-goto="1">Attente</button><button type="button" data-smed-goto="2">Contrôle</button><button type="button" data-smed-goto="3">Visserie</button><button type="button" data-smed-goto="4">Gestes</button><button type="button" data-smed-goto="5">Blocages</button><button type="button" data-smed-goto="6">Leviers</button></nav><span class="smed-step-hint">↑ ↓ <span data-smed-count>01 / 07</span></span></footer>
  </div>`
}

/** Preserve node identity while moving a diagnosis into its improvement lever. */
export function mountSmedDiagnostic(): () => void {
  const slide = document.querySelector<HTMLElement>('#smed-diagnostic')
  if (!slide) return () => {}
  const params = new URLSearchParams(window.location.search)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const staticMode = params.has('capture') || params.has('print') || params.get('motion') === 'off'
  const rows = Array.from(slide.querySelectorAll<HTMLElement>('[data-cause-row]'))
  const running = new Set<Animation>()
  const previousBounds = new Map<string, DOMRect>()
  let lastStep = -1
  const cancel = () => { running.forEach(animation => animation.cancel()); running.clear() }
  const update = () => {
    const step = Number(slide.dataset.smedStep)
    const count = Math.max(0, Math.min(3, step - 2))
    cancel()
    rows.forEach((row, index) => {
      const revealed = index < count
      const lever = row.querySelector<HTMLElement>('.smed-cause-lever')!
      const link = row.querySelector<HTMLElement>('.smed-transform-link')!
      row.classList.toggle('is-transformed', revealed)
      row.classList.toggle('is-current', step === index + 3)
      lever.setAttribute('aria-hidden', String(!revealed))
      if (step >= 3 && step <= 5 && revealed) previousBounds.set(causes[index].number, lever.getBoundingClientRect())
      if (step >= 3 && step <= 5 && step > lastStep && step === index + 3 && !staticMode && !reduced.matches) {
        const origin = row.querySelector<HTMLElement>('.smed-cause-origin')!
        const originBounds = origin.getBoundingClientRect()
        const leverBounds = lever.getBoundingClientRect()
        const distanceX = originBounds.left - leverBounds.left
        const distanceY = originBounds.top - leverBounds.top
        const animation = lever.animate([
          { opacity: 0, transform: `translate(${distanceX * .75}px, ${distanceY * .65}px)`, clipPath: 'inset(0 65% 0 0)' },
          { opacity: 1, transform: 'translate(0, 0)', clipPath: 'inset(0 0% 0 0)' },
        ], { duration: 820, easing: 'cubic-bezier(.22,1,.36,1)', delay: 110, fill: 'backwards' })
        const trace = link.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 580, easing: 'cubic-bezier(.22,1,.36,1)' })
        ;[animation, trace].forEach(item => { running.add(item); item.onfinish = () => running.delete(item) })
      }
    })
    if (step === 6 && lastStep === 5 && !staticMode && !reduced.matches) {
      slide.querySelectorAll<HTMLElement>('[data-lever-number]').forEach(lever => {
        const previous = previousBounds.get(lever.dataset.leverNumber ?? '')
        if (!previous) return
        const next = lever.getBoundingClientRect()
        const animation = lever.animate([
          { opacity: .45, transform: `translate(${previous.left - next.left}px, ${previous.top - next.top}px) scale(.96)` },
          { opacity: 1, transform: 'translate(0, 0) scale(1)' },
        ], { duration: 780, easing: 'cubic-bezier(.22,1,.36,1)' })
        running.add(animation)
        animation.onfinish = () => running.delete(animation)
      })
    }
    lastStep = step
  }
  const observer = new MutationObserver(update)
  observer.observe(slide, { attributes: true, attributeFilter: ['data-smed-step'] })
  update()
  reduced.addEventListener('change', cancel)
  window.addEventListener('beforeprint', cancel)
  return () => { observer.disconnect(); cancel(); reduced.removeEventListener('change', cancel); window.removeEventListener('beforeprint', cancel) }
}
