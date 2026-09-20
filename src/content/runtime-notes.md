# Slide 14 — Commande en effort et réponse simulée

## Parcours oral

La slide comporte une vue d’ensemble, puis cinq vues de détail. La troisième
partie du récit est séparée en deux vues : limites motrices, puis physique.
Molette, Espace et flèches permettent d’avancer. Un clic sur une fonction du
schéma reprend son explication. Le graphe conserve sa disposition dans les six vues.
Il n’y a pas de sous-étapes de lecture à l’intérieur des cartes : tous les commentaires
restent visibles. À l’apparition d’une carte, un balayage or champagne souligne une
seule fois son idée principale et sa conclusion ; le repère associé dans la figure
s’éclaire brièvement. Aucun balayage ne boucle, aucun contenu n’avance automatiquement.
Les animations sont désactivées en mouvement réduit et à l’impression.

### Vue d’ensemble

« À l’étape précédente, nous avons préparé et vérifié une trajectoire. Nous allons
maintenant regarder comment notre simulateur l’exécute. La consigne entre dans le
contrôleur. Sa correction rejoint un module d’effort que nous avons développé,
puis Gazebo et DART calculent la réponse physique. Les positions et vitesses
simulées reviennent au contrôle. Pour suivre cette boucle, je conserve le même
transfert chargé du carton 9. »

Montrer la chaîne vers la droite, puis la branche de retour vers JTC.
La courbe représente J1, l’axe d’azimut, pendant cette seule action.

### 1 — Corriger le suivi

« Le JointTrajectoryController, ou JTC, interpole la référence reçue et la compare
à l’état du robot simulé. Les deux courbes de position paraissent presque
confondues. L’agrandissement de l’erreur révèle pourtant les transitoires du suivi.
Le pic absolu de J1 atteint ici environ 12 milliradians. Le correcteur PID agit à
partir des écarts de position et de vitesse pour produire la correction d’effort.
Nous regardons un pic pendant le mouvement, pas une erreur finale de dépose. »

Montrer d’abord les deux courbes supérieures, puis celle de l’erreur. La ligne
verticale relie l’instant du maximum à la position du robot sur le même axe de temps.
Le signe retenu est référence moins retour. Ces traces décrivent la réponse de la
commande complète et ne permettent pas d’attribuer chaque transitoire à une cause
isolée, ni de séparer les contributions P, I et D.

### 2 — Construire l’effort

« La correction du contrôleur rejoint deux autres contributions. La compensation
gravitaire soutient les corps structurels du modèle série. En parallèle, notre
modèle dynamique fermé, calculé avec NumPy, utilise la référence du contrôleur
pour anticiper l’effort inertiel de l’accélération demandée. Sur ce graphe, nous
regardons la sortie motrice J2 couplée. La demande totale est la somme signée des
contributions. Elles peuvent donc s’ajouter ou se compenser selon la phase du
mouvement. »

Montrer la branche supérieure du schéma, puis les courbes. L’anticipation en ligne
correspond à M_c(q_ref) × q̈_ref. Le terme explicite de Coriolis n’y figure pas.
La compensation gravitaire du substitut série ne représente pas automatiquement
tout l’outillage et le carton. Le calcul NumPy fermé et le moteur DART ont des
fonctions et des modèles distincts.

### 3a — Appliquer les limites

« Les limites s’appliquent aux sorties motrices. Avec le couplage mécanique,
la demande de J2 moteur se calcule en retranchant le couple généralisé J3 de
celui de J2. Ici, à l’instant de demande maximale en valeur absolue, on obtient
environ −864 newton-mètres. La commande limitée reste identique : il n’y a pas
d’écrêtage moteur sur cet extrait. L’effort équivalent appliqué diffère ensuite,
car le module représente aussi la réaction d’inertie de la transmission.
La commande moteur et cette contribution physique restent distinctes. »

Le tableau montre un seul instant, t = 0,572 s, et toutes les valeurs sont dans
le même repère d’actionneur u₂. L’effort équivalent appliqué vaut ici −871,497 N·m,
avec une réaction d’inertie de +7,706 N·m soustraite à la commande limitée et un
frein passif nul. Le module reconvertit ensuite les efforts dans les coordonnées
articulaires pour Gazebo. Ne pas conclure à l’absence de saturation sur les autres
actions ou sur toute la campagne.

### 3b — Faire évoluer la physique

« Cette capture situe les corps articulés et les objets de la cellule. Le module
transmet les efforts aux articulations à travers JointForceCmd. Le moteur DART
fait évoluer le modèle en tenant compte des masses, des inerties, de la gravité
et des contacts. Il produit les nouveaux états de position et de vitesse qui
reviennent dans la boucle. Le modèle exécuté ici est un substitut série à quatre
axes, avec les hypothèses et les limites déclarées pour la simulation. »

La capture Gazebo est documentaire et ne correspond pas à un instant identifié
du transfert tracé. Elle ne démontre ni une force de contact mesurée, ni une
performance du robot réel. La géométrie visible ne ferme pas explicitement les
bielles comme dans le modèle dynamique analytique.

### 4 — Fermer la boucle

« Les retours ont trois usages. Les positions et vitesses alimentent le suivi
dans JTC. Les résultats d’action et les confirmations de la cellule alimentent
l’orchestrateur, qui vérifie les conditions avant de poursuivre. Enfin, les flux
horodatés conservent la référence, la réponse et les efforts. Nous pouvons alors
analyser ce qui s’est réellement passé dans le simulateur. C’est la fonction du
bloc suivant : lire les résultats de la campagne, en cadence comme en qualité. »

Le résultat d’action ne remplace pas les conditions de libération ou les contrôles
de cellule. La slide suivante présente les résultats des neuf séquences de la campagne v6.

## Sources

Les notations de cette slide sont composées en LaTeX puis précompilées en tracés
SVG autonomes. Les sources sont dans `scripts/math/generate-runtime.mjs` et les
valeurs numériques viennent des mêmes traces que les figures. Après une modification,
`npm run math:generate` régénère les formules et `npm run math:check` vérifie leur
cohérence. Le lecteur n’a besoin ni de MathJax, ni d’une police mathématique externe.
Les descriptions accessibles des formules restent présentes dans les SVG.

- `sim/config/controllers.yaml` : interface effort, retours position/vitesse, gains et paramètres JTC.
- `sim/config/moveit_controllers.yaml` : action `FollowJointTrajectory`.
- `sim/ros_nodes/multi_carton_cycle.py::_on_controller_state()` : anticipation inertielle à partir de la référence interpolée, avec un repli préprogrammé si elle est incomplète.
- `sim/ros_nodes/constrained_dynamics.py` : modèle dynamique fermé NumPy.
- `sim/src/effort_plant_system.cpp::read()` et `write()` : états, assemblage des termes, conversion actionneur, limites, réaction d’inertie et `JointForceCmd`.
- Campagne v6, séquence 4, `composite_loaded_lift_transfer_9` : `controller_state.csv` et `effort_plant_control_terms.csv`.
- `public/media/multilayer-03.png` : capture documentaire Gazebo préexistante du mémoire.

Les empreintes, identités et méthodes d’extraction sont consignées dans
`evidence/runtime/README.md` et `src/content/runtimeEvidence.ts`.
