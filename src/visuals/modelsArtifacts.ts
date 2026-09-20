/** Read-only project artefacts. The original slide remains underneath this layer. */
type Plate = { title: string; content: string; source: string }
const legend = (items: string[]) => `<ol class="ma-legend">${items.map((label, i) => `<li><b>${i + 1}</b><span>${label}</span></li>`).join('')}</ol>`
const cad = (src: string, alt: string, items: string[], note: string, principalCut = false) => `
  <div class="ma-cad"><figure>${principalCut
    ? `<svg viewBox="0 0 1380 384" role="img" aria-label="${alt}"><svg width="1380" height="384" overflow="hidden"><image href="${src}" width="1380" height="662"/></svg></svg>`
    : `<img src="${src}" alt="${alt}"/>`}<figcaption>${note}</figcaption></figure>
  <aside><p class="ma-label">Repères de cette planche</p>${legend(items)}</aside></div>`

export const modelsArtefacts: Partial<Record<number, Plate[]>> = {
  0: [
    { title: 'J1 · embase et sortie tournante', source: 'Atlas CAO du projet · planche J1', content: cad('./media/models/j1.png', 'Noyau J1, vue extérieure et coupe numérotée de 1 à 9', [
      'Embase fixe A', 'Cartouche fixe S', 'Roulement principal', 'Stator du moteur couple', 'Rotor du moteur couple', 'Bague de codeur', 'Tête de lecture', 'Mât fixe U', 'Cloche tournante T',
    ], 'La cloche T porte la colonne. L’embase A, la cartouche S et le mât U restent fixes.') },
    { title: 'J2 / J3 · entraînements à l’épaule', source: 'Atlas CAO du projet · planche des transmissions J2 / J3', content: cad('./media/j2-j3-transmission.png', 'Entraînements J2 et J3 en coupes annotées, repères 1 à 14', [
      'Pignon d’entrée J2', 'Couvercle du pod J2', 'Cartouche du pignon J2', 'Berceau moteur J2', 'Réducteur RV-200C', 'Porteur J3 côté J2', 'Guidage gauche J3', 'Demi-arbre gauche H', 'Distributeur de couple O', 'Porteur côté J3', 'Réducteur RV-100C', 'Pignon d’entrée J3', 'Demi-arbre droit H', 'Guidage droit J3',
    ], 'Coupes principales : la sortie J2 entraîne le bras ; la sortie J3 rejoint les deux bielles.', true) },
    { title: 'J3 · guidage du coude', source: 'Atlas CAO du projet · planche du coude C–D', content: cad('./media/models/elbow.png', 'Coude C–D en coupe avec repères 1 à 8', [
      'Support droit L', 'Support gauche L', 'Culbuteur droit I', 'Culbuteur gauche I', 'Axe fixe K', 'Roulement croisé', 'Avant-bras D', 'Cartouche de roulement J',
    ], 'Les culbuteurs reçoivent les bielles ; le roulement central assure le guidage C–D.') },
    { title: 'J3 · bielle droite réglable', source: 'Atlas CAO du projet · planche de la bielle droite', content: cad('./media/models/pushrod.png', 'Bielle droite, vue extérieure et coupe annotée de 1 à 6', [
      'Rotule avant droite', 'Tige côté coude', 'Écrou de blocage', 'Corps de réglage', 'Tige côté épaule', 'Rotule arrière droite',
    ], 'Deux branches relient les manivelles d’épaule aux culbuteurs du coude.') },
    { title: 'J4 · poignet et interface outil', source: 'Atlas CAO du projet · planche J4', content: cad('./media/models/j4.png', 'Poignet J4 en vue extérieure et coupe numérotée de 1 à 5', [
      'Carter de poignet F', 'Réducteur et guidage J4', 'Moyeu de sortie P', 'Bride d’interface Q', 'Plaque du préhenseur G',
    ], 'Le réducteur entraîne P, puis Q et G. Les ventouses ne sont pas détaillées sur cette planche.') },
  ],
  2: [{ title: 'Chaîne cinématique de Robot 2', source: 'URDF · structure et repères', content: `
    <div class="ma-placeholder" aria-label="Emplacement réservé au croquis manuel de la chaîne cinématique">
      <span class="ma-placeholder__mark" aria-hidden="true">✎</span>
      <h4>Ton croquis de la chaîne cinématique</h4>
      <p>Emplacement réservé</p>
      <small>Corps rigides · articulations J1–J4 · repères locaux</small>
    </div>` }],
  3: [{ title: 'Le groupe de planification', source: 'robot2.srdf · extrait exact du groupe palletizer', content: `
    <div class="ma-semantics">
      <p class="ma-label">Groupe déclaré dans notre fichier</p>
      <pre class="ma-code"><code>&lt;group name="<em>palletizer</em>"&gt;
  &lt;chain base_link="<em>base_link</em>"
         tip_link="<em>tool0</em>"/&gt;
&lt;/group&gt;</code></pre>
      <div class="ma-group"><div class="ma-group__caption"><b>palletizer</b><span>de base_link à tool0</span></div>
      <div class="ma-joints" aria-label="Quatre axes dans le groupe de planification"><b>J1</b><i></i><b>J2</b><i></i><b>J3</b><i></i><b>J4</b></div></div>
      <p class="ma-takeaway">MoveIt considère les quatre axes ensemble pour préparer et vérifier le mouvement.</p>
      <p class="ma-detail">La géométrie et les limites articulaires restent dans l’URDF.</p>
    </div>` }],
  4: [{ title: 'Le monde de la cellule', source: 'Capture Gazebo du projet · vue de développement, robot présent', content: `
    <figure class="ma-world"><div class="ma-world__image"><img src="./media/models/world.png" alt="Capture Gazebo de la cellule avec poste de prise à droite, palette à gauche et robot au centre"/>
      <span class="ma-world__pin ma-world__pin--pick">1</span><span class="ma-world__pin ma-world__pin--pallet">2</span></div>
      <figcaption>${legend(['Poste de prise et carton', 'Palette de dépose'])}</figcaption>
    </figure><p class="ma-detail">Le robot est chargé dans ce monde par le lancement de simulation.</p>` }],
  5: [{ title: 'Les corps du mécanisme fermé', source: 'robot2_constrained_dynamics.json · extrait de topology', content: `
    <div class="ma-semantics">
      <p class="ma-label">Corps conservés explicitement</p>
      <pre class="ma-code"><code>"explicit_closed_chain_bodies": [
  "<em>crank</em>", "<em>rod_l</em>", "<em>rod_r</em>"
]</code></pre>
      <svg class="ma-loop" viewBox="0 0 760 180" role="img" aria-label="Le crank rejoint l’avant-bras par deux branches, bielle gauche rod_l et bielle droite rod_r">
        <path d="M146 90H195V42H250 M195 90V138H250 M486 42H550V90H604 M486 138H550V90"/>
        <rect x="8" y="59" width="138" height="62"/><rect x="250" y="11" width="236" height="62"/><rect x="250" y="107" width="236" height="62"/><rect x="604" y="59" width="148" height="62"/>
        <text x="77" y="96">crank</text><text x="368" y="35">rod_l</text><text class="ma-loop__sub" x="368" y="58">bielle gauche</text><text x="368" y="131">rod_r</text><text class="ma-loop__sub" x="368" y="154">bielle droite</text><text x="678" y="86">forearm</text><text class="ma-loop__sub" x="678" y="108">avant-bras</text>
      </svg>
      <p class="ma-takeaway">Deux contraintes de fermeture relient le crank à l’avant-bras, une par bielle.</p>
      <p class="ma-detail">Le solveur utilise ces corps et leurs propriétés de masse pour calculer la dynamique généralisée.</p>
    </div>` }],
}

/** A non-modal foreground panel: the active block and deck controls stay available. */
export function createModelsArtefacts(stage: HTMLElement, select: (step: number) => void) {
  const map = stage.querySelector<HTMLElement>('.models-map')!
  const panel = document.createElement('section')
  panel.className = 'models-artifact'
  panel.setAttribute('role', 'region')
  panel.hidden = true
  map.append(panel)
  let activeStep = -1
  let plate = 0
  let opened = false
  let transition: Animation | undefined
  const triggers = Array.from(stage.querySelectorAll<HTMLElement>('[data-models-block]')).filter(el => modelsArtefacts[Number(el.dataset.modelsBlock)])
  const buttonFor = (block: HTMLElement) => block.querySelector<HTMLElement>('.models-format') ?? block
  triggers.forEach(block => {
    const button = buttonFor(block)
    button.setAttribute('role', 'button')
    button.tabIndex = 0
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-label', `Ouvrir les artefacts : ${button.querySelector('h3')?.textContent}`)
  })
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('is-motion-off')
  const syncClones = () => document.querySelectorAll<HTMLElement>('.pipeline-camera .models-stage').forEach(view => {
    view.classList.toggle('has-models-artifact', opened)
    view.querySelector('.models-artifact')?.replaceWith(panel.cloneNode(true))
    view.querySelectorAll<HTMLElement>('[data-models-block]').forEach(block => block.classList.toggle('is-artifact-source', opened && Number(block.dataset.modelsBlock) === activeStep))
  })
  const position = () => {
    if (!opened) return
    for (const view of [stage, ...document.querySelectorAll<HTMLElement>('.pipeline-camera .models-stage')]) {
      const block = view.querySelector<HTMLElement>(`[data-models-block="${activeStep}"]`)
      const viewMap = view.querySelector<HTMLElement>('.models-map')
      const viewPanel = view.querySelector<HTMLElement>('.models-artifact')
      if (!block || !viewMap || !viewPanel) continue
      const target = buttonFor(block).getBoundingClientRect(), bounds = viewMap.getBoundingClientRect()
      const scale = bounds.width / viewMap.offsetWidth || 1
      viewPanel.style.setProperty('--ma-left', `${(target.right - bounds.left) / scale + 24}px`)
      viewPanel.style.transformOrigin = `left ${(target.top + target.height / 2 - bounds.top) / scale}px`
    }
  }
  const paint = (animate = true) => {
    const entry = modelsArtefacts[activeStep]?.[plate]
    panel.hidden = !opened || !entry
    stage.classList.toggle('has-models-artifact', opened && !!entry)
    stage.querySelectorAll('[data-models-block]').forEach(block => block.classList.toggle('is-artifact-source', opened && Number((block as HTMLElement).dataset.modelsBlock) === activeStep))
    triggers.forEach(block => buttonFor(block).setAttribute('aria-expanded', String(opened && Number(block.dataset.modelsBlock) === activeStep)))
    transition?.cancel()
    if (!opened || !entry) { syncClones(); return }
    const pages = modelsArtefacts[activeStep]!
    panel.dataset.artifactStep = String(activeStep)
    panel.dataset.artifactPage = String(plate)
    panel.setAttribute('aria-label', entry.title)
    panel.innerHTML = `<header class="ma-heading"><div><p class="ma-label">${activeStep === 0 ? 'CAO · systèmes mécaniques' : ['','','URDF','SRDF','SDF','JSON'][activeStep]}</p><h3>${entry.title}</h3></div><button type="button" data-ma-close aria-label="Fermer la fenêtre d’artefacts">×</button></header>
      <div class="ma-content">${entry.content}</div>
      <footer class="ma-footer"><small>${entry.source}</small><div>${pages.length > 1 ? `<button type="button" data-ma-page="-1" aria-label="Planche précédente" ${plate === 0 ? 'disabled' : ''}>←</button><span>${plate + 1} / ${pages.length}</span><button type="button" data-ma-page="1" aria-label="Planche suivante" ${plate === pages.length - 1 ? 'disabled' : ''}>→</button>` : ''}<button type="button" data-ma-next>Bloc suivant →</button></div></footer>`
    position()
    syncClones()
    if (animate && !reduced()) transition = panel.animate([{opacity:0, transform:'translateX(-12px) scale(.98)'},{opacity:1,transform:'none'}],{duration:300,easing:'cubic-bezier(.2,.7,.2,1)'})
  }
  const show = (step: number, automatic: boolean, backwards = false) => {
    activeStep = step
    plate = backwards ? (modelsArtefacts[step]?.length ?? 1) - 1 : 0
    opened = automatic && !!modelsArtefacts[step]
    paint()
  }
  const close = (focus = false) => {
    opened = false
    paint(false)
    if (focus) {
      const block = triggers.find(el => Number(el.dataset.modelsBlock) === activeStep)
      if (block) buttonFor(block).focus({preventScroll:true})
    }
  }
  const advance = (direction: number) => {
    const count = modelsArtefacts[activeStep]?.length ?? 0
    const next = plate + direction
    if (!opened || next < 0 || next >= count) return false
    plate = next
    paint()
    return true
  }
  const click = (event: Event) => {
    const target = event.target as Element
    if (target.closest('[data-ma-close]')) { close(true); return }
    const page = target.closest<HTMLElement>('[data-ma-page]')
    if (page) { advance(Number(page.dataset.maPage)); return }
    if (target.closest('[data-ma-next]')) {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      if (activeStep < 5) select(activeStep + 1)
      else window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}))
      return
    }
    const block = target.closest<HTMLElement>('[data-models-block]')
    if (!block || !modelsArtefacts[Number(block.dataset.modelsBlock)] || !buttonFor(block).contains(target)) return
    const next = Number(block.dataset.modelsBlock)
    select(next)
    activeStep = next
    opened = true
    paint()
  }
  const key = (event: KeyboardEvent) => {
    if (!stage.closest('.deck-slide')?.classList.contains('is-active')) return
    if (event.key === 'Escape' && opened) {
      event.preventDefault(); event.stopImmediatePropagation(); close(true)
    } else if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLElement && triggers.some(block => buttonFor(block) === event.target)) {
      event.preventDefault(); event.stopImmediatePropagation(); event.target.click()
    }
  }
  map.addEventListener('click', click)
  window.addEventListener('keydown', key, true)
  const observer = new ResizeObserver(position)
  observer.observe(map)
  return { show, advance, close, position, destroy: () => {
    transition?.cancel(); observer.disconnect(); map.removeEventListener('click',click); window.removeEventListener('keydown',key,true)
    panel.remove(); stage.classList.remove('has-models-artifact')
    triggers.forEach(block => { const button = buttonFor(block); for (const attr of ['role','tabindex','aria-label','aria-expanded']) button.removeAttribute(attr) })
  } }
}
