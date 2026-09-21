# Mise en œuvre des solutions d’amélioration

Cette diapositive rassemble les quatre leviers des slides 25 à 30 de
`Soutenance de stage_VIATRIS.pptx`. Les documents constituent le contenu
principal. Les quatre blocs restent visibles à gauche pendant leur lecture.

## Mémoire de composition et de navigation

- Fond gris clair, typographies Inter et Libertinus du deck, accent gold.
- Sur le bureau, le rail commence à 1,3 unité de slide du bord gauche.
  Il occupe 22,5 parts de l'espace utile, la fenêtre 74,5 parts, avec un
  intervalle de 3 %. Le titre conserve l'alignement historique à 5,6 unités.
- Une seule grande fenêtre affiche la preuve correspondant au bloc actif.
  Les quatre entrées forment une chaîne verticale et restent à leur place.
- Le bloc actif reçoit un balayage lumineux horizontal gold. La fenêtre
  entre depuis la hauteur du bloc lors d'un changement de solution ; les
  vues d'une même solution s'enchaînent par un déplacement court.
- Haut/Bas pilote les quinze états. Le clic sur un bloc rejoint sa première
  vue. Les petites commandes de bas de page suivent le même parcours.
- Le dernier état précède la diapositive suivante ; le retour arrière
  reprend le parcours en sens inverse. Les états restent ceux du contrôleur
  SMED partagé. Aucune navigation parallèle n'est introduite.
- En portrait, les quatre blocs forment deux rangées compactes au-dessus
  de la fenêtre. Les tableaux et détails vectoriels gardent une largeur
  lisible et peuvent être parcourus horizontalement. Le mouvement réduit
  conserve les changements d'état sans les animations.

## Documents et positions dans le parcours

| États | Bloc actif | Document affiché | Source |
| --- | --- | --- | --- |
| 0–2 | Nouveau scénario opératoire | Tableau en trois vues, BOB 1–7, 8–14 et 15–20 | Slide 25, tableau OOXML |
| 3–5 | Organisation et identification de la visserie | Inventaire complet en trois vues, entrées 1–10, 11–20 et 21–30 | Slide 26, tableau OOXML |
| 6 | Même bloc | Support commun, CAO et photographie | Slide 27, images 49 et 50 |
| 7 | Même bloc | Support de visserie de la boîte à brosses, CAO et photographie | Slide 27, images 51 et 52 |
| 8 | Même bloc | Support de visserie de descente, CAO et photographie | Slide 27, images 53 et 54 |
| 9–10 | Support de formation des opérateurs | Fiche NA014 entière puis détail des points de contrôle et de montage | Slide 29, image 56 |
| 11–14 | Logigramme Système prise de décision | Vue complète puis trois détails successifs du même document | Slide 30, image 57 SVG |

## Fidélité des preuves et limites de lecture

Le scénario et l'inventaire sont des tableaux HTML éditables. Toutes les
lignes visibles des tableaux sources sont conservées dans leur ordre.
La casse, les accents et quelques fautes de saisie sont rétablis pour la
lecture. Les numéros d'opération, les alignements BOB/BOBINETTE, les cellules
vides et les durées restent associés à leurs lignes sources. Les colonnes
durée et « temps masqué » sont présentées à l'intérieur de la cellule du
troisième intervenant, sans suppression de valeur. La mention source
« Remise à 210°FC » reste littérale, son unité étant ambiguë.

Les deux opérations signalées en temps masqué sont le nettoyage du rouleau
par maintenance (5 min) et l'arrêt/chargement Linemaster par le chef
d'équipe (10 min). Le vide de ligne chef d'équipe + qualité demeure indiqué
à 25 min. Le tableau ne fournit pas une chronologie complète : ni gain net
de 15 min ni chemin critique ne sont déduits de ces lignes.

L'inventaire conserve ses 30 entrées. Les zones sont nommées sans répéter
« Zone » à chaque ligne. Les cases dimensions vides ne sont pas remplies.
La désignation PC4200 du tableau source reste visible, malgré les variantes
PC4250 et PC4000 présentes ailleurs dans le PowerPoint.

Les photographies et images CAO restent celles du PowerPoint. Elles
documentent trois supports fabriqués, sans démontrer le gain propre de
chacun ni une correspondance dimensionnelle exhaustive avec l'inventaire.
Le quatrième support montré uniquement en CAO n'est pas présenté comme
une fabrication photographiée. La slide 28 décrit l'organisation 6S et la
préparation, sans artefact visuel supplémentaire à recopier ici.

La fiche NA014 est déjà tronquée en bas dans la source. Le premier état
affiche tout cet extrait ; le second agrandit sa région y=204 à 583 sur
une image de 733 × 583 pixels. Les champs rédaction et approbation restent
visibles et vides. La fiche prouve la formalisation d'un geste, sans établir
que toutes les équipes sont formées.

Le nouveau média `public/media/smed/decision-source.svg` est une copie
binaire de `evidence/smed/source/ppt/media/image57.svg`, issu de la slide 30.
Dimensions : 8109,6035 × 4561,652 unités. Les vues SVG intégrées sont des
fenêtres sur cette image d'origine : aucun nœud ni raccordement n'est
redessiné. La vue générale retire uniquement les grandes marges blanches
extérieures. Les détails se recouvrent horizontalement pour retrouver les
connexions. Ils agrandissent la partie haute où se trouvent les décisions
commentées ; les longs retours vers « reprise » et « CDF terminé » restent
visibles dans la vue générale.
Une bande de lecture native sous chaque détail reprend les deux décisions
à commenter en grands caractères. Elle explicite la lecture des nœuds
sources sans modifier le SVG ni introduire une mesure supplémentaire.

Le logigramme distingue qualité et maintenance, puis checklist 10 min,
chef d'équipe 20 min s'il est disponible, relais maintenance, seuil 3 h
pour diagnostic/solution et cellule de crise au-delà de 8 h de blocage
total. Ces durées sont des seuils de décision. Les deux sorties ambiguës
de l'original restent inchangées : « non supérieur à 8 h » rejoint la
reprise, et la cellule de crise rejoint directement « CDF terminé ».
La lecture présente le document source sans transformer ces raccordements
en garantie de résolution ni en procédure corrigée et approuvée.

## Trame orale

### Nouveau scénario opératoire

« Voici le document qui organise le travail de BOB, de BOBINETTE et des
intervenants de support. Les premières lignes couvrent la fin de production
et les démontages. Le relais maintenance fait ensuite apparaître le
nettoyage du rouleau en temps masqué. Dans la dernière partie, le tableau
coordonne le nettoyage partagé, la préparation du coding et Linemaster,
puis conserve le vide de ligne du chef d'équipe et de la qualité. »

### Organisation et identification de la visserie

« L'inventaire décrit les pièces, leur zone, leur quantité et leur
destination. Il distingue notamment la laverie des éléments qui restent
sur ligne. Les supports donnent ensuite une place aux familles de pièces.
Pour chaque famille, le modèle CAO explique les compartiments et la photo
montre la réalisation : support commun, boîte à brosses, puis descente. »

### Support de formation des opérateurs

« La fiche de montage de la bobine aluminium est un exemple du support
de formation. En l'agrandissant, on retrouve les photos et les points de
vigilance : l'état de la bobine, le serrage du mandrin et la vis de blocage.
Le document donne un repère partagé pour transmettre le geste. »

### Logigramme Système prise de décision

« Le logigramme commence par la nature du blocage. La branche qualité
mobilise ses interlocuteurs ; la branche maintenance prévoit une checklist
et le relais du chef d'équipe s'il est disponible. Les détails suivants
montrent le passage à la maintenance, puis aux responsables, et enfin à
la cellule de crise selon la durée totale du blocage. »
