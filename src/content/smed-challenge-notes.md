# Premier écran SMED : l'enjeu

Écran `#smed-enjeu`, ajouté après `#contexte-industriel` et avant `#robot-2`.
Une seule nouvelle diapositive, soit 22 au total. Les vingt écrans Robot et
leurs identifiants sont conservés.

## Intention éditoriale et visuelle

Un cadrage du chantier, avec une cible et un périmètre. Le titre porte l'enjeu,
le nombre 12 h est explicitement un objectif. Une ligne horizontale situe
les cinq équipements concernés par l'arrêt. La fenêtre apporte le cas
observé et les acteurs lorsque le présentateur souhaite les développer.

Fond `theme-teal` de l'ancienne slide 8, typographies Inter/Libertinus, même
maille atmosphérique et même échelle `--su`. Pas de grille de cartes ajoutée.
Le schéma reste éditable en HTML/CSS. L'entrée du titre et de la cible utilise
les révélations du deck ; les équipements apparaissent successivement. Ce
mouvement révèle le périmètre, il ne représente ni des machines en production
ni des durées d'opération. Une troisième transition ouvre le détail.

## Provenance et limites

Source : `Soutenance de stage_VIATRIS.pptx`, fichier original conservé dans
Downloads. Audit détaillé : `smed-selection.md`.

- Slide 13 : 12 h est la cible du chantier, pas le résultat du test.
- Slide 6 : opérations sur l'ensemble des équipements de la ligne à l'arrêt.
- Slide 15 : ordre spatial des équipements vérifié dans les coordonnées des
  formes OOXML, et non dans leur ordre textuel : Noack, PC4250, Neri, Christ,
  Étiqueteuse. L'écran utilise « PC », la désignation variant ailleurs dans
  le fichier source. Le schéma n'indique pas les fonctions des machines, les
  distances ni une échelle de temps qui ne seraient pas documentées.
- Slide 17 : ACEBUTOLOL 400 mg, 90 cps, étui 20, blister 44 × 120 mm ;
  IBUPROFENE 200 mg, 30 cps, étui 1, blister 39 × 98 mm. Les désignations
  et l'abréviation `cps` reprennent la source.
- Slide 16 : BOB intervient principalement sur Noack, BOBINETTE en aval ;
  chef d'équipe, maintenance et qualité sont les autres intervenants cités.
- Le maintien de la qualité est une contrainte du cadrage, pas une qualification
  ou un résultat mesuré annoncé par cet écran.

Les 17 h de référence ne sont pas affichées ici tant que leur définition et
leur comparabilité avec le test ne sont pas confirmées. Aucun pourcentage de
gain, gain TRS ou résultat final n'est introduit dans ce premier écran.

## Interaction et revue

L'écran est une seule étape de navigation : les flèches et la molette gardent
le comportement normal du deck. Pas de pas de narration obligatoires ajoutés.
Le bouton « Changement étudié et intervenants » ouvre une région non modale,
sur le principe des fenêtres de preuves Robot. Échap ou le bouton × ferme la
fenêtre et restitue le focus au déclencheur. Le départ vers une autre slide
referme la fenêtre. Les flèches depuis son contenu ne changent pas la slide.
En portrait, le schéma devient vertical et le détail reste dans le flux.
La réduction du mouvement supprime les animations ; l'impression conserve
l'écran principal sans sa fenêtre.

- Présentation : `/#smed-enjeu`
- Capture : `/?capture=smed-enjeu`
- Capture du détail : `/?capture=smed-enjeu&smed-detail=1`

## Trame orale

« Le changement de format immobilise la ligne et mobilise plusieurs
intervenants. Le chantier vise une durée de douze heures. L'enjeu est de
retrouver de la disponibilité tout en conservant les exigences de qualité.
Le périmètre couvre la ligne de conditionnement représentée ici. »

À l'ouverture du détail : « L'observation porte sur ce passage de produit,
avec un changement d'étui et de blister. BOB intervient principalement sur
Noack, BOBINETTE en aval, avec l'appui du chef d'équipe, de la maintenance
et de la qualité. »

## Réversibilité

Point de départ propre : `fd49608`, branche `feat/contexte-industriel`.
Les changements sont isolés dans le bloc HTML de la nouvelle slide, ses
fichiers CSS/TS, le montage dans `main.ts` et l'entrée de chapitre SMED.
Aucun changement des contenus Robot ni du PowerPoint source.
