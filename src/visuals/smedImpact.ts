import { mountSmedEvidenceWorkspace, type EvidenceGroup } from './smedEvidenceWorkspace'

const groups: EvidenceGroup[] = [
  { id: 'test', start: 0, end: 0, label: 'Résultat du test' },
  { id: 'cible', start: 1, end: 1, label: 'Comparaison à la cible' },
  { id: 'ecart', start: 2, end: 2, label: 'Écart à la cible' },
  { id: 'suivi', start: 3, end: 3, label: 'Suivi des changements' },
]

// Slide 33 records minutes. Slide 13 sets the target, not a before baseline.
const testMinutes = 655
const targetMinutes = 720
const marginMinutes = targetMinutes - testMinutes
const testShare = 100 * testMinutes / targetMinutes

function scene(step: number, title: string, label: string, body: string, source: string, caption: string): string {
  return `<article class="ss-scene si-scene" data-smed-scene="${step}" data-smed-caption="${caption}" ${step ? 'hidden' : ''}>
    <header class="ss-document-heading"><div><p>${label}</p><h3>${title}</h3></div><span class="ss-document-mark" aria-hidden="true">VIATRIS</span></header>
    <div class="ss-document-body">${body}</div>
    <footer class="ss-document-footer"><span>${source}</span><span>${caption}</span></footer>
  </article>`
}

/** Viewports expose source pixels unchanged, retaining the source aspect ratio. */
function sourceView(file: string, width: number, height: number, view: string, alt: string): string {
  const [x, y, cropWidth, cropHeight] = view.split(' ').map(Number)
  const clipId = `si-crop-${file.replace(/\W/g, '-')}`
  return `<svg viewBox="${view}" role="img" aria-label="${alt}" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${cropWidth}" height="${cropHeight}" /></clipPath></defs><image href="./media/smed/${file}" width="${width}" height="${height}" clip-path="url(#${clipId})" /></svg>`
}

function comparison(showMargin: boolean): string {
  return `<figure class="si-comparison${showMargin ? ' si-comparison--margin' : ''}" aria-label="Test : 655 minutes. Cible : 720 minutes. Échelle de zéro à douze heures.${showMargin ? ' Écart calculé : 65 minutes sous la cible.' : ''}">
    <figcaption>Durée du changement de format <span>Échelle commune en heures</span></figcaption>
    <div class="si-plot" style="--si-test-share:${testShare}%">
      <div class="si-bar-row"><span>Test</span><div class="si-bar-track"><i class="si-test-bar"></i>${showMargin ? `<span class="si-gap"><b>${marginMinutes} min</b></span>` : ''}</div><strong>10 h 55<small>${testMinutes} min</small></strong></div>
      <div class="si-bar-row si-bar-row--target"><span>Cible</span><div class="si-bar-track"><i></i></div><strong>12 h<small>${targetMinutes} min</small></strong></div>
      <div class="si-axis" aria-hidden="true"><span>0</span><span>3</span><span>6</span><span>9</span><span>12 h</span></div>
    </div>
  </figure>`
}

export function renderSmedImpact(): void {
  const section = document.querySelector<HTMLElement>('#smed-impact')
  if (!section) return
  const scenes = [
    scene(0, 'Le résultat du test présenté', 'Test terrain', `
      <div class="si-test-layout">
        <div class="si-result"><p class="si-eyebrow">Durée totale du CDF</p><p class="si-result-value">10<span>h</span>55</p><p class="si-result-minutes">${testMinutes} minutes</p></div>
        <figure class="si-test-proof"><figcaption>Le relevé du test</figcaption>${sourceView('test-result-source.png', 1419, 34, '1200 0 219 34', 'Cellule originale Temps total CDF : 655 minutes, 10,92 heures')}<p>10,92 h est l’arrondi décimal<br>de 10 h 55.</p></figure>
        <p class="si-scope">Un test présenté dans la soutenance, sans série de répétitions documentée.</p>
      </div>`, 'Slide 33 · détail du relevé', '655 min = 10 h 55'),
    scene(1, 'Le test se situe sous les 12 h', 'Comparaison à l’objectif', `
      <div class="si-comparison-layout">${comparison(false)}
        <p class="si-scope">Les 12 h représentent l’objectif à atteindre.</p>
      </div>`, 'Slides 13 et 33 · cible et test', '720 min de cible, 655 min mesurées'),
    scene(2, '65 minutes sous la cible', 'Écart calculé', `
      <div class="si-margin-layout"><div class="si-margin-summary"><p class="si-margin-value">1<span>h</span>05</p><div><p class="si-equation">720 − 655 = <strong>${marginMinutes} min</strong></p><p>Écart entre l’objectif et le test</p></div></div>
        ${comparison(true)}
        <p class="si-scope">Cet écart à la cible ne mesure pas une réduction par rapport à la situation initiale.</p>
      </div>`, 'Calcul à partir des slides 13 et 33', '1 h 05 sous la cible de 12 h'),
    scene(3, 'Le suivi des prochains changements', 'Fiches BOB et BOBINETTE', `
      <div class="si-followup-layout">
        <figure class="si-followup-proof"><figcaption>BOB</figcaption>${sourceView('followup-bob.png', 1525, 586, '518 63 1007 180', 'Extrait original BOB : objectifs préremplis, temps réel, équipes et explications vierges')}</figure>
        <figure class="si-followup-proof"><figcaption>BOBINETTE</figcaption>${sourceView('followup-bobinette.png', 1525, 588, '516 71 1009 176', 'Extrait original BOBINETTE : objectifs préremplis, temps réel, équipes et explications vierges')}</figure>
        <div class="si-followup-reading"><p>Relever le <strong>temps réel</strong></p><p>Comparer à <strong>l’objectif</strong></p><p><strong>Expliquer les écarts</strong><span>Si le réel dépasse l’objectif de plus de 10 min</span></p></div>
        <p class="si-scope">Formulaires vierges, objectifs préremplis. La tenue dans le temps reste à mesurer.</p>
      </div>`, 'Slide 34 · extraits des colonnes de suivi', 'Un dispositif de suivi, pas une série de résultats'),
  ]

  section.innerHTML = `<div class="slide-stage ss-stage">
    <header class="ss-heading"><p class="kicker">SMED · Résultat et suivi</p><h2 class="display" id="smed-impact-title">Un test à <em>10 h 55</em></h2></header>
    <div class="ss-workspace">
      <nav class="ss-rail" aria-label="Résultat et suivi">
        ${groups.map((group, index) => `<button type="button" class="ss-block" data-smed-goto="${group.start}" data-solution-group="${group.id}" aria-controls="smed-impact-document" aria-expanded="${index === 0}"><span class="ss-block-number">0${index + 1}</span><span class="ss-block-title">${group.label}</span></button>`).join('')}
      </nav>
      <section class="ss-window" id="smed-impact-document" aria-label="Preuve associée au résultat ou au suivi">${scenes.join('')}</section>
    </div>
    <footer class="ss-footer"><p>Soutenance VIATRIS, slides 13, 33–34.</p><span class="ss-active-label" data-solution-label>Résultat du test</span><div class="ss-navigation"><button type="button" data-smed-prev aria-label="Étape précédente">↑</button><span data-smed-count>01 / 04</span><button type="button" data-smed-next aria-label="Étape suivante">↓</button></div></footer>
  </div>`
}

export function mountSmedImpact(): () => void {
  return mountSmedEvidenceWorkspace('smed-impact', groups)
}
