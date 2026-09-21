# Révision SMED — contrôles de livraison

Périmètre : slide 2 enrichie des quatre analyses source 20 ; slide 3 avec
Pareto vertical et passage causes → leviers ; remplacement des trois anciens
écrans de solutions par une chaîne verticale avec fenêtres de preuves.

## Réversibilité et conservation

- Base avant révision : commit `2c88cc8`, branche `feat/contexte-industriel`.
- 25 slides après fusion, contre 27 précédemment.
- Le HTML de l'ouverture, du résultat SMED et de toute la partie Robot est
  identique à la base, vérifié par comparaison exacte des sections.
- PowerPoint original inchangé, SHA-256 :
  `15fb7d7ecd175f105c216037ad41c6a7a2667efc261936134f7551362c8eb01c`.
- Le SVG de décision est une copie binaire de l'artefact source. Les autres
  photographies et extraits n'ont pas été modifiés.
- Aucune publication ni modification du dépôt Robot séparé.

## Données

- Matrices machine / intervenant et phase / intervenant comparées aux caches
  OOXML avec les indices `c:pt@idx` : égalité des valeurs, total 1 121 min.
- Pareto : 179, 173 et 25 min ; cumul calculé sur 377 min, seuil 80 % sur
  l'axe droit, sans lissage ni point ajouté avant la première catégorie.
- Trois causes de l'Ishikawa associées aux leviers visserie, formation et
  décision. Nouveau scénario explicitement issu de l'observation.
- Scénario : 20 lignes contrôlées, alignements et temps 5 / 10 / 25 min fidèles.
- Inventaire : 30 lignes, quantités, dimensions et destinations contrôlées.
- Aucun gain net par levier ni délai garanti de résolution introduit.

## Vérifications exécutées

- `npm run typecheck`, `npm run build`, `git diff --check` et contrôle de
  connectivité Git sans erreur. Le warning préexistant de taille des bundles
  Vite reste présent ; cette révision ne modifie pas la stratégie de chargement.
- Chrome local : parcours aller/retour des 36 états SMED jusqu'à Robot,
  exclusivement avec Haut/Bas. Une seule fenêtre visible, bloc actif correct.
- Captures des quatre analyses, des sept états du diagnostic et des quinze
  états des solutions ; vérification desktop 1920 × 1080 et 1440 × 900.
- Portrait 390 / 320 px : pas de débordement de page. Les documents larges
  restent consultables dans leur zone de défilement, sans modifier le parcours.
- Transformations et balayage testés avec mouvement ; mode capture et
  mouvement réduit conservent les états sans animation.
- Build servi temporairement sous `/memoire-fusion-presentation/` pour
  reproduire le sous-chemin GitHub Pages : médias relatifs, aucun 404,
  aucune erreur JavaScript, aucun scroll interne des tableaux sur desktop.

Les contrôles portent sur un rendu navigateur local. La publication reste
une action séparée et non effectuée.
