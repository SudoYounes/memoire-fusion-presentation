# Premier écran SMED : l'enjeu

Écran `#smed-enjeu`, après `#contexte-industriel` et avant `#smed-diagnostic`.
L'enrichissement analytique reste dans cette même diapositive. Le deck garde
ses 25 slides après regroupement des solutions. Les vingt écrans Robot et
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

Après les cinq équipements, quatre vues analytiques occupent le même fond
foncé. Le cadrage et la ligne s'effacent pour donner toute la place à un
graphique à la fois. Les deux premières vues conservent les heures décimales
du document. Les deux croisements présentent les minutes en barres empilées
avec un tableau numérique aligné, pour rendre lisibles toutes les valeurs.
Les quatre couleurs identifient les intervenants, sans attribuer de rôle
individuel à BOB ou BOBINETTE dans ces agrégats.

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

### Les graphiques de la slide 20

La présentation conserve uniquement « Temps par machine » et « Temps par fonction ».
Les deux vues par intervenant sont retirées du parcours. Les matrices source restent
documentées ci-dessous pour conserver la provenance et le détail du cumul.

Les valeurs proviennent des figures `image46` / `image47` et des caches OOXML
`ppt/charts/chart1.xml` / `chart2.xml`. `smedAnalysis.ts` contient les données
éditables et génère les graphiques HTML natifs. Les cellules absentes du cache
OOXML suivent le rendu du graphique source : aucune contribution représentée,
affichée par un tiret. Les indices `c:pt@idx` déterminent l'intervenant concerné.

| Vue | Données et unité | Lecture préservée |
| --- | --- | --- |
| Machines | Noack 10,65 ; Neri 3,10 ; PC 1,97 ; Christ 1,37 ; Étiqueteuse 1,28 ; Rangement 0,20 ; ADC 0,12 h | Sommes de temps d'activité, avec deux activités hors machine. |
| Fonctions | Production 16,02 ; Maintenance 2,17 ; Qualité 0,50 h | Production = opérateur + chef d'équipe, soit 961 min. Maintenance 130 min, qualité 30 min. |
| Intervenants par machine | Matrice complète ci-dessous, en minutes | Même croisement que le graphique source, transposé en lignes machines et couleurs d'intervenants. |
| Intervenants par phase | Matrice complète ci-dessous, en minutes | Même croisement que le graphique source, transposé en lignes phases et couleurs d'intervenants. |

| Machine / activité | Opérateur | Tech. maintenance | Chef d'équipe | Tech. qualité | Total min |
| --- | ---: | ---: | ---: | ---: | ---: |
| Christ | 52 | 0 | 15 | 15 | 82 |
| Étiqueteuse | 77 | 0 | 0 | 0 | 77 |
| Neri | 174 | 0 | 12 | 0 | 186 |
| Noack | 493 | 111 | 20 | 15 | 639 |
| PC | 99 | 19 | 0 | 0 | 118 |
| ADC hors machine | 7 | 0 | 0 | 0 | 7 |
| Rangement hors machine | 12 | 0 | 0 | 0 | 12 |
| Total | 914 | 130 | 47 | 30 | 1 121 |

| Phase | Opérateur | Tech. maintenance | Chef d'équipe | Tech. qualité | Total min |
| --- | ---: | ---: | ---: | ---: | ---: |
| Attente | 43 | 0 | 0 | 0 | 43 |
| Contrôle | 130 | 3 | 25 | 30 | 188 |
| Démarrage | 0 | 0 | 10 | 0 | 10 |
| Démontage | 82 | 0 | 0 | 0 | 82 |
| Nettoyage | 74 | 3 | 0 | 0 | 77 |
| Préparation | 84 | 0 | 12 | 0 | 96 |
| Réglage | 351 | 124 | 0 | 0 | 475 |
| Remontage | 120 | 0 | 0 | 0 | 120 |
| Transport | 25 | 0 | 0 | 0 | 25 |
| Vidange | 5 | 0 | 0 | 0 | 5 |
| Total | 914 | 130 | 47 | 30 | 1 121 |

Le cumul exact atteint **1 121 min**, soit 18 h 41 de temps d'activité.
Il ne constitue pas une durée calendaire d'arrêt. Les heures affichées dans
les deux figures sont arrondies au centième, donc leur addition ne permet pas
de recalculer ce total à la minute près. La synthèse PC de cette slide reste
distincte des valeurs incohérentes de l'extrait de la slide 18. Les figures
reprennent chacune leur propre source, sans correction numérique supposée.

Le classement par phase indique 43 min d'attente et 188 min de contrôle.
Le Pareto de la slide 21 utilise un autre classement (179 / 173 / 25 min).
Ne pas fusionner ces mesures, ni attribuer une suppression possible à tous
les contrôles. L'analyse par fonction ne renseigne pas séparément BOB et
BOBINETTE.

Les 17 h de référence ne sont pas affichées ici tant que leur définition et
leur comparabilité avec le test ne sont pas confirmées. Aucun pourcentage de
gain, gain TRS ou résultat final n'est introduit dans ce premier écran.

## Interaction et revue

L'écran reste une seule diapositive, avec un parcours oral au clavier :
vue d'ensemble → Noack → PC → Neri → Christ → Étiqueteuse → temps par machine
→ temps par fonction → slide suivante.
Chaque appui sur Bas active un nœud et ouvre simultanément sa fenêtre ; Haut
revient à l'étape précédente. Depuis Noack, Haut revient à la vue d'ensemble,
puis à la slide précédente. Le retour depuis la slide suivante affiche
la dernière analyse (fonctions) pour reprendre le parcours à rebours. La slide
compte donc huit états de narration, dont l'ensemble initial. Un appui maintenu ne
saute pas les étapes. Droite/Gauche, Page suivante/précédente et Espace
(Maj pour revenir) suivent le même parcours, y compris les boutons du mode
présentation. Les autres slides et leur navigation ne sont pas modifiées.
Les cinq nœuds sont des boutons natifs utilisables au clic, au toucher et au
clavier. Une seule fenêtre peut être ouverte à la fois. Cliquer sur un autre
équipement change l'extrait ; recliquer sur l'équipement actif referme sa
fenêtre. Le bouton « Changement étudié et intervenants » reste disponible.
Les fenêtres sont des régions non modales, comme les preuves Robot. Échap ou
le bouton × ferme la fenêtre et restitue le focus au déclencheur. Le départ
vers une autre slide referme la fenêtre. Dans une fenêtre machine, Début/Fin
accèdent au premier/dernier équipement. Dans une analyse, ces touches
accèdent au premier/dernier graphique. « Analyse des temps » ouvre directement
le premier graphique et les deux onglets changent de vue sans quitter la
slide. Les flèches du panneau suivent le parcours global, y compris les bornes.
Le détail « Changement étudié » reste
optionnel : depuis cette fenêtre, Bas ouvre Noack et Haut revient à l'ensemble.
La molette sur une fenêtre de bureau
n'avance pas le deck. Hors de la fenêtre, la navigation reste inchangée.
En portrait, le schéma initial est vertical ; à l'ouverture d'une fenêtre,
les cinq nœuds forment un bandeau compact au-dessus du détail, dans le flux.
Le cadrage réapparaît à la fermeture. Le clic et le toucher permettent toujours
d'accéder directement à n'importe quel équipement, puis le clavier reprend
à partir de cet équipement.
La réduction du mouvement supprime les animations. L'impression conserve
l'écran principal pour les fenêtres d'opérations, ou la vue analytique
sélectionnée lorsqu'une analyse est ouverte. En portrait, les deux matrices
se lisent dans une zone à défilement horizontal, sans rétrécir les nombres.

- Présentation : `/#smed-enjeu`
- Capture : `/?capture=smed-enjeu`
- Capture du détail : `/?capture=smed-enjeu&smed-detail=1`
- Capture d'une machine : `/?capture=smed-enjeu&smed-machine=noack`
  (valeurs : `noack`, `pc`, `neri`, `christ`, `etiqueteuse`).
- Capture d'un graphique : `/?capture=smed-enjeu&smed-analysis=machines`
  (valeurs : `machines`, `functions`, `actors`, `phases`).
  Ce paramètre a priorité si un ancien paramètre machine figure aussi dans l'URL.

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
l'observation. » Bas permet ensuite de poursuivre vers l'équipement suivant.

Sur les graphiques : « Ces exemples s'inscrivent dans un relevé plus large.
La synthèse par machine situe les charges d'activité, avec 10,65 heures
cumulées sur Noack. Elle conserve les activités hors machine. »

« Le regroupement par fonction fait apparaître la production, qui comprend
ici opérateurs et chef d'équipe, puis la maintenance et la qualité. »

« Le croisement suivant détaille la contribution de chaque catégorie
d'intervenant sur les machines. Les colonnes gardent les minutes exactes
du graphique source. »

« Enfin, le classement par phase rassemble 475 minutes de réglage.
L'ensemble de ces graphes additionne des temps d'activité. Pour parler
d'arrêt et de pertes, il faut garder la définition de chaque mesure. »

## Réversibilité

Point de départ propre : `fd49608`, branche `feat/contexte-industriel`.
Les changements sont isolés dans le bloc HTML de la nouvelle slide, ses
fichiers CSS/TS, le montage dans `main.ts` et l'entrée de chapitre SMED.
Aucun changement des contenus Robot ni du PowerPoint source.
Enrichissement des nœuds réalisé à partir du commit propre `f459c3a`, sans
ajout de diapositive et sans modification de la navigation globale.
Le parcours Haut/Bas est ajouté à partir du commit propre `a9f66f9`, dans le
contrôleur SMED uniquement, avec adaptation de l'indication clavier à l'écran.
