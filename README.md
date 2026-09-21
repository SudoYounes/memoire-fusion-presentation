# Robot 2 — Présentation HTML de soutenance

**Présentation en ligne :** https://sudoyounes.github.io/memoire-fusion-presentation/

Deck scroll-driven de 25 diapositives, ouvert par les périmètres du projet,
puis consacré au chantier SMED et à la conception mécanique et à
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

1. Cadrer les deux périmètres, puis parcourir le chantier SMED : enjeu,
   observation, diagnostic, solutions déployées, résultat et suivi.
   Cadrer ensuite le geste Robot 2 et son contrat de réussite.
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
- Barre haute segmentée : accès direct aux sept chapitres ; le
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

- `index.html` — structure des 25 diapositives ; le diagnostic et les fenêtres
  de solutions SMED sont rendus par leurs modules dédiés.
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

## Ouverture — Périmètres du projet

La nouvelle première slide reprend la slide 6 de la soutenance VIATRIS. Les
trois cartes suivent cinq étapes : définition CDF, définition automatisation,
contexte industriel, impact CDF, impact automatisation. Les cartes actives
s’éclairent et un feuillet souple se courbe depuis le coin supérieur droit pour
dévoiler chacun des deux versos. Le pied de la face CDF porte le libellé SMED.

Flèches, Espace et molette parcourent les étapes avant de rejoindre le SMED,
puis Robot 2.
Les titres de carte et les boutons locaux permettent un accès direct. Le fond
sombre reprend celui de l’ancienne slide 8. Sa déclinaison claire est accessible
par `?industrial-theme=light#contexte-industriel` ; `industrial-step=0` à `5`
permet de revoir un état précis. Le mouvement réduit conserve les étapes et
supprime la courbure.

Le contenu et les sources sont consignés dans `src/content/industrial-context-notes.md`.
Le module et ses styles restent isolés dans `src/visuals/industrialContext.ts`
et `src/styles/industrial-context.css`.

## Chantier SMED

Quatre écrans suivent l'ouverture, sans modifier les vingt slides Robot :

- `#smed-enjeu` : cible de 12 h, opérations par machine, puis les quatre
  analyses de la slide 20 source : machines, fonctions et croisements par
  intervenant et par phase. Dix états, dont la vue initiale.
- `#smed-diagnostic` : Pareto vertical, cumul et seuil 80 %, focus attente puis
  contrôle, transformation de trois causes en leviers, synthèse des quatre
  solutions retenues. Sept états.
- `#smed-solutions` : chaîne verticale de quatre blocs, balayage lumineux gold
  et fenêtres de preuves : nouveau scénario, inventaire et supports de
  visserie, fiche NA014, logigramme de prise de décision. Quinze états.
- `#smed-impact` : test de 655 minutes, comparaison à la cible et suivi prévu.

Haut/Bas parcourent toutes les étapes du récit sans clic obligatoire. Le retour
depuis un écran suivant reprend le dernier état de l'écran précédent.
La slide résultat conserve ses quatre états. Les liens de pied de slide et
les quatre blocs de solutions restent disponibles pour la répétition et le tactile.

`?capture=smed-impact&smed-step=2` permet de capturer un état précis (index à
partir de zéro). `?motion=off#smed-diagnostic` conserve la progression sans
animation. `?capture=smed-enjeu&smed-analysis=phases` isole la dernière analyse
de la slide 2 (autres valeurs : `machines`, `functions`, `actors`).
Le contrôleur local est `src/visuals/smedStory.ts`. Le diagnostic et les
solutions ont leurs modules `smedDiagnostic.ts` / `smedSolutions.ts` et leurs
styles isolés. Les preuves et la trame orale figurent dans
`src/content/smed-story-notes.md` et `src/content/smed-solutions-notes.md`.

Les graphiques redessinés sont éditables en HTML/CSS/SVG. Les photographies sont
des copies des preuves originales, sans génération ni retouche. La durée du
test, les charges d'activité et les temps du Pareto gardent des périmètres
distincts. Aucun gain durable ni pourcentage avant/après non confirmé n'est
introduit.

## Notations mathématiques — séquence numérique Robot

Les expressions LaTeX sont précompilées en SVG vectoriels autonomes : aucun
moteur MathJax ni chargement de police externe n’est nécessaire dans le navigateur.
Les formules et leurs données sources sont définies dans
`scripts/math/generate-runtime.mjs`, avec un rendu partagé dans
`src/visuals/runtimeMath.ts`.

- `npm run math:generate` régénère `src/content/runtimeMath.ts`.
- `npm run math:check` vérifie que les SVG correspondent aux sources.

Régénérer les notations après toute modification des données concernées, puis
vérifier le cadrage des figures et des commentaires dans les slides.

## Fenêtres d’artefacts — modèles Robot

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
