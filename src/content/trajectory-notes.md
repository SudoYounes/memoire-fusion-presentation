# Slide 10 — Préparation de la trajectoire

## Parcours oral

La slide comporte six cartes, vue d’ensemble comprise. La cible, la validation et la transmission conservent leurs commentaires successifs à droite. La seconde vue de géométrie montre uniquement le robot, son passage et un titre à chacun des trois temps. La temporisation affiche un seul graphique réunissant position, vitesse et accélération de J1, sans panneau de commentaire ni fenêtre de limites dynamiques. La molette, Espace ou les flèches avancent dans les temps de lecture, puis ouvrent la carte suivante. Le retour arrière suit le même parcours en sens inverse.

Les trois blocs supérieurs restent fixes. Un clic sur un bloc reprend sa première carte, au premier temps. La figure reste en place pendant la lecture d’une carte et met en évidence l’élément commenté. Dans la seconde vue de géométrie, le récit sélectionne successivement les poses B, C et D, avec une caméra fixe et les titres « Dégager la charge côté prise », « Pivoter à hauteur », puis « Rejoindre la destination ». Aucun commentaire ne défile automatiquement. Le graphique de temporisation s’affiche en un seul temps, puis la navigation passe directement à la validation. Après la transmission, elle ouvre la slide consacrée à l’exécution.

### Vue d’ensemble

« L’orchestrateur a choisi une cible. Il faut maintenant construire un mouvement que notre robot puisse exécuter. Nous séparons trois responsabilités : définir le passage, lui donner une durée, puis le vérifier dans la scène. Pour les expliquer, je vais suivre un même exemple : le transfert chargé du carton 9, depuis le convoyeur vers la troisième couche de la palette. Les repères A, B, C et D resteront les mêmes sur le robot et sur les courbes. »

### 1 — Résoudre la cible

« Le repère rouge représente la cible de la sortie J4 dans le repère monde. Notre solveur de cinématique inverse, dans analytic_ik.py, transforme cette position et le lacet demandé en quatre angles articulaires. On peut les relier directement aux articulations repérées sur le modèle. La somme de q₂ et q₃ vaut ici 90 degrés : l’outil reste horizontal. Et q₄ compense la rotation de q₁ pour conserver le lacet demandé. Nous avons donc une configuration d’arrivée, mais pas encore un passage pour la rejoindre. »

Trois commentaires : cible et coordonnées, puis calcul des angles, puis orientation conservée. Avancer seulement après avoir terminé l’idée en cours. Le repère cible et les articulations s’éclairent au moment correspondant. Il n’est pas nécessaire de lire toutes les valeurs.

### 2 — Organiser le passage

« Voici maintenant le passage prévu pour cette même sortie J4. De A à B, on élève la charge côté prise pour atteindre une posture de dégagement. De B à C, le robot effectue sa rotation principale en gardant la sortie J4 à une hauteur proche de 1,49 mètre. Enfin, de C à D, il approche la destination avec environ 40 millimètres de descente finale. Ces points intermédiaires traduisent notre stratégie de passage. Ils ne suffisent pas à prouver que la trajectoire est sans collision : cette vérification intervient ensuite. »

Trois titres successifs accompagnent l’élévation A–B, la rotation B–C, puis l’approche C–D. À chaque avance, le segment concerné devient rouge vif et la pose correspondante apparaît avec la même caméra. Aucun panneau explicatif ni sélecteur de pose ne s’affiche dans cette carte. Le tracé représente le passage de la sortie J4, pas celui du centre du carton. Les images sont des reconstructions du modèle de simulation et de la cellule nominale, pas des captures Gazebo ni une mesure du mouvement réel.

### 3 — Raccorder les mouvements dans le temps

« Nous retrouvons les mêmes repères, maintenant sur une échelle de temps. Pour rester lisible, cette vue montre un seul axe : J1, celui qui fait pivoter le robot. Sa position change surtout entre B et C, au moment du transfert latéral. Notre constructeur, dans multi_carton_core.py, utilise des polynômes quintiques pour relier les configurations. La courbe de vitesse montre l’accélération puis le ralentissement de la rotation. Dans cet exemple, les jonctions B et C imposent un arrêt : vitesse et accélération y sont nulles. La position, la vitesse et l’accélération restent continues aux raccords. »

Un seul affichage présente les trois courbes de J1 et les repères A–B–C–D. Toutes les courbes restent lisibles ensemble, avec les anneaux qui repèrent les vitesses et accélérations nulles en B et C. Le graphique utilise toujours les 256 échantillons planifiés. Les autres articulations évoluent pendant les portions où J1 bouge peu : une courbe J1 plate ne signifie pas que tout le robot est immobile.

### 4 — Vérifier dans la scène

Deux commentaires : le contenu de la scène, puis le verdict et sa portée. Les échantillons du passage deviennent le point d’attention au second commentaire.

« Avant d’envoyer la trajectoire, MoveIt vérifie les états échantillonnés dans la scène actualisée, avec le carton attaché au robot et les cartons déjà déposés. Ici, les 256 états de la commande passent le contrôle. Ce résultat porte sur les échantillons vérifiés. Il ne constitue pas une preuve continue d’absence de collision entre deux échantillons, ni une qualification globale de la cellule. Si le contrôle échoue, la trajectoire n’est pas envoyée. »

### 5 — Transmettre la consigne

Deux commentaires : le contenu du message horodaté, puis sa transmission vers JTC.

« La sortie est une RobotTrajectory contenant les positions, les vitesses, les accélérations et leur calendrier. Le tableau reprend les quatre repères pour expliquer la structure du message ; celui-ci contient aussi les points intermédiaires. L’action execute_trajectory transmet ensuite la consigne vers le contrôleur JTC, le JointTrajectoryController. Nous avons préparé et vérifié une référence de mouvement. Le suivi par le contrôleur et la réponse physique du simulateur sont l’étape suivante. »

## Précisions pour les questions du jury

- Le constructeur possède des composites avec raccords et des composites avec arrêts imposés. La figure présente le second cas, attesté par le schéma `robot2.stopped-quintic-composite.v1`. Ne pas décrire cette courbe comme un mouvement traversant les deux jonctions à vitesse non nulle.
- Les limites contrôlées sont celles du modèle de simulation. Dans cet exemple : vitesse maximale normalisée ≈ 73,46 %, accélération ≈ 99,07 %, jerk ≈ 99,13 %. Ces chiffres portent sur cette trajectoire, pas sur l’ensemble de la campagne. Le facteur d’étirement final vaut 1 pour cette commande, après sa construction.
- Les jonctions internes sont à 1,86 s et 4,19 s. Le mouvement se termine en D à 5,055 s, suivi d’un maintien de 0,10 s. Les courbes couvrent la commande complète de 5,155 s.
- La sortie J4 est le repère contractuel utilisé ici. Ne pas la présenter comme un TCP industriel étalonné. L’IK et le modèle sont ceux du simulateur de commissioning.
- MoveIt valide ici le corridor construit par le programme. La slide n’attribue pas à OMPL la génération de cette trajectoire.
- Le contrôle discret présenté utilise `/check_state_validity`. Le constructeur recalcule également les limites dynamiques après la projection de q₂/q₃, avant l’exécution.
- Le résultat global du run reste `HOLD_COMPLETE_CELL_10S_GATE`. Le carton 9 a un statut PASS, mais cela ne transforme pas la campagne entière en qualification industrielle.

## Provenance des figures

Source locale en lecture seule : `/Users/macair/Documents/robot2-cad`.

- Campagne : `sim/artifacts/multi_carton_campaigns_v2/campaign-12s-qualification-20260910-v6`.
- Séquence 4 : `batch-04-87e66463-dc6a-4adf-84bf-652b67ef223d`.
- Étape : `composite_loaded_lift_transfer_9`.
- Les 256 lignes de `planned_trajectory.csv` fournissent temps, positions, vitesses et accélérations. Le tracé du passage et les courbes utilisent tous les échantillons, sans lissage inventé.
- `moveit_result.json` fournit le nombre d’états vérifiés, le statut du contrôle, les jonctions et les limites dynamiques.
- La hauteur J4 suit les transformations de `ConstrainedDynamicsModel.frames()` dans `sim/ros_nodes/constrained_dynamics.py`. Les constantes proviennent de `sim/robot_description/robot2_constrained_dynamics.json`, dont le SHA-256 est identique à celui du manifeste de campagne.
- Les chemins, les empreintes SHA-256 et les données extraites sont conservés dans `trajectoryEvidence.ts` et `trajectoryPlateData.ts`.
- Les poses A–B–C–D utilisent les primitives visuelles et les transformations de `sim/robot_description/robot2_indexed.urdf`. Les positions J4 du rendu ont été comparées à la cinématique du modèle pour les quatre configurations, avec une tolérance de 10⁻⁸ m.
- Les quatre rendus partagent la même caméra orthographique. Les annotations SVG sont projetées avec cette caméra, pas placées approximativement sur l’image. Le convoyeur, la palette, les huit cartons déjà déposés et la charge sont reconstruits aux positions nominales de cet exemple ; il ne s’agit pas d’une capture de l’état observé.
- Les images `public/media/trajectory/pose-A.png` à `pose-D.png` représentent le modèle URDF simplifié, pas la CAO mécanique complète. Les couleurs ont été harmonisées pour la lecture.

Formule de reconstruction : a = q₂ + décalage de zéro, b = a + q₃. z(J4) = z(base) + z(épaule) − L₁ sin(a) − L₂ sin(b) + [z(poignet) + z(face J4)] cos(b).

Sources logicielles : `analytic_ik.py`, `multi_carton_cycle.py::execute_composite_constrained()`, `multi_carton_core.py::build_stopped_quintic_composite()`, `build_blended_quintic_composite()`, `trajectory_dynamic_scale()` et `execute_scenario.py`.

Source narrative : `robot2-rapport/memoire-fusion-ensam/chapitres/robot/09-multicouche.tex`.
