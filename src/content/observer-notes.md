# Observer — notes de présentation

## Fil de parole

1. « Ici, ce sont les images de notre caméra Gazebo, pas un dessin du carton ni sa pose exacte prélevée dans le moteur physique. » La vue couleur situe le carton au poste de prise. Le cadre pointillé indique uniquement le détail agrandi.
2. Dans la zone de prise déclarée, les pixels bruns fournissent une population de profondeurs. Sa médiane initialise une bande de ±3 mm : on récupère alors le dessus, y compris les pixels que l’ombre écarte de la sélection couleur.
3. Le masque turquoise est calculé sur la profondeur réelle. Le centre image est le milieu des bornes du masque ; la direction principale est calculée par PCA sur les mêmes pixels. Le lacet d’un rectangle demeure ambigu à 180°.
4. Les intrinsèques caméra et la profondeur permettent la projection métrique. La transformation caméra-cellule est déclarée dans le scénario. On soustrait la demi-hauteur du carton à sa surface supérieure pour donner son centre, et non la pose de J4 ou de l’outil.
5. Ce calcul fournit une estimation. Le superviseur doit encore vérifier présence, validité, fraîcheur et association au carton courant. Les quatre contrôles affichés sont des conditions du fonctionnement, pas le verdict de cette capture d’illustration.
6. Si les contrôles passent, la pose alimente la cible de prise et l’objet de collision MoveIt. Le transport chargé impose ensuite d’autres conditions, dont les trois zones de vide et l’acquittement de l’attache physique.

## Manipulation pendant la soutenance

Les quatre étapes restent **Capter → Isoler → Projeter → Autoriser**. La dernière se présente désormais contrôle par contrôle : **A — Présence → B — Validité → C — Fraîcheur → D — Association → Pose acceptée**. Le slide comporte donc huit temps pilotés, sans avance automatique.

Un geste de molette, une flèche ou Espace avance d’un temps ; le sens inverse permet de revenir. À l’arrivée sur « Autoriser », A reçoit un balayage lumineux horizontal. Le temps suivant arrête A et active B, puis C et D. Au dernier temps, les quatre lignes retrouvent le même aspect et la décision conditionnelle prend le focus. Le balayage indique seulement le point présenté, jamais un résultat de contrôle simulé.

Les quatre repères d’étape et les lignes A–D sont cliquables. Le repère « Autoriser » rejoint A ; la molette fonctionne aussi au-dessus des captures. Après « Pose acceptée », l’avance suivante quitte le slide. Le retour depuis Décider reprend au dernier temps. Sur mobile, en mode capture, avec motion=off ou la préférence de mouvement réduit, tout reste visible sans balayage.

Pour « Projeter », suivre la ligne de gauche : pixels et profondeur → projection par les intrinsèques K⁻¹ → transformation caméra-cellule. Puis lire les quatre colonnes X, Y, Z et θ à droite. La note Z rappelle le retrait de la demi-hauteur ; la note PCA rappelle l’origine de l’orientation.

Le bouton « Couleur » remplace uniquement la profondeur en fausses couleurs du détail de droite. Le masque, le centre et l’axe restent au même endroit. Revenir sur « Profondeur » permet de montrer que le dessus est extrait du canal métrique. Aucun changement de scène entre ces deux vues : elles partagent exactement le même horodatage.

## Observation montrée

- Acquisition HD dédiée à l’illustration : 1920 × 1440, contre 640 × 480 dans le monde source.
- Même caméra, même champ de vision, même position, mêmes objets et même physique ; seule la définition du capteur a changé dans une copie temporaire montée en lecture seule.
- RGB, profondeur et intrinsèques : 36,762 s, horodatages exactement identiques.
- Le carton est visible au poste de prise, avant le démarrage du cycle ; aucune phase PRE_PICK ni décision supervisée n’est attribuée à cette image HD.
- Masque : 90 159 pixels ; bornes [455 ; 218 ; 699 ; 585] px ; centre [577 ; 401,5] px.
- Profondeur médiane : 2,2400002479553223 m ; bande ±0,003 m.
- Pose calculée à stride 1 : [1,7203709598 ; 0,6257522059 ; 0,7499997520] m ; lacet ≈ 0°.
- Caméra à z = 3,14 m, carton de hauteur 0,30 m : surface ≈ 0,900 m, centre ≈ 0,750 m.
- La correction de biais nominale issue des acquisitions 640 px n’est PAS appliquée à l’illustration HD.
- Aucun âge de mesure n’est attribué à cette image. Les 200 ms désignent la limite du scénario, pas une mesure de latence de cette acquisition.
- Une acquisition native 640 × 480 en PRE_PICK à 6,072 s est également archivée, mais n’est pas celle montrée.

## Limites à préciser si le jury interroge la calibration

- Caméra simulée et géométrie Gazebo simplifiée ; il ne s’agit pas d’images du robot physique.
- Transformation caméra-cellule déclarée, pas calibration métrologique d’une caméra réelle.
- La correction fixe du biais de simulation a été déterminée sur 24 observations appariées du fonctionnement nominal ; elle n’est pas transposée à cette illustration HD.
- L’indicateur de qualité n’est pas une incertitude métrologique.
- Le contour décrit les bornes des pixels retenus, pas une boîte dessinée à la main. L’axe est une direction PCA, pas une flèche de mouvement.
- Cette acquisition explique le mécanisme de perception ; elle ne constitue ni une nouvelle campagne de qualification, ni une preuve de sécurité.

## Sources et traçabilité

- [Dossier de capture et vérifications](../../evidence/observer-camera/README.md).
- robot2-cad/sim/ros_nodes/rgbd_estimator_core.py : estimate_carton.
- robot2-cad/sim/ros_nodes/sensor_supervisor.py : camera_observation.
- robot2-cad/sim/ros_nodes/multi_carton_cycle.py : association au carton courant et actualisation MoveIt.
- robot2-cad/robot2-rapport/memoire-fusion-ensam/reference/robot/chapitres/31-commande-planification.tex.
