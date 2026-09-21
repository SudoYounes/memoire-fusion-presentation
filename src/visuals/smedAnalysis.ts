export const smedAnalysisIds = ['machines', 'functions', 'actors', 'phases'] as const
export type SmedAnalysisId = typeof smedAnalysisIds[number]

type Breakdown = { name: string; outside?: boolean; values: readonly [number, number, number, number] }

// VIATRIS slide 20, chart1.xml / chart2.xml. Values use c:pt@idx, not the
// compact order of populated points. A missing point has no plotted contribution.
const actors = ['Opérateur', 'Tech. maintenance', 'Chef d’équipe', 'Tech. qualité'] as const
const machineBreakdown: Breakdown[] = [
  { name: 'Christ', values: [52, 0, 15, 15] },
  { name: 'Étiqueteuse', values: [77, 0, 0, 0] },
  { name: 'Neri', values: [174, 0, 12, 0] },
  { name: 'Noack', values: [493, 111, 20, 15] },
  { name: 'PC', values: [99, 19, 0, 0] },
  { name: 'ADC', outside: true, values: [7, 0, 0, 0] },
  { name: 'Rangement', outside: true, values: [12, 0, 0, 0] },
]
const phaseBreakdown: Breakdown[] = [
  { name: 'Attente', values: [43, 0, 0, 0] },
  { name: 'Contrôle', values: [130, 3, 25, 30] },
  { name: 'Démarrage', values: [0, 0, 10, 0] },
  { name: 'Démontage', values: [82, 0, 0, 0] },
  { name: 'Nettoyage', values: [74, 3, 0, 0] },
  { name: 'Préparation', values: [84, 0, 12, 0] },
  { name: 'Réglage', values: [351, 124, 0, 0] },
  { name: 'Remontage', values: [120, 0, 0, 0] },
  { name: 'Transport', values: [25, 0, 0, 0] },
  { name: 'Vidange', values: [5, 0, 0, 0] },
]

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0)
const actorTotals = actors.map((_, index) => sum(machineBreakdown.map(row => row.values[index])))
const total = sum(actorTotals)
const decimal = (value: number) => value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const views: Record<SmedAnalysisId, { label: string; title: string; caption: string; note: string }> = {
  machines: {
    label: 'Machines', title: 'Temps par machine',
    caption: 'Les opérations sur Noack représentent 10,65 heures cumulées. Le graphique conserve également le rangement et les ADC hors machine.',
    note: 'Heures décimales, arrondies comme dans la source. ADC et rangement restent hors machine.',
  },
  functions: {
    label: 'Fonctions', title: 'Temps par fonction',
    caption: 'La production représente 16,02 heures cumulées, la maintenance 2,17 heures et la qualité 0,50 heure. La production regroupe les opérateurs et le chef d’équipe.',
    note: 'La production regroupe les opérateurs et le chef d’équipe. Heures décimales arrondies.',
  },
  actors: {
    label: 'Intervenants', title: 'Intervenants par machine',
    caption: 'Le croisement par machine distingue opérateur, technicien maintenance, chef d’équipe et technicien qualité. Il cumule 1 121 minutes d’activité.',
    note: 'Minutes d’activité. Les tirets correspondent aux contributions absentes du graphique source.',
  },
  phases: {
    label: 'Phases', title: 'Intervenants par phase',
    caption: 'Le croisement par phase totalise 475 minutes de réglage et 188 minutes de contrôle. Ce classement est distinct du Pareto présenté ensuite.',
    note: 'Minutes d’activité. Le classement de cette figure diffère de celui du Pareto.',
  },
}

function hoursChart(kind: 'machines' | 'functions'): string {
  // These labels preserve the two-decimal values printed in image46 / image47.
  const rows = kind === 'machines' ? [
    { label: 'Noack', hours: 10.65 }, { label: 'Neri', hours: 3.10 },
    { label: 'PC', hours: 1.97 }, { label: 'Christ', hours: 1.37 },
    { label: 'Étiqueteuse', hours: 1.28 },
    { label: 'Rangement', detail: 'hors machine', hours: .20 },
    { label: 'ADC', detail: 'hors machine', hours: .12 },
  ] : [
    { label: 'Production', detail: 'Opérateurs et chef d’équipe', hours: 16.02 },
    { label: 'Maintenance', detail: 'Technicien maintenance', hours: 2.17 },
    { label: 'Qualité', detail: 'Technicien qualité', hours: .50 },
  ]
  const maximum = kind === 'machines' ? 12 : 18
  return `<figure class="smed-analysis-hours smed-analysis-hours--${kind}" aria-labelledby="smed-analysis-unit-${kind}">
    <figcaption id="smed-analysis-unit-${kind}">Somme des temps d’activité <span>Heures décimales</span></figcaption>
    <div class="smed-analysis-hour-rows">${rows.map(row => `<div class="smed-analysis-hour-row" data-analysis-category="${row.label}" data-analysis-hours="${row.hours}">
      <div class="smed-analysis-category"><strong>${row.label}</strong>${row.detail ? `<small>${row.detail}</small>` : ''}</div>
      <div class="smed-analysis-bar-track" aria-hidden="true"><i style="width:${row.hours / maximum * 100}%"></i></div>
      <p class="smed-analysis-hour-value">${decimal(row.hours)} <span>h</span></p>
    </div>`).join('')}</div>
    <div class="smed-analysis-hour-axis" aria-hidden="true"><span></span><div>${Array.from({ length: 7 }, (_, index) => `<span>${maximum * index / 6}</span>`).join('')}</div><span></span></div>
  </figure>`
}

function breakdownChart(kind: 'actors' | 'phases'): string {
  const rows = kind === 'actors' ? machineBreakdown : phaseBreakdown
  const maximum = kind === 'actors' ? 700 : 500
  return `<figure class="smed-analysis-breakdown" aria-labelledby="smed-analysis-unit-${kind}">
    <figcaption id="smed-analysis-unit-${kind}">Répartition des temps d’activité <span>Minutes</span></figcaption>
    <div class="smed-analysis-mobile-aid"><ul aria-label="Couleurs des intervenants">${actors.map((actor, index) => `<li><i class="smed-analysis-actor-${index}" aria-hidden="true"></i>${actor}</li>`).join('')}</ul><p>Glisser horizontalement pour lire les intervenants et les valeurs.</p></div>
    <div class="smed-analysis-table-scroll" tabindex="0" aria-label="Tableau des temps par ${kind === 'actors' ? 'machine' : 'phase'}, défilement horizontal disponible sur petit écran">
      <table class="smed-analysis-table" data-analysis-table="${kind}">
        <caption class="deck-live">Temps en minutes, par ${kind === 'actors' ? 'machine' : 'phase'} et intervenant. Graphique empilé et valeurs détaillées.</caption>
        <colgroup><col class="smed-analysis-col-category"><col class="smed-analysis-col-bar">${actors.map(() => '<col class="smed-analysis-col-value">').join('')}<col class="smed-analysis-col-total"></colgroup>
        <thead><tr><th scope="col">${kind === 'actors' ? 'Machine / activité' : 'Phase'}</th><th scope="col"><span class="smed-analysis-scale">0 <span>${maximum} min</span></span></th>${actors.map((actor, index) => `<th scope="col" class="smed-analysis-actor-${index}"><i aria-hidden="true"></i>${actor}</th>`).join('')}<th scope="col">Total</th></tr></thead>
        <tbody>${rows.map(row => `<tr data-analysis-category="${row.name}">
          <th scope="row">${row.name}${row.outside ? '<small>hors machine</small>' : ''}</th>
          <td class="smed-analysis-stack-cell"><div class="smed-analysis-stack" aria-hidden="true">${row.values.map((value, index) => `<i class="smed-analysis-actor-${index}" style="width:${value / maximum * 100}%"></i>`).join('')}</div></td>
          ${row.values.map(value => `<td data-analysis-minutes="${value}"${value === 0 ? ' class="smed-analysis-zero" aria-label="Aucune contribution représentée"' : ''}>${value || '—'}</td>`).join('')}
          <td class="smed-analysis-row-total" data-analysis-total="${sum(row.values)}">${sum(row.values)}</td>
        </tr>`).join('')}</tbody>
        <tfoot><tr><th scope="row">Cumul</th><td></td>${actorTotals.map(value => `<td>${value}</td>`).join('')}<td>${total.toLocaleString('fr-FR')}</td></tr></tfoot>
      </table>
    </div>
  </figure>`
}

/** Native HTML evidence views; keyboard/slide routing stays in smedChallenge. */
export function mountSmedAnalysis(stage: HTMLElement) {
  const panel = document.createElement('section')
  panel.id = 'smed-analysis-panel'
  panel.className = 'smed-analysis-panel'
  panel.hidden = true
  panel.inert = true
  panel.setAttribute('role', 'region')
  panel.setAttribute('aria-labelledby', 'smed-analysis-title')
  panel.innerHTML = `
    <header class="smed-analysis-heading"><div><p class="kicker">Analyse des temps</p><h2 id="smed-analysis-title"></h2></div><button type="button" data-smed-analysis-close aria-label="Revenir à la ligne de conditionnement">×</button></header>
    <div class="smed-analysis-body">${smedAnalysisIds.map(id => `<div class="smed-analysis-view" data-smed-analysis-view="${id}" hidden>${id === 'machines' || id === 'functions' ? hoursChart(id) : breakdownChart(id)}<p class="smed-analysis-note">${views[id].note}</p></div>`).join('')}</div>
    <footer class="smed-analysis-footer"><p class="smed-analysis-scope"><strong>${total.toLocaleString('fr-FR')} min cumulées d’activité</strong><span>Ce cumul ne mesure pas à lui seul la durée d’arrêt.</span></p><div class="smed-analysis-navigation"><p>Soutenance VIATRIS, slide 20</p><nav aria-label="Graphiques de l’analyse des temps">${smedAnalysisIds.map(id => `<button type="button" data-smed-analysis="${id}">${views[id].label}</button>`).join('')}</nav><div class="smed-analysis-arrows"><button type="button" data-smed-analysis-prev aria-label="Étape précédente">←</button><span data-smed-analysis-count></span><button type="button" data-smed-analysis-next aria-label="Étape suivante">→</button></div></div></footer>`
  stage.append(panel)

  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.className = 'smed-detail-trigger smed-analysis-trigger'
  trigger.dataset.smedAnalysis = 'machines'
  trigger.setAttribute('aria-controls', panel.id)
  trigger.setAttribute('aria-expanded', 'false')
  trigger.innerHTML = 'Analyse des temps <span aria-hidden="true">↗</span>'
  stage.querySelector('.smed-challenge-footer')?.append(trigger)
  const close = panel.querySelector<HTMLButtonElement>('[data-smed-analysis-close]')!
  const heading = panel.querySelector<HTMLElement>('#smed-analysis-title')!
  const counter = panel.querySelector<HTMLElement>('[data-smed-analysis-count]')!
  const content = Array.from(panel.querySelectorAll<HTMLElement>('[data-smed-analysis-view]'))
  const tabs = Array.from(panel.querySelectorAll<HTMLButtonElement>('[data-smed-analysis]'))
  const base = Array.from(stage.querySelectorAll<HTMLElement>(':scope > .smed-challenge-intro, :scope > .smed-challenge-evidence, :scope > .smed-challenge-footer'))
  const initialBase = base.map(element => ({ element, inert: element.inert, ariaHidden: element.getAttribute('aria-hidden') }))
  const show = (id: SmedAnalysisId | null) => {
    panel.hidden = id === null
    panel.inert = id === null
    stage.classList.toggle('has-smed-analysis', id !== null)
    trigger.setAttribute('aria-expanded', String(id !== null))
    if (id) {
      panel.dataset.smedAnalysis = id
      heading.textContent = views[id].title
      counter.textContent = `${String(smedAnalysisIds.indexOf(id) + 1).padStart(2, '0')} / 04`
    } else delete panel.dataset.smedAnalysis
    content.forEach(view => {
      view.hidden = view.dataset.smedAnalysisView !== id
      view.inert = view.hidden
    })
    tabs.forEach(tab => {
      if (tab.dataset.smedAnalysis === id) tab.setAttribute('aria-current', 'step')
      else tab.removeAttribute('aria-current')
    })
    initialBase.forEach(({ element, inert, ariaHidden }) => {
      element.inert = id !== null || inert
      if (id !== null) element.setAttribute('aria-hidden', 'true')
      else if (ariaHidden === null) element.removeAttribute('aria-hidden')
      else element.setAttribute('aria-hidden', ariaHidden)
    })
  }
  return {
    panel, close, trigger, show,
    caption: (id: SmedAnalysisId) => views[id].caption,
    dispose: () => { show(null); panel.remove(); trigger.remove() },
  }
}
