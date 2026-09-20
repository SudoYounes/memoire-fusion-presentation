# Slide 15 — Résultats de simulation

## Transition depuis la commande et la physique

« Nous avons vu comment une trajectoire devient un mouvement simulé, puis
comment les retours permettent de le suivre. Regardons maintenant les résultats
obtenus sur la campagne complète. »

## 1. Résultat d’ensemble

« Nous avons exécuté neuf séquences de douze cartons. Les 108 cycles ont été
acceptés selon les critères de la campagne. Chaque ligne à droite correspond à
une séquence, et chaque point à un carton.

La vue Gazebo illustre la palettisation multicouche. Les chiffres viennent des
enregistrements de la campagne v6, et non de cette capture documentaire.

Il faut préciser le périmètre : les neuf séquences sont distinctes. Les huit
réinitialisations entre séquences sont déclarées et exclues des durées de cycle.
Nous ne revendiquons donc pas un flux continu de 108 cartons. »

Repère visuel : le total 108 / 108, puis une ligne de douze points.

## 2. Cadence obtenue

« Ici, chaque point représente le temps simulé nécessaire pour un carton. La
ligne rouge fixe le seuil à douze secondes. Les séparations verticales marquent
les changements de séquence. Nous ne relions pas les courbes entre séquences.

Les 108 durées restent sous le seuil. La moyenne est de 10,556 secondes, mais le
point important pour notre exigence est le cycle le plus lent : 11,526 secondes,
pour le carton 9 de la séquence 4. C’est le transfert utilisé dans nos vues
détaillées de trajectoire et de commande.

La marge minimale observée vaut donc 0,474 seconde. Ce résultat porte sur cette
campagne simulée. Il ne garantit pas une marge identique face à toutes les
variations d’une future installation. »

Repère visuel : seuil rouge, point champagne, maximum, puis marge. Les courbes
représentent l’ordre des cartons, pas le temps cumulé de toute la campagne.

Si le jury demande l’objectif à dix secondes : il s’agit d’un objectif
d’optimisation distinct, non obligatoire et non atteint sur toute la campagne.
Le critère d’acceptation présenté ici est bien de douze secondes par carton.

## 3. Qualité de dépose et comportement

« Le respect du temps de cycle doit s’accompagner du respect des critères de
dépose et de comportement.

Nous allons regarder trois choses sur le carton : sa position, son orientation,
puis sa hauteur. À chaque fois, la ligne éclairée à droite rappelle le maximum
enregistré et son seuil. Les cas présentés sont distincts. »

### 3a. Position XY — séquence 8, carton 6

« La vue de dessus replace le carton dans sa couche. Le contour pointillé est
sa cible ; le turquoise correspond à sa pose enregistrée. Les autres contours
ne sont pas des mesures : ils situent les trois autres emplacements.

Le détail agrandit les centres seize fois par rapport à la vue de gauche. Leur
distance est de 14,492 millimètres, pour un seuil de 25 millimètres. C’est le plus
grand décalage XY des 108 cycles, pas un exemple choisi parce qu’il est favorable. »

Repère : carton C6 → zone agrandie → cote → ligne Position XY.

### 3b. Orientation — séquence 1, carton 6

« Regardons maintenant si le carton est tourné par rapport à sa cible. Pour
isoler ce défaut, le détail superpose les centres et compare un coin du carton.
L’angle n’est pas amplifié : nous agrandissons seulement la zone observée.

L’écart maximal est de 0,985 degré, sous le seuil de 2 degrés. Ce carton vient
de la séquence 1 : ce n’est pas le même cas que le maximum XY. »

Repère : arêtes cible et observée dans le détail → ligne Orientation.

### 3c. Hauteur — séquence 4, carton 12

« Passons en vue de côté. Le carton 12 se dépose sur le carton 8, en troisième
couche. Nous comparons la hauteur de son centre à la hauteur cible :
1 199,879 millimètres observés, contre 1 205 millimètres attendus.

La différence vaut 5,121 millimètres, sous le seuil de 15 millimètres. Attention :
il s’agit d’un écart à la cible, pas d’un enfoncement de cinq millimètres dans le
carton support. La cible comporte une marge de pose de cinq millimètres. »

Repère : C12 et son support → niveaux des centres → cote → ligne Hauteur Z.
La projection montre les hauteurs ; elle ne prétend pas restituer les décalages
latéraux dans cette vue de côté.

### 3d. Pendant le mouvement

« Enfin, la qualité ne se limite pas à la pose finale. Le premier graphe montre,
pour chaque carton, le plus grand écart de la somme q2 plus q3 à 90 degrés.
Le maximum de la campagne est de 0,805 degré, sous le critère de 1 degré.

Le second graphe reprend la plus longue plage de saturation contiguë de chaque
cycle. Le maximum est de 10 millisecondes, sous le seuil de 50 millisecondes.

Ces points sont des maxima par cycle, pas des signaux instantanés. Chaque
critère retient son propre cas maximal ; ils ne sont pas nécessairement
atteints simultanément. »

Repère : graphe horizontalité → graphe saturation. Les barres à droite expriment
la part du seuil de chaque critère, pas une unité commune.

Pilotage : flèches du clavier, molette ou boutons du bas. Les lignes de résultats
sont aussi cliquables. Aucun avancement automatique pendant l’oral.

## Conclusion orale

« Sur ce périmètre simulé, les neuf séquences respectent à la fois le temps de
cycle demandé et les critères de qualité retenus. La validation de la machine
réelle, de sa sécurité et de sa performance sur site reste à établir. »

## Sources

- `sim/audit/2026-09-10/12s-campaign-v6-result.json` : 108 cycles acceptés, 9 séquences, 8 réinitialisations et périmètre du verdict.
- `sim/audit/2026-09-10/12s-baseline-analytics-v6.json` : synthèse gelée des durées et maxima.
- `sim/artifacts/baseline_analytics_multilayer_12s_v6/campaign_cycle_metrics.csv` : les 108 observations.
- `sim/scenarios/horizontal_indexed_multi_carton.json` : critères de placement, d’horizontalité observée et de saturation.
- Résultats `placement_evidence` des séquences 8/carton 6, 1/carton 6 et 4/carton 12 : cas maximaux XY, orientation et hauteur, avec poses et supports enregistrés.
- `sim/config/multilayer_pallet.json` : dimensions des cartons et de la palette, emplacements des couches.
- `public/media/multilayer-02.png` : capture documentaire préexistante, distincte des données v6.
