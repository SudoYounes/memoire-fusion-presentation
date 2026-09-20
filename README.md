# Robot 2 — Présentation HTML de soutenance

**Présentation en ligne :** https://sudoyounes.github.io/memoire-fusion-presentation/

Deck scroll-driven de 20 diapositives consacré à la conception mécanique et à
la qualification numérique de Robot 2. Le récit est calibré pour un jury de
docteurs et professeurs : décisions, résultats, livrables et limites de preuve,
sans dérouler le mémoire chapitre par chapitre.

Le projet est autonome et séparé de `/Users/macair/Documents/robot2-cad`.
Aucun fichier du dépôt Robot 2 n’est modifié à l’exécution.

## ADN visuel

**Chronométrie cinétique** : la précision pharmaceutique rencontre
l’intelligence mécanique ; le temps sert de matière commune à la conception,
la commande et la qualification.

- Palette issue du mémoire : papier froid, encre, bleu industriel, turquoise.
- Accent cuivre réservé aux décisions, seuils et preuves.
- Signature de fond : une tessellation triangulaire 2D continue, sans contours
  tracés. Les dégradés gris bleuté à l’intérieur des cellules et leurs nuances
  coordonnées créent le contraste ; un fondu central préserve la lecture.
- Inter Variable pour l’ingénierie, Libertinus Serif pour la voix éditoriale.
- Un message dominant par écran, figures CAO et données réelles en soutien.
- Chaîne numérique redessinée en graphes HTML/SVG natifs : commandes cuivre,
  retours d’état turquoise et preuves ardoise, sans reprise des figures du PDF.
- Scène 16:9 stricte dans un viewport fluide, avec repli mobile lisible.

## Arc narratif

1. Cadrer le geste et le contrat de réussite.
2. Montrer l’architecture quatre axes et les décisions mécaniques structurantes.
3. Parcourir les six blocs dans l'ordre de la vue maître : décrire, observer,
   décider, préparer, exécuter, prouver. Une miniature du même graphe situe le
   module courant ; chaque transition recule vers la vue d'ensemble en grand
   avant d'entrer dans le bloc suivant.
4. Expliquer le cycle multicouche et le passage rigoureux de HOLD à PASS.
5. Donner le verdict 108/108, les métriques qualité, les livrables et la limite
   entre commissioning simulé et validation industrielle.

## Commandes

```sh
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

Le bundle n’utilise ni CDN ni ressource distante. Les fontes, figures, données
et le modèle GLB sont servis localement, ce qui permet une soutenance hors
réseau après `npm run build`.

## Navigation

- Molette / trackpad : une diapositive par geste, via Lenis Snap.
- `↓`, `→`, `PageDown`, `Espace` : suivante.
- `↑`, `←`, `PageUp`, `Maj+Espace` : précédente.
- `Home` / `End` : première / dernière.
- `F` : plein écran.
- Barre haute segmentée : accès direct aux cinq chapitres provisoires ; le
  segment actif s'assombrit automatiquement avec l'avancement.
- Rail droit : accès direct ; chaque diapositive possède aussi une URL ancrée.
- Pied des slides de simulation : miniature translucide du graphe maître,
  module actif contrasté et liens directs vers les six blocs.
- Entre modules : transition réversible de 1,8 s, avec un palier sur le graphe
  en grand ; en mouvement réduit, navigation directe sans caméra.

Options de répétition :

- `?motion=off` coupe les animations et active le snap natif de repli.
- `?debug=1` affiche la grille de composition.
- `?capture=resultat` isole une diapositive pour les captures statiques.

## Architecture

- `index.html` — contenu sémantique des 20 diapositives.
- `src/deck/setupModelsZoom.ts` — ancrage du bus de descriptions.
- `src/deck/pipelineNavigation.ts` — miniatures et transitions de caméra
  communes aux six blocs de la chaîne numérique.
- `src/styles/pipeline-navigation.css` — orientation, caméra et habillage.
- `src/styles/models.css` — schéma et explications de la slide « Décrire ».
- `src/content/models-notes.md` — fil oral et sources de cette slide.
- `src/deck/setupDeck.ts` — état, clavier, hashes, Lenis, Snap et ScrollTrigger.
- `src/visuals/slideAtmosphere.ts` — maille triangulaire SVG générée et continue.
- `src/visuals/cyclePlot.ts` — tracé SVG construit depuis les 108 lignes CSV.
- `src/webgl/RobotScene.ts` — inspection Three.js du robot complet et du détail
  J3, avec focalisation structure / transmission / préhension.
- `src/styles/pipeline.css` — système de graphes natifs, flux et zooms de la
  chaîne numérique.
- `src/styles/` — tokens, scène 16:9, layouts et résilience mouvement réduit.
- `public/media/` — copies autonomes des figures sélectionnées.
- `public/models/` — GLB web optimisés du robot complet et du sous-ensemble J3.

## Langage de preuve

- `9,6 kg` décrit le produit maximal observé ; `15 kg` est le carton d’étude
  simulé. Ces deux valeurs ne sont jamais fusionnées.
- Le résultat principal est une qualification de commissioning en simulation :
  9 séquences fraîches × 12 cycles, avec 8 resets déclarés.
- `108/108`, moyenne `10,556 s`, maximum `11,526 s`, marge minimale `0,474 s`.
- Ce résultat n’est ni une production continue de 108 cartons ni un crédit de
  release industriel. Fabrication, mise en service, sécurité et gains terrain
  restent à établir.

La provenance détaillée des médias se trouve dans `public/media/SOURCES.md`.

## Notations mathématiques — slides 13 à 15

Les expressions LaTeX sont précompilées en SVG vectoriels autonomes : aucun
moteur MathJax ni chargement de police externe n’est nécessaire dans le navigateur.
Les formules et leurs données sources sont définies dans
`scripts/math/generate-runtime.mjs`, avec un rendu partagé dans
`src/visuals/runtimeMath.ts`.

- `npm run math:generate` régénère `src/content/runtimeMath.ts`.
- `npm run math:check` vérifie que les SVG correspondent aux sources.

Régénérer les notations après toute modification des données concernées, puis
vérifier le cadrage des figures et des commentaires dans les slides.

## Fenêtres d’artefacts — slide 10

Les fenêtres s’ajoutent au premier plan sans remplacer la structure ni le texte
de la slide. Leur contenu réside dans `src/visuals/modelsArtifacts.ts` et leur
habillage est limité à `src/styles/models-artifacts.css`.

- Une activation ouvre l’artefact du bloc ; cliquer sur le bloc permet de le rouvrir.
- Les flèches ou la molette parcourent les cinq planches CAO avant le bloc suivant.
- Le bouton « Bloc suivant » permet de sauter les planches restantes.
- Échap ou la croix referment la fenêtre et révèlent les explications existantes.
- En mouvement réduit ou sur mobile, l’ouverture reste disponible au clic.
- Le croquis URDF est un placeholder à remplacer par le dessin de l’auteur.

La capture du monde est une vue documentaire existante, avec le robot présent.
Les sources et le cadrage des planches sont consignés dans `public/media/SOURCES.md`.
