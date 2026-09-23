# Slide 12 — Un cycle piloté par les confirmations

## Intention et lecture

Un seul graphe reste visible pendant huit temps de présentation. Il synthétise
le cycle multicartons ; il ne reproduit ni chaque appel Python ni chaque message ROS.
Le cycle principal se lit en haut de gauche à droite, puis le retour se lit en bas
de droite à gauche. Les barres « ET » montrent le recouvrement et sa synchronisation.
Les nœuds restent à leur place : seules la phase concernée et ses connexions
s’éclairent. Le champagne situe l’action ; le rouge suit les commandes et les
confirmations. Un passage lumineux rappelle le sens de circulation, sans changer
automatiquement de phase.

Le recouvrement représenté concerne les changements de présentation : l’indexeur
n’est pas déplacé à chaque carton. Sans changement, la présentation déjà confirmée
reste valable. Le graphe est une synthèse fonctionnelle, pas un chronogramme.

## Conduite

- Scroll, flèches clavier ou espace : un temps à la fois, piloté par le présentateur.
- Les nœuds sont cliquables et accessibles avec Tab puis Entrée/Espace.
- « Vue globale » rétablit le graphe en retrait, sans phase privilégiée.
- Après le huitième temps, le clavier/scroll passe à la slide suivante.
- Le retour depuis la slide suivante reprend la boucle finale.
- En mouvement réduit, l’éclairage est fixe et les passages lumineux sont supprimés.
- Sur mobile, le graphe se parcourt horizontalement ; les boutons recadrent la phase.
- L’impression restitue un seul graphe. Capture d’une phase :
  `?capture=indexeur&orch=5#indexeur` (indice entre 0 et 7).

## Script oral — environ trois à quatre minutes

### 01 / 08 — Vue d’ensemble

« Nous disposons maintenant d’une pose exploitable du carton. L’orchestration
transforme cette information en un cycle complet. Notre programme MultiCartonCycle,
écrit en Python avec rclpy, coordonne les échanges ROS 2. En haut, nous suivons
le carton jusqu’à sa dépose. En bas, nous préparons la suite : le retour du robot
peut recouvrir l’indexation de la palette. Le point essentiel est que les phases
n’avancent pas sur la seule émission d’une commande : elles attendent des confirmations. »

Repère : parcourir la boucle complète, sans détailler encore les blocs.

### 02 / 08 — Préparer

« Le programme relie la pose admise par la perception à une destination cohérente.
Cette destination doit être libre, avec le support requis ; le passage à une
couche supérieure exige que la couche précédente soit complète. Nous utilisons
la mémoire des déposes validées pour choisir cet emplacement. La bonne rangée
doit également être présentée et acquittée avant l’attachement du carton. »

Repère : entrée “pose admise” → choix de destination.
À citer si nécessaire : `next_supported_slot()`, `layer_transition_evidence()`,
contrat `multilayer_pallet.json`.

### 03 / 08 — Prendre

« À la pose de prise, nous attendons le vide puis l’acquittement de l’attachement
physique. Ensuite seulement, nous libérons le maintien au poste d’alimentation.
Le carton est maintenant pris dans Gazebo ; nous devons aussi le représenter
comme une charge attachée dans MoveIt. Ces deux états doivent être cohérents
avant le transfert chargé. »

Repère : flèche cible/rangée → prise confirmée ; miroir Gazebo–MoveIt dans le bloc.
À citer si nécessaire : `attach_active_carton_at_pick()`,
`apply_payload_attachment(True)`, phase `LOADED_PRODUCT`.

### 04 / 08 — Transférer

« L’orchestrateur fournit la destination, le cas de charge et les points de passage.
Notre programme construit les corridors ; MoveIt vérifie les états contre la scène
actualisée. Les cartons déjà déposés deviennent donc des contraintes pour les
passages suivants. Pendant l’exécution, nous suivons le résultat de l’action et
les états articulaires. Terminer le mouvement ne valide pas encore la dépose. »

Repère : charge attachée → transfert ; la fin du mouvement mène à une vérification.
À citer si nécessaire : `execute_composite_constrained()`, `/check_state_validity`,
`/execute_trajectory`, `/joint_states`.
Ne pas attribuer la création des corridors v6 à une recherche générale de MoveIt.

### 05 / 08 — Déposer

« Nous attendons une stabilisation mesurée avant de libérer le carton. Le
détachement doit être confirmé et répercuté dans MoveIt. Ensuite, de nouvelles
observations de pose et de contacts vérifient la dépose et son support. Après
cette validation seulement, l’emplacement devient occupé dans la mémoire du
cycle. Ce résultat physique prépare les décisions suivantes. »

Repère : validation de dépose → mémoire actualisée, à côté de la liaison descendante.
À citer si nécessaire : `wait_for_release_settle()`, `verify_placement()`,
`occupied_ids.append(slot.slot_id)`.

### 06 / 08 — Recouvrir le retour et l’indexation

« Lorsqu’il faut changer la présentation de la palette, nous pouvons indexer
pendant une partie du retour à vide. Le retour est d’abord vérifié contre le
volume balayé de la palette chargée. Pendant l’exécution, la hauteur J4 est
reconstruite à partir des articulations mesurées. Une fois le dégagement acquis,
les deux branches peuvent avancer : le robot poursuit son retour et le contrôleur
d’indexeur présente la prochaine rangée. Ce parallélisme est conditionné,
pas systématique. »

Repère : dégagement J4 → barre de séparation → les deux branches éclairées ensemble.
À citer si nécessaire : `parallel_indexer_runtime_guard()`,
`PalletIndexerController`, `pose_command` ; marge du volume balayé : 10 mm.
La masse attendue est calculée à partir du nombre de cartons, pas pesée.
Dans le profil composite_10s, la prise du carton suivant est préparée avant
le retour vide ; ce prétraitement n’est pas une branche parallèle supplémentaire
dans ce schéma de synthèse.

### 07 / 08 — Synchroniser

« Les deux branches doivent fournir leurs confirmations. Le retour doit être
terminé ; la présentation de la palette doit être acquittée, avec une mesure
récente, un axe stabilisé et une scène cohérente. Les cartons déjà déposés doivent
avoir suivi la palette, et MoveIt doit être à jour. S’il manque une confirmation,
le programme attend dans le délai prévu. Un défaut ou un délai dépassé bloque
la progression. Nous n’autorisons pas le carton suivant sur une simple temporisation. »

Repère : les deux retours rouges → barre de synchronisation → autorisation.
En complément : erreur indexeur ≤ 2 mm, vitesse ≤ 0,01 m/s, état direct ≤ 0,5 s.
Pendant le recouvrement, la réponse prévue en cas de défaut arrête le robot ;
seul le profil indexeur déjà validé peut s’achever. Ce n’est pas une qualification
de sécurité fonctionnelle.

### 08 / 08 — Boucler et tracer

« La boucle revient au choix du carton suivant, avec un état de palette mis à jour.
Nous répétons ce principe jusqu’aux douze déposes validées. Les phases publiées
sur ROS 2 sont enregistrées pour reconstituer les actions et les attentes.
L’orchestration fait donc le lien entre l’observation, la décision et la preuve
que l’action a effectivement abouti. »

Repère : boucle rouge vers la destination, sans déplacer le graphe.
À citer si nécessaire : `publish_task_phase()` → ROS 2 → rosbag.
Transition : « Voyons maintenant les résultats de la campagne de simulation. »

## Résultats à réserver à la partie qualification

Campagne v6 : 108 cycles analysés, 45 interverrouillages d’indexeur acquittés,
0,427 s d’attente résiduelle maximale après recouvrement. Les 45 interverrouillages
correspondent à 9 séquences × 5 changements de présentation.
Ces résultats concernent le commissioning simulé, sans crédit de sécurité fonctionnelle.

## Sources de vérité — lecture seule

Racine : `/Users/macair/Documents/robot2-cad`.

- `sim/ros_nodes/multi_carton_cycle.py` : `run()`, `prepare_pick_ready()`,
  `attach_active_carton_at_pick()`, `execute_composite_constrained()`,
  `wait_for_release_settle()`, `verify_placement()`,
  `parallel_indexer_runtime_guard()`, `finish_parallel_indexer_motion()`.
- `sim/ros_nodes/multilayer_pallet.py` : `next_supported_slot()`,
  `layer_transition_evidence()`.
- `sim/ros_nodes/execute_scenario.py` : ROS 2 / rclpy, actions MoveIt,
  `apply_payload_attachment()`, `publish_task_phase()`.
- `sim/ros_nodes/pallet_indexer_controller.py` : `PalletIndexerController`.
- `sim/config/multilayer_pallet.json` : destinations et profils d’indexeur.
- `robot2-rapport/memoire-fusion-ensam/chapitres/robot/09-multicouche.tex` : bilan v6.
