# SMED — du diagnostic au résultat

Cette note accompagne le diagnostic et le résultat, et conserve le dossier de
preuve des solutions. La révision fusionne organisation, supports et standards
dans un seul écran à quatre blocs : `#smed-solutions`. Sa conduite détaillée est
dans `smed-solutions-notes.md`. Cette note sépare les sources et
leurs limites de la trame orale, afin que chaque écran porte un message
simple et une preuve lisible. Le périmètre SMED concerne l'organisation du
changement de format ; les résultats de Robot 2 restent distincts.

Source commune : `/Users/macair/Downloads/Soutenance de stage_VIATRIS.pptx`.
Les numéros indiqués sont ceux du PowerPoint. Les médias locaux et leur
provenance sont décrits dans `public/media/SOURCES.md`. L'analyse complète
des 36 slides est conservée dans `smed-selection.md`.

## Parcours de narration

Bas progresse dans les états d'un écran ; Haut les parcourt en sens inverse.
Chaque état apporte la représentation ou le document associé au point expliqué.
Les preuves ne changent ni de statut ni de portée lorsqu'elles sont agrandies.

| Écran | États dans l'ordre du récit | Message central |
| --- | --- | --- |
| Enjeu | Ligne et opérations → machines → fonctions → intervenants → phases | Lire les quatre graphiques de la slide 20 sans confondre charge cumulée et arrêt calendaire. |
| Diagnostic | Pareto → attente → attente + contrôle → visserie → gestes → blocages → quatre leviers | Comprendre les temps classés, puis transformer les observations en réponses. |
| Solutions | Scénario → visserie → formation → prise de décision | Déployer les artefacts depuis une chaîne fixe, avec la preuve associée au bloc actif. |
| Impact | Test 10 h 55 → cible 12 h → marge 65 min → suivi | Présenter le résultat de l'essai et l'outil de suivi qui lui succède. |

## 1. Diagnostic — relier les temps aux causes

### Sources et portée

| Fait retenu | Source | Portée et limite |
| --- | --- | --- |
| Attente 179 min ; contrôle 173 min ; transport 25 min | Slide 21, `ppt/charts/chart3.xml` | Données natives du Pareto ; total de 377 min dans son classement. |
| Attente + contrôle = 352 min, soit 93,37 % | Calcul à partir du même graphique | Part de ces 377 min seulement ; ni part du CDF complet, ni quantité intégralement supprimable. |
| Recherches de vis, mauvaise organisation, déplacements et attente | Slide 22, `ppt/media/image48.png` | Analyse qualitative, sans pondération statistique des causes. |
| Connaissance limitée des opérations, hésitations, besoin d'assistance | Même figure | Motive les standards et la transmission des gestes ; ne mesure pas leur effet individuel. |
| Résolution autonome trop longue et pratiques d'appel variables | Même figure | Motive des règles d'escalade, sans délai de résolution garanti. |
| Scénario, visserie, formation, prise de décision | Slide 23 | Les quatre leviers retenus par le chantier. |

Les contrôles sont classés parmi les NVA dans le Pareto source. Le récit
porte sur leur préparation et leur coordination ; il ne propose pas de
retirer les contrôles nécessaires à la qualité. La ventilation par phase
slide 20 utilise un autre codage (attente 43 min, contrôle 188 min) : elle
n'est pas recombinée avec ce Pareto.

L'Ishikawa `causes-source.png` reste disponible comme source documentaire.
Le récit utilise sa synthèse native, sans ajouter un arrêt sur le diagramme complet.
Le graphique principal garde la structure de la figure source : trois barres
verticales, axe gauche 0–200 minutes, ligne cumulée non lissée et axe droit
0–100 %. Cumul : 47,4801 %, 93,3687 %, 100 %. Le trait pointillé est à 80 %
sur l'axe droit, pas un seuil de 160 minutes sur l'axe gauche. La ligne débute
au centre de la première barre, sans point fictif à zéro. Le dénominateur reste
377 min. Les liens causes/réponses ont la même importance
graphique ; aucune épaisseur de trait ne représente un gain.

### Trame orale, état par état

0. **Vue d'ensemble.** « Le diagnostic classe ici trois familles de temps :
   l'attente, le contrôle et le transport. Elles représentent 377 minutes
   dans ce relevé. »
1. **Attente.** « L'attente représente 179 minutes, près de la moitié des
   377 minutes classées dans ce Pareto. »
2. **Attente et contrôle.** « L'attente et le contrôle en concentrent 352.
   Le levier consiste à mieux préparer et coordonner ces opérations,
   tout en conservant les exigences de qualité. »
3. **Visserie.** « Sur le terrain, les recherches, les mélanges et
   l'indisponibilité des vis perturbent le remontage. L'organisation des
   pièces devient donc une réponse concrète. »
4. **Gestes.** « Les hésitations et les demandes d'assistance montrent aussi
   le besoin de rendre les opérations plus faciles à comprendre et à
   transmettre. »
5. **Blocages.** « Enfin, les pratiques d'appel varient. Définir à qui passer
   le relais et à quel moment évite de laisser chaque intervenant décider
   seul pendant une durée indéfinie. »
6. **Quatre leviers.** « À ces trois réponses s'ajoute le nouveau scénario
   opératoire, issu de l'observation du déroulement. Nous allons maintenant
   parcourir leurs solutions et les artefacts réalisés. »

Pendant les états 3–5, le libellé de la cause reste visible comme trace,
tandis que son levier se déploie vers la droite. Les réponses déjà présentées
restent en retrait. Le nouveau scénario ne devient jamais une quatrième
cause de l'Ishikawa : son origine est explicitement différente à l'état 6.

Les sections 2–4 ci-dessous documentent les trois familles de preuves autrefois
séparées en écrans. Elles restent le dossier de référence ; la nouvelle
séquence unique et ses quinze étapes sont décrites dans `smed-solutions-notes.md`.

## 2. Organisation — coordonner les interventions

### Sources et portée

| Coordination | Lignes du tableau slide 25 | Fait retenu |
| --- | --- | --- |
| Maintenance | BOB 13, colonne chef d'équipe / maintenance | L'appel maintenance accompagne le nettoyage du rouleau de scellage par le technicien : 5 min explicitement en temps masqué. |
| Nettoyage partagé | BOB 16 / BOBINETTE 7 | Nettoyage final et aide au nettoyage final apparaissent sur la même ligne du scénario. |
| Linemaster | BOB 19 / BOBINETTE 10 / chef d'équipe | Vide de ligne opérateur, préparation coding, arrêt et chargement du nouveau programme Linemaster par le chef d'équipe ; cette dernière opération est indiquée à 10 min en temps masqué. |
| Vide de ligne | BOB 20 / BOBINETTE 11 / chef d'équipe + qualité | Les deux opérateurs attendent le vide de ligne ; l'intervention chef d'équipe + qualité reste présente, à 25 min. |

Le schéma représente une coordination, sans échelle temporelle. Les 5 et
10 min sont les durées de deux opérations signalées en temps masqué : leur
somme ne démontre pas un gain net de 15 min. Le temps masqué ne signifie
pas nécessairement une opération externalisée pendant la production.
Les positions de début/fin complètes et le chemin critique ne sont pas
disponibles ; ne pas fabriquer un planning initial ou un avant/après chiffré.

Une fenêtre éventuelle peut transcrire ces lignes avec leurs numéros sources
et l'intitulé « extrait du nouveau scénario ». Il n'existe pas de capture
raster de la slide 25 dans les médias sélectionnés. L'extrait ne constitue
pas une procédure complète de changement de format.

### Trame orale, état par état

0. **Maintenance.** « Le nouveau scénario précise le relais avec la
   maintenance. Le nettoyage du rouleau, indiqué à cinq minutes, est
   organisé en temps masqué. »
1. **Nettoyage partagé.** « Le nettoyage final mobilise BOB et l'aide de
   BOBINETTE. L'enchaînement rend cette coopération explicite. »
2. **Linemaster.** « Le scénario coordonne aussi le vide de ligne opérateur,
   la préparation du coding et le chargement Linemaster par le chef
   d'équipe. Ces dix minutes de programme sont identifiées en temps masqué. »
3. **Vide de ligne.** « Le passage du chef d'équipe et de la qualité reste
   identifié. L'objectif est de coordonner les interventions autour de ce
   passage, en conservant l'étape de contrôle. »

## 3. Supports — de la conception à la fabrication

### Sources et portée

| Élément | Source | Preuve et limite |
| --- | --- | --- |
| Inventaire par machine, zone, quantité, dimensions et destination | Slide 26, tableau OOXML | Décrit le besoin de rangement et distingue les pièces allant en laverie de celles restant sur ligne. |
| Support commun conçu / fabriqué | Slide 27, images 49 / 50 | `support-common-cad.png` / `support-common-built.png` ; modèle et photographie d'un objet réel. |
| Support de visserie de la boîte à brosses | Slide 27, images 51 / 52 | `support-brush-cad.png` / `support-brush-built.png` ; le support est l'objet conçu, pas la boîte à brosses elle-même. |
| Support de visserie de descente | Slide 27, images 53 / 54 | `support-descent-cad.png` / `support-descent-built.png`. |
| Préparation standardisée et rangement 6S | Slide 28 | Actions décrites ; aucune mesure de gain autonome fournie. |

Les trois paires documentent des fabrications. Les supports photographiés
sont vides et n'ont pas de marquages finaux lisibles. Les images ne permettent
pas d'affirmer leur usage stabilisé sur ligne ou d'attribuer une part du gain
global à chaque support. Certaines inscriptions de quantité/dimension CAO
diffèrent du tableau d'inventaire ; les légendes retiennent la famille et la
fonction du support, sans prétendre à une correspondance dimensionnelle
exhaustive. Le quatrième support, pour les vis restant sur ligne, n'est
montré qu'en CAO dans la source ; il n'est pas intégré comme fabrication.

Les photographies conservent leurs contours, poignées et compartiments.
Les légendes « Conçu » et « Fabriqué » restent distinctes. Aucune pièce ni
inscription n'est ajoutée aux photos.

### Trame orale, état par état

0. **Photo commune.** « Voici une réalisation concrète du chantier :
   un support compartimenté pour la visserie commune. Chaque famille de
   pièces peut avoir une place définie. »
1. **CAO commune.** « Le modèle permet d'expliquer la logique de cette
   organisation. L'inventaire des pièces nourrit la répartition des
   compartiments, puis cette conception devient un support fabriqué. »
2. **Boîte à brosses.** « La même logique est adaptée à la visserie de la
   boîte à brosses. Le modèle et la pièce réalisée rendent cette adaptation
   visible. »
3. **Descente.** « Un troisième support répond à la visserie de descente.
   Ces réalisations s'inscrivent dans une préparation et un rangement
   standardisés avant le changement de format. »

## 4. Standards — donner un repère au geste et à la décision

### Sources et portée

| Élément | Source | Fait retenu et limite |
| --- | --- | --- |
| Fiche NA014, montage bobine aluminium NOACK | Slide 29, `ppt/media/image56.emf` | Photos et commentaires : état de la bobine, serrage du mandrin et vis de blocage. Champs rédaction/approbation vides ; bas de l'extrait tronqué dans la source. |
| Construction du standard | Slide 29, texte natif | Connaissances terrain, étapes clés par machine, photographies, commentaires, fiche par opération. Ne prouve pas que toutes les équipes sont déjà formées. |
| Orientation qualité / maintenance | Slide 30, `ppt/media/image57.svg` | La nature du blocage détermine le relais ; la qualité informe le service qualité et le chef d'équipe avant analyse et traitement. |
| Checklist et chef d'équipe | Même logigramme | Checklist maintenance 10 min maximum ; si non résolu, information chef d'équipe, puis analyse 20 min maximum s'il est disponible. Sinon, appel direct maintenance. |
| Diagnostic et escalade | Même logigramme | Seuil de 3 h pour diagnostic et solution identifiée ; sinon responsables maintenance/production et suivi. Blocage total supérieur à 8 h : cellule de crise. |

Les seuils sont ceux de la procédure présentée, pas des durées de résolution
garanties ni des gains mesurés. Le détail graphique original comporte deux
raccordements ambigus : la branche de blocage non supérieur à 8 h rejoint
la reprise sans confirmation explicite de résolution ; la cellule de crise
rejoint directement « CDF terminé ». La synthèse retient les acteurs et
les seuils, sans reconstruire ces sorties ni ajouter une procédure approuvée.

Médias : `standard-na014.png`, `decision-left.png` et `decision-right.png`.
La fiche est présentée comme un extrait. Les deux vues de l'arbre restent
disponibles comme sources documentaires ; le récit présente une synthèse native
des acteurs et des seuils, plutôt que le logigramme entier.

### Trame orale, état par état

0. **NA014.** « Le standard transforme le savoir terrain en repères
   visuels. Sur cet exemple de montage de bobine aluminium, les photos
   montrent les points à vérifier et les éléments de serrage. »
1. **Orientation.** « Face à un blocage, le premier choix est sa nature :
   qualité ou maintenance. La branche qualité mobilise les interlocuteurs
   concernés ; la branche maintenance commence par une checklist, puis
   prévoit un relais vers le chef d'équipe ou le technicien. »
2. **Escalade.** « Le logigramme fixe ensuite des seuils pour élargir la
   prise en charge : trois heures pour le diagnostic et la solution,
   puis une cellule de crise si le blocage total dépasse huit heures.
   Ce sont des repères de décision pour organiser les relais. »

## 5. Impact — présenter l'essai et organiser le suivi

### Sources et portée

| Mesure ou document | Source | Valeur et limite |
| --- | --- | --- |
| Durée totale du test | Slide 33, `ppt/media/image59.png` | 655 min = 10 h 55. L'affichage 10,92 h est un arrondi décimal. |
| Cible du chantier | Slides 13 et 33 | 12 h = 720 min, objectif et non résultat initial. |
| Écart test / cible | Calcul 720 − 655 | 65 min = 1 h 05 sous la cible. Ce n'est pas une réduction mesurée par rapport à la situation initiale. |
| Charges visibles dans le bandeau | Même image 59 | BOB 553 min, BOBINETTE 520 min, une colonne non identifiée de 202 min. Ne pas sommer les charges pour reconstruire la durée d'arrêt. |
| Fiches BOB / BOBINETTE | Slide 34, images 61 / 62 | Objectif, temps réel, équipes, explication si le réel dépasse l'objectif de plus de 10 min. Les champs de mesure sont vierges. |

Le test est présenté comme un essai, sans effectif de répétitions ni série
temporelle. La définition et la comparabilité des 17 h du cadrage et des
16 h observées restent indéterminées : aucun pourcentage de réduction
avant/après n'est affiché. Aucun gain de TRS, économie financière ou gain
généralisé à tous les formats n'est déduit de ce fichier. Le couple de
produits et les bornes de chronométrage du test final ne sont pas précisés.

Médias : `test-result-source.png`, `followup-bob.png` et
`followup-bobinette.png`. Le bandeau de résultat conserve son format de
document très horizontal ; le détail CDF peut être agrandi sans le déformer.
Les fiches sont des outils de suivi, pas des relevés après déploiement.
Le graphique test/cible possède un axe commun partant de zéro ; il ne
simule ni une évolution dans le temps ni une dispersion non documentée.

### Trame orale, état par état

0. **Test.** « Le test terrain présenté atteint 655 minutes, soit
   dix heures cinquante-cinq. »
1. **Comparaison à la cible.** « La cible du chantier était de douze
   heures. Le résultat de cet essai se situe en dessous. »
2. **Marge.** « L'écart à cette cible est d'une heure cinq. C'est le
   résultat concret que ce test permet de présenter. »
3. **Suivi.** « Les fiches BOB et BOBINETTE sont prévues pour consigner
   les prochains changements : objectif, temps réel, équipe et explication
   des écarts. Elles donnent un cadre pour suivre les résultats dans le
   temps et poursuivre l'amélioration. »

Les formulations attribuent au chantier ce que le PowerPoint documente.
Lors de la soutenance, adapter les pronoms à la contribution personnelle
réelle de l'auteur, en particulier pour la conception, la fabrication et
la décision collective.
