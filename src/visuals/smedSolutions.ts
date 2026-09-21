type ScenarioRow = [string, string, string, string, string, string?, boolean?]
type InventoryRow = [string, string, string, string, string, string, string]
type SolutionGroup = 'scenario' | 'visserie' | 'formation' | 'decision'

const media = './media/smed/'
const groups: { id: SolutionGroup; start: number; end: number; label: string; short: string }[] = [
  { id: 'scenario', start: 0, end: 2, label: 'Nouveau scénario opératoire', short: 'Scénario' },
  { id: 'visserie', start: 3, end: 8, label: 'Organisation et identification de la visserie', short: 'Visserie' },
  { id: 'formation', start: 9, end: 10, label: 'Support de formation des opérateurs', short: 'Formation' },
  { id: 'decision', start: 11, end: 14, label: 'Logigramme Système prise de décision', short: 'Décision' },
]

// Source: slide 25. Keep row alignment, empty cells and operation numbers.
// Column 5 retains the third actor's operation; duration and masked-time flag
// are shown inside that cell instead of making two unreadably narrow columns.
const scenario: ScenarioRow[] = [
  ['1', 'Sortir les blisters vides pour le DDL, coller sur le DDL et faire un double contrôle par une autre personne', '1', 'Vidange magasin + fardeleuse', ''],
  ['2', 'Contrôler la quantité du dernier carton + dernière palette', '2', 'Vérifier la quantité du dernier carton', ''],
  ['3', 'Sauvegarde des programmes', '3', 'Retirer carte mémoire étiqueteuse (dernière caisse)', ''],
  ['4', 'Retrait coding, bande outil découpe et étoile', '4', 'Démontage pousseur, contre-pousseur, magasins', ''],
  ['5', 'Démontage moules + température rouleau scellage 90 °C + retrait bande PVC et alu', '', '', ''],
  ['6', 'Démontage guide post-formage + cylindre d’entraînement post-formage', '5', 'Faire dossier de lot + déchets + retours', ''],
  ['7', 'Démontage rouleau contre-scellage + déviation + avant découpe + guide séparation', '', '', ''],
  ['8', 'Démontage carter caméra + plexi + produit dépassant + BAB', '', '', ''],
  ['9', 'Démontage rail + rouleau de déviation avant rail + bloc moteur', '', '', ''],
  ['10', 'Démontage trémie + tamis + bac récup. + leur aspiration', '', '', ''],
  ['11', 'Ensachage et identification des chariots + sortie box', '', '', ''],
  ['12', 'Soufflage de la ligne complète + balayage sol', '', '', ''],
  ['13', 'Appel tech maintenance', '', '', 'Nettoyage rouleau de scellage (tech maintenance)', '5', true],
  ['14', 'Remise à 210°FC', '', '', ''],
  ['15', 'Nettoyage monte-matière', '6', 'Sauvegarde programmes PC + Christ et démontage élévateur pousseur', ''],
  ['16', 'Nettoyage final au Sanobact', '7', 'Aide nettoyage final au Sanobact', ''],
  ['17', 'Signer feuille 4 du DDL', '8', 'Signer feuille 4 du DDL', ''],
  ['18', 'Nettoyage et contrôle bloc moteur', '9', 'Nettoyage pièces secondaires', ''],
  ['19', 'Vide de ligne (opérateur)', '10', 'Préparation coding', 'Arrêt traitement Linemaster et chargement du nouveau programme Linemaster par CE', '10', true],
  ['20', 'Attente VDL (CE + qualité)', '11', 'Attente VDL', 'Vide de ligne (chef d’équipe + qualité)', '25'],
]

// Source: slide 26, all 30 inventory entries. Empty dimensions stay empty.
const inventory: InventoryRow[] = [
  ['1', 'NOACK', 'Monte-matière', '4', 'Vis vibreur (M6)', '6 × 20', 'LAVERIE'],
  ['2', 'NOACK', 'Monte-matière', '4', 'Vis carter mobile (M6)', '6 × 20', 'LIGNE'],
  ['3', 'NOACK', 'Monte-matière', '4', 'Vis carter fixe (M6)', '6 × 20', 'LIGNE'],
  ['4', 'NOACK', 'Monte-matière', '2', 'Axe inox', '', 'LIGNE'],
  ['5', 'NOACK', 'Trémie et distribution', '2', 'Écrous trappe de trémie', '23 × 11 × 10 (hauteur)', 'LAVERIE'],
  ['6', 'NOACK', 'Trémie et distribution', '2', 'Vis de fixation bac récupérateur tamis', '23 × 10 × 55 (hauteur)', 'LAVERIE'],
  ['7', 'NOACK', 'Trémie et distribution', '2', 'Vis trappe tamis', '30 × 16 × 7 × 16', 'LAVERIE'],
  ['8', 'NOACK', 'Trémie et distribution', '1', 'Grosse vis longue (M10) + rondelle', '10 × 30', 'LAVERIE'],
  ['9', 'NOACK', 'Trémie et distribution', '1', 'Grosse vis courte (M10) + rondelle', '10 × 20', 'LAVERIE'],
  ['10', 'NOACK', 'Trémie et distribution', '3', 'Vis carter bol vibrant (M6)', '6 × 10', 'LAVERIE'],
  ['11', 'NOACK', 'Trémie et distribution', '3', 'Insert lumière', '60 × 20', 'LAVERIE'],
  ['12', 'NOACK', 'Trémie et distribution', '3', 'Vis insert lumière (M5)', '5 × 16', 'LAVERIE'],
  ['13', 'NOACK', 'Trémie et distribution', '7', 'Vis descente dédiée (suivant descente)', '5 × 10', 'LAVERIE'],
  ['14', 'NOACK', 'Trémie et distribution', '2', 'Vis bas descente', '', 'LAVERIE'],
  ['15', 'NOACK', 'Trémie et distribution', '2', 'Tige filetée fixation BAB au moteur', '', 'LAVERIE'],
  ['16', 'NOACK', 'Trémie et distribution', '4', 'Vis cellule de remplissage', '4 × 20 × 2,5', 'LAVERIE'],
  ['17', 'NOACK', 'Trémie et distribution', '2', 'Vis fixation cellule', '', 'LAVERIE'],
  ['18', 'NOACK', 'Trémie et distribution', '8', 'Vis guide BAB', '', 'LAVERIE'],
  ['19', 'NOACK', 'Trémie et distribution', '4', 'Vis aspiration courte', '', 'LAVERIE'],
  ['20', 'NOACK', 'Trémie et distribution', '2', 'Vis aspiration longue', '', 'LAVERIE'],
  ['21', 'NOACK', 'Trémie et distribution', '2', 'Vis fixation peigne BAB', '', 'LAVERIE'],
  ['22', 'NOACK', 'Caméra', '2', 'Vis brosse produit dépassant', '30 × 16 × 7 × 16', 'LAVERIE'],
  ['23', 'NOACK', 'Caméra', '2', 'Écrou plaque après caméra', '20 × 10 × 7', 'LAVERIE'],
  ['24', 'NOACK', 'Caméra', '1', 'Grosse vis fixation produit dépassant', '20 × 155', 'LAVERIE'],
  ['25', 'NOACK', 'Caméra', '1', 'Grosse vis carter produit dépassant', '10 × 48', 'LAVERIE'],
  ['26', 'NOACK', 'Caméra', '2', 'Embout aspirateur', '35 × 130', 'LAVERIE'],
  ['27', 'PC4200', 'Magasin manuel / auto et convoyeur', '2', 'Vis longue magasin auto', '', 'LIGNE'],
  ['28', 'PC4200', 'Magasin manuel / auto et convoyeur', '4', 'Vis courte magasin manuel', '', 'LIGNE'],
  ['29', 'PC4200', 'Magasin manuel / auto et convoyeur', '10', 'Vis spatule (suivant machine ligne)', '', 'LIGNE'],
  ['30', 'CHRIST', 'Élévateur', '1', 'Vis de fixation de l’élévateur', '', 'LIGNE'],
]

const esc = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

function scene(step: number, title: string, label: string, body: string, source: string, caption: string): string {
  return `<article class="ss-scene" data-smed-scene="${step}" data-smed-caption="${esc(caption)}" ${step ? 'hidden' : ''}>
    <header class="ss-document-heading"><div><p>${esc(label)}</p><h3>${esc(title)}</h3></div><span class="ss-document-mark" aria-hidden="true">VIATRIS</span></header>
    <div class="ss-document-body">${body}</div>
    <footer class="ss-document-footer"><span>${esc(source)}</span><span>${esc(caption)}</span></footer>
  </article>`
}

function scenarioTable(rows: ScenarioRow[]): string {
  return `<div class="ss-table-scroll" data-lenis-prevent><table class="ss-table ss-scenario-table" aria-label="Extrait du nouveau scénario opératoire de la slide 25">
    <colgroup><col class="ss-col-number"><col class="ss-col-bob"><col class="ss-col-number"><col class="ss-col-bobinette"><col class="ss-col-support"></colgroup>
    <thead><tr><th colspan="2" scope="colgroup">BOB</th><th colspan="2" scope="colgroup">BOBINETTE</th><th scope="col">Chef d’équipe / tech maintenance</th></tr></thead>
    <tbody>${rows.map(([bob, action, bobinette, action2, support, duration, masked]) => `<tr class="${masked ? 'ss-row-masked' : ''}">
      <td class="ss-row-number">${esc(bob)}</td><td>${esc(action)}</td><td class="ss-row-number">${esc(bobinette)}</td><td>${esc(action2)}</td>
      <td>${esc(support)}${duration ? `<span class="ss-source-duration"><b>${duration} min</b>${masked ? 'Temps masqué' : ''}</span>` : ''}</td>
    </tr>`).join('')}</tbody></table></div>`
}

function inventoryTable(rows: InventoryRow[]): string {
  return `<div class="ss-table-scroll" data-lenis-prevent><table class="ss-table ss-inventory-table" aria-label="Inventaire de la visserie, slide 26">
    <colgroup><col style="width:4%"><col style="width:9%"><col style="width:17%"><col style="width:5%"><col style="width:31%"><col style="width:20%"><col style="width:14%"></colgroup>
    <thead><tr>${['N°', 'Machine', 'Zone', 'Qté', 'Intitulé', 'Dimensions', 'Laverie / ligne'].map(t => `<th scope="col">${t}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(row => `<tr>${row.map((value, i) => `<td${i === 0 || i === 3 ? ' class="ss-row-number"' : ''}>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`
}

function pair(cad: string, built: string, name: string): string {
  return `<div class="ss-evidence-pair"><figure><img src="${media}${cad}" alt="Modèle CAO, ${esc(name)}" decoding="async"><figcaption><b>Conçu</b> Modèle CAO</figcaption></figure><figure><img src="${media}${built}" alt="Photographie du ${esc(name)} fabriqué" decoding="async"><figcaption><b>Fabriqué</b> Photographie du support</figcaption></figure></div>`
}

/** An SVG viewport crops the unchanged source image without redrawing it. */
function sourceCrop(file: string, width: number, height: number, view: string, alt: string, className = ''): string {
  return `<figure class="ss-source-view ${className}"><svg viewBox="${view}" role="img" aria-label="${esc(alt)}" preserveAspectRatio="xMidYMid meet"><image href="${media}${file}" width="${width}" height="${height}" /></svg></figure>`
}

function decisionDetail(view: string, alt: string, first: string, second: string): string {
  return `<div class="ss-flow-detail">${sourceCrop('decision-source.svg', 8109.6035203245765, 4561.651980182574, view, alt)}<div class="ss-reading-strip" aria-label="Repères de lecture"><p>${esc(first)}</p><p>${esc(second)}</p></div></div>`
}

export function renderSmedSolutions(): void {
  const section = document.querySelector<HTMLElement>('#smed-solutions')
  if (!section) return
  section.dataset.smedSteps = '15'
  section.dataset.smedStep = '0'
  section.dataset.smedGroup = 'scenario'
  section.setAttribute('aria-labelledby', 'smed-solutions-title')

  const scenes = [
    scene(0, 'Le nouvel enchaînement opératoire', 'Scénario · 1 / 3', scenarioTable(scenario.slice(0, 7)), 'Slide 25 · BOB 1–7', 'Fin de production et premiers démontages'),
    scene(1, 'Démontage et relais maintenance', 'Scénario · 2 / 3', scenarioTable(scenario.slice(7, 14)), 'Slide 25 · BOB 8–14', 'Nettoyage du rouleau : 5 min en temps masqué'),
    scene(2, 'Nettoyage, préparation et vide de ligne', 'Scénario · 3 / 3', scenarioTable(scenario.slice(14)), 'Slide 25 · BOB 15–20', 'Linemaster : 10 min en temps masqué · vide de ligne : 25 min'),
    scene(3, 'Inventaire de la visserie', 'Inventaire · 1 / 3', inventoryTable(inventory.slice(0, 10)), 'Slide 26 · entrées 1–10', 'Monte-matière, trémie et distribution'),
    scene(4, 'Inventaire de la visserie', 'Inventaire · 2 / 3', inventoryTable(inventory.slice(10, 20)), 'Slide 26 · entrées 11–20', 'Trémie et distribution'),
    scene(5, 'Inventaire de la visserie', 'Inventaire · 3 / 3', inventoryTable(inventory.slice(20)), 'Slide 26 · entrées 21–30', 'Caméra, PC et Christ'),
    scene(6, 'Support de visserie commune', 'Supports · 1 / 3', pair('support-common-cad.png', 'support-common-built.png', 'support de visserie commune'), 'Slide 27 · images 49–50', 'Les familles de pièces organisent les compartiments'),
    scene(7, 'Support de visserie de la boîte à brosses', 'Supports · 2 / 3', pair('support-brush-cad.png', 'support-brush-built.png', 'support de visserie de la boîte à brosses'), 'Slide 27 · images 51–52', 'Modèle et fabrication du support dédié'),
    scene(8, 'Support de visserie de descente', 'Supports · 3 / 3', pair('support-descent-cad.png', 'support-descent-built.png', 'support de visserie de descente'), 'Slide 27 · images 53–54', 'Modèle et fabrication du support dédié'),
    scene(9, 'Fiche de standard NA014', 'Formation · 1 / 2', `<figure class="ss-whole-document"><img src="${media}standard-na014.png" alt="Fiche de standard NA014, montage bobine aluminium sur NOACK, extrait original" decoding="async"></figure>`, 'Slide 29 · image 56', 'Montage de la bobine aluminium sur NOACK'),
    scene(10, 'Les photographies et les points de contrôle', 'Formation · 2 / 2', sourceCrop('standard-na014.png', 733, 583, '0 204 733 379', 'Détail original de la fiche NA014 : contrôle qualité de la bobine et montage, mandrin et vis de blocage'), 'Slide 29 · détail de la fiche NA014', 'État de la bobine, serrage du mandrin, vis de blocage'),
    scene(11, 'Système de prise de décision', 'Logigramme · vue d’ensemble', sourceCrop('decision-source.svg', 8109.6035203245765, 4561.651980182574, '160 1780 7870 1950', 'Logigramme original complet de prise de décision pendant le changement de format', 'ss-flow-overview'), 'Slide 30 · image 57', 'Le parcours se poursuit par trois détails du document'),
    scene(12, 'Nature du blocage et premiers contrôles', 'Logigramme · détail 1 / 3', decisionDetail('200 1960 2900 1120', 'Partie gauche du logigramme original : qualité, maintenance et checklist de 10 minutes', 'Qualité : service qualité + chef d’équipe', 'Maintenance : check-list · 10 min max'), 'Slide 30 · détail gauche', 'Qualité ou maintenance, puis prise en charge adaptée'),
    scene(13, 'Le relais vers la maintenance', 'Logigramme · détail 2 / 3', decisionDetail('2850 1960 2900 1120', 'Partie centrale du logigramme original : chef d’équipe disponible, analyse 20 minutes et relais maintenance', 'Chef disponible : analyse · 20 min max', 'Sinon, ou non résolu : maintenance'), 'Slide 30 · détail central', 'Chef d’équipe disponible : analyse 20 min maximum'),
    scene(14, 'Les seuils d’escalade', 'Logigramme · détail 3 / 3', decisionDetail('5240 1960 2800 1120', 'Partie droite du logigramme original : seuil 3 heures, responsables et cellule de crise au-delà de 8 heures', 'À 3 h sans diagnostic et solution identifiés : escalade', 'Blocage total > 8 h : cellule de crise'), 'Slide 30 · détail droit', 'Seuils d’escalade vers les responsables puis la cellule de crise'),
  ]

  section.innerHTML = `<div class="slide-stage ss-stage">
    <header class="ss-heading"><p class="kicker">SMED · Amélioration</p><h2 class="display" id="smed-solutions-title">Mise en œuvre des <em>solutions d’amélioration</em></h2></header>
    <div class="ss-workspace">
      <nav class="ss-rail" aria-label="Solutions d’amélioration">
        ${groups.map((g, index) => `<button type="button" class="ss-block" data-smed-goto="${g.start}" data-solution-group="${g.id}" aria-controls="smed-solutions-document" aria-expanded="${index === 0}"><span class="ss-block-number">0${index + 1}</span><span class="ss-block-title">${g.label}</span><span class="ss-block-progress" data-solution-progress="${g.id}"></span></button>`).join('')}
      </nav>
      <section class="ss-window" id="smed-solutions-document" aria-label="Document de la solution active">${scenes.join('')}</section>
    </div>
    <footer class="ss-footer"><p>Soutenance VIATRIS, slides 25–30.</p><span class="ss-active-label" data-solution-label>Nouveau scénario opératoire</span><div class="ss-navigation"><button type="button" data-smed-prev aria-label="Document précédent">↑</button><span data-smed-count>01 / 15</span><button type="button" data-smed-next aria-label="Document suivant">↓</button></div></footer>
  </div>`
}

/** Supplement the shared story controller with group-level focus and motion. */
export function mountSmedSolutions(): () => void {
  const section = document.querySelector<HTMLElement>('#smed-solutions')
  if (!section) return () => {}
  const windowElement = section.querySelector<HTMLElement>('.ss-window')
  const blocks = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-solution-group]'))
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const params = new URLSearchParams(window.location.search)
  const preview = params.has('capture') || params.has('print') || params.get('motion') === 'off'
  let previousGroup = ''
  let previousStep = -1
  let entrance: Animation | undefined
  let printing = false
  let activationFrame = 0
  let activationPending = false

  const stopMotion = () => {
    entrance?.cancel()
    delete section.dataset.smedSweep
  }
  const sync = (activate = false) => {
    const raw = Number(section.dataset.smedStep)
    const step = Number.isInteger(raw) ? Math.max(0, Math.min(14, raw)) : 0
    const group = groups.find(g => step >= g.start && step <= g.end) ?? groups[0]
    section.dataset.smedGroup = group.id
    const label = section.querySelector<HTMLElement>('[data-solution-label]')
    if (label) label.textContent = group.label
    blocks.forEach(block => {
      const active = block.dataset.solutionGroup === group.id
      block.setAttribute('aria-expanded', String(active))
      block.classList.toggle('is-current-solution', active)
      if (active) block.setAttribute('aria-current', 'step')
      else block.removeAttribute('aria-current')
      const progress = block.querySelector<HTMLElement>('[data-solution-progress]')
      if (progress) progress.textContent = active ? `${step - group.start + 1} / ${group.end - group.start + 1}` : ''
    })
    const changed = previousStep !== step
    const changedGroup = previousGroup !== group.id
    const active = blocks.find(block => block.dataset.solutionGroup === group.id)
    if (changed || activate) entrance?.cancel()
    if ((activate || (changed && previousStep >= 0 && !activationPending)) && windowElement && active && !motion.matches && !preview && !printing && section.classList.contains('is-active')) {
      const panelRect = windowElement.getBoundingClientRect()
      const blockRect = active.getBoundingClientRect()
      const origin = Math.max(0, Math.min(100, 100 * (blockRect.top + blockRect.height / 2 - panelRect.top) / panelRect.height))
      const emergenceX = blockRect.right - panelRect.left
      windowElement.style.transformOrigin = `0 ${origin}%`
      entrance = windowElement.animate(changedGroup || activate ? [
        { opacity: 0, transform: `translateX(${emergenceX}px) scale(.16, .22)`, filter: 'blur(2px)' },
        { opacity: .9, transform: 'translateX(-8px) scale(.82, .92)', filter: 'blur(0px)', offset: .5 },
        { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' },
      ] : [
        { opacity: .55, transform: `translateX(${step > previousStep ? 14 : -14}px)` },
        { opacity: 1, transform: 'translateX(0)' },
      ], { duration: changedGroup || activate ? 650 : 340, easing: 'cubic-bezier(.2,.8,.2,1)' })
      // Use the existing slide 15 lettering/border sweep, including its cadence.
      // It continues through documents of the same block, like the reference.
      section.dataset.smedSweep = 'on'
    }
    previousStep = step
    previousGroup = group.id
  }
  const observer = new MutationObserver(() => sync())
  observer.observe(section, { attributes: true, attributeFilter: ['data-smed-step'] })
  const cancelActivation = () => {
    cancelAnimationFrame(activationFrame)
    activationPending = false
  }
  // The deck may briefly anticipate its target before scroll catches up.
  // Wait until that target settles: a single entrance survives those boundary
  // events, and the shared controller remains the only owner of the state.
  const onActive = (event: Event) => {
    const detail = (event as CustomEvent<{ id: string }>).detail
    cancelActivation()
    stopMotion()
    if (detail.id !== section.id || motion.matches || preview || printing) return
    activationPending = true
    const enterWhenSettled = () => {
      if (!section.classList.contains('is-active')) { cancelActivation(); return }
      if (window.matchMedia('(min-aspect-ratio: 4 / 5)').matches && Math.abs(section.getBoundingClientRect().top) >= 3) {
        activationFrame = requestAnimationFrame(enterWhenSettled)
        return
      }
      activationPending = false
      sync(true)
    }
    activationFrame = requestAnimationFrame(enterWhenSettled)
  }
  const resumeSweep = () => {
    if (!motion.matches && !preview && !printing && section.classList.contains('is-active')) section.dataset.smedSweep = 'on'
  }
  const onMotionChange = () => { cancelActivation(); stopMotion(); resumeSweep() }
  const onBeforePrint = () => { printing = true; cancelActivation(); stopMotion() }
  const onAfterPrint = () => { printing = false; resumeSweep() }
  window.addEventListener('deck:slide-active', onActive)
  window.addEventListener('beforeprint', onBeforePrint)
  window.addEventListener('afterprint', onAfterPrint)
  motion.addEventListener('change', onMotionChange)
  sync()
  return () => {
    observer.disconnect()
    cancelActivation()
    stopMotion()
    window.removeEventListener('deck:slide-active', onActive)
    window.removeEventListener('beforeprint', onBeforePrint)
    window.removeEventListener('afterprint', onAfterPrint)
    motion.removeEventListener('change', onMotionChange)
  }
}
