# Premier écran SMED : l'enjeu

Écran `#smed-enjeu`, ajouté après `#contexte-industriel` et avant `#robot-2`.
Une seule nouvelle diapositive, soit 22 au total. Les vingt écrans Robot et
leurs identifiants sont conservés.

## Intention éditoriale et visuelle

Un cadrage du chantier, avec une cible et un périmètre. Le titre porte l'enjeu,
le nombre 12 h est explicitement un objectif. Une ligne horizontale situe
les cinq équipements concernés par l'arrêt. Chacun ouvre désormais une fenêtre
d'opérations observées. Le bouton de contexte conserve le cas produit/format
et les acteurs du changement.

Fond `theme-teal` de l'ancienne slide 8, typographies Inter/Libertinus, même
maille atmosphérique et même échelle `--su`. Pas de grille de cartes ajoutée.
Le schéma reste éditable en HTML/CSS. L'entrée du titre et de la cible utilise
les révélations du deck ; les équipements apparaissent successivement. Ce
mouvement révèle le périmètre, il ne représente ni des machines en production
ni des durées d'opération. Une transition ouvre le détail au-dessus de la ligne,
puis un fondu accompagne le passage entre machines. Le nœud actif devient
cuivré et un trait le relie à la fenêtre. La ligne reste visible et utilisable.

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
- Slide 18 : les fenêtres d'équipement reprennent des opérations du tableau
  initial, avec libellés abrégés, numéros sources et intervenants. La sélection
  est éditable dans `smedMachineEvidence.ts` :

  | Équipement | Lignes sources | Ce que l'extrait permet d'expliquer |
  | --- | --- | --- |
  | Noack | 5, 10, 11, 14 | Démontage, identification et relais avec la maintenance |
  | PC | 58, 72, 74, 75 | Éléments mécaniques à remonter et à régler |
  | Neri | 65, 66, 67, 70 | Programmes et réglages physiques |
  | Christ | 60, 62, 63, 64 | Programme, mise aux cotes et remontage |
  | Étiqueteuse | 56, 77, 78 | Carte mémoire et format carton |

  Les opérations sélectionnées ne constituent pas une procédure complète ni
  une séquence continue. Les omissions à l'intérieur de libellés composés
  relèvent de l'abrègement annoncé à l'écran, sans recomposer une instruction
  technique de montage. Le tableau source affiche seulement 42 des 87 lignes
  annoncées. Les durées sont exclues de toutes les fenêtres : les lignes PC
  visibles totalisent 200 min alors que la synthèse slide 20 affiche 118 min
  pour PC. Aucun total machine ni arrêt calendaire n'est déduit des extraits.
  L'opération ADC « hors machine » n'est attribuée à aucun de ces cinq nœuds.
- Le maintien de la qualité est une contrainte du cadrage, pas une qualification
  ou un résultat mesuré annoncé par cet écran.

Les 17 h de référence ne sont pas affichées ici tant que leur définition et
leur comparabilité avec le test ne sont pas confirmées. Aucun pourcentage de
gain, gain TRS ou résultat final n'est introduit dans ce premier écran.

## Interaction et revue

L'écran est une seule étape de navigation : les flèches et la molette gardent
le comportement normal du deck. Pas de pas de narration obligatoires ajoutés.
Les cinq nœuds sont des boutons natifs utilisables au clic, au toucher et au
clavier. Une seule fenêtre peut être ouverte à la fois. Cliquer sur un autre
équipement change l'extrait ; recliquer sur l'équipement actif referme sa
fenêtre. Le bouton « Changement étudié et intervenants » reste disponible.
Les fenêtres sont des régions non modales, comme les preuves Robot. Échap ou
le bouton × ferme la fenêtre et restitue le focus au déclencheur. Le départ
vers une autre slide referme la fenêtre. Dans une fenêtre machine, les flèches
gauche/droite changent d'équipement ; Début/Fin accèdent au premier/dernier.
Le clavier ne change alors pas la slide. La molette sur une fenêtre de bureau
n'avance pas le deck. Hors de la fenêtre, la navigation reste inchangée.
En portrait, le schéma initial est vertical ; à l'ouverture d'une fenêtre,
les cinq nœuds forment un bandeau compact au-dessus du détail, dans le flux.
Le cadrage réapparaît à la fermeture. Aucun parcours imposé des cinq fenêtres.
La réduction du mouvement supprime les animations ; l'impression conserve
l'écran principal sans sa fenêtre.

- Présentation : `/#smed-enjeu`
- Capture : `/?capture=smed-enjeu`
- Capture du détail : `/?capture=smed-enjeu&smed-detail=1`
- Capture d'une machine : `/?capture=smed-enjeu&smed-machine=noack`
  (valeurs : `noack`, `pc`, `neri`, `christ`, `etiqueteuse`).

## Trame orale

« Le changement de format immobilise la ligne et mobilise plusieurs
intervenants. Le chantier vise une durée de douze heures. L'enjeu est de
retrouver de la disponibilité tout en conservant les exigences de qualité.
Le périmètre couvre la ligne de conditionnement représentée ici. »

À l'ouverture du détail : « L'observation porte sur ce passage de produit,
avec un changement d'étui et de blister. BOB intervient principalement sur
Noack, BOBINETTE en aval, avec l'appui du chef d'équipe, de la maintenance
et de la qualité. »

Exemple sur Noack : « Le relevé montre les démontages, l'identification des
chariots et le nettoyage du rouleau par la maintenance. Cela donne une idée
concrète du travail à coordonner ; ce ne sont que quelques opérations de
l'observation. » Les autres fenêtres peuvent rester fermées à l'oral.

## Réversibilité

Point de départ propre : `fd49608`, branche `feat/contexte-industriel`.
Les changements sont isolés dans le bloc HTML de la nouvelle slide, ses
fichiers CSS/TS, le montage dans `main.ts` et l'entrée de chapitre SMED.
Aucun changement des contenus Robot ni du PowerPoint source.
Enrichissement des nœuds réalisé à partir du commit propre `f459c3a`, sans
ajout de diapositive et sans modification de la navigation globale.
