# Provenance des médias

Toutes les ressources ci-dessous sont des copies locales destinées au bundle de
présentation. Le dépôt source reste en lecture seule.

## CAO

- `robot-placing-wide.png` ← `out/review/robot-placing_20260821T011927Z.png`
- `robot-placing.png` ← `robot2-rapport/memoire-fusion-ensam/figures/cad-robot-placing.png`
- `robot-assembly-iso.png` ← `.../figures/cad-assembly-iso.png`
- `robot-atlas.png` ← `.../figures/cad-atlas-01-overview.png`
- `j1-system.png` ← `.../figures/cad-j1-system.png`
- `j3-transmission.png` ← `.../figures/cad-j3-transmission-exploded.png`
- `j4-wrist.png` ← `.../figures/cad-j4-f-pq.png`
- `j1-detail.png` ← `out/review/R2-J1-SYSTEM-final_20260820T012614Z.png`
- `j3-primary-chain.png` ← `out/review/j3-primary-chain_20260821T161710Z.png`
- `j3-articulation-exploded.png` ← `out/review/articulation-exploded_20260820T224716Z.png`
- `j3-linkage-motion.gif` ← `out/R2-J3-LINKAGE-kinematic.gif`
- `public/models/j3-articulation.glb` ← `out/R2-J3-ARTICULATION-assembled.glb`

## Modèles et calcul

- `model-data-provenance.svg` ← `.../figures/model_data_provenance.svg`
- `model-pipeline.svg` ← `.../figures/model_pipeline_v6.svg`
- `motion-control.svg` ← `.../figures/model_motion_control.svg`
- `kinematic-chain.svg` ← `.../figures/meca_chaine_cinematique_normalisee.svg`
- `fea-comparison.svg` ← conversion SVG de `.../figures/sys_fea_comparaison.pdf`
- `horizontal-locus.svg` ← conversion SVG de `.../figures/model_lieu_horizontal.pdf`
- `grip-perception.svg` ← conversion SVG de `.../figures/v6_prehension_perception.pdf`
- `cycle-profiles.svg` ← conversion SVG de `.../figures/v6_profils_cycle9.pdf`

## Simulation et qualification

- `cycle-chronogram.svg` ← `sim/artifacts/baseline_analytics_multilayer_12s_v6/chronogram.svg`
- `placement-trends.svg` ← `sim/artifacts/baseline_analytics_multilayer_12s_v6/campaign-placement-trends.svg`
- `multilayer-01.png`, `multilayer-02.png`, `multilayer-03.png` ← captures documentaires du mémoire.
- `src/content/campaign-cycle-metrics.csv` ← `sim/artifacts/baseline_analytics_multilayer_12s_v6/campaign_cycle_metrics.csv`

Résultat de référence :
`sim/audit/2026-09-10/12s-campaign-v6-result.md` et `.json`.

Les captures Gazebo documentent l’environnement uniquement. Les verdicts
quantitatifs du deck viennent des traces CSV et des audits de campagne.

## Fenêtres de la slide 10

- `models/j1.png` ← `.../figures/cad-atlas-05-j1-base.png`
- `models/elbow.png` ← `.../figures/cad-atlas-02-elbow-cd.png`
- `models/pushrod.png` ← `.../figures/cad-atlas-04-pushrod-r.png`
- `models/j4.png` ← `.../figures/cad-atlas-06-j4-wrist.png`
- `models/world.png` ← `.../figures/cellule-gazebo-developpement.png`
- `models/urdf-joint-frames.png` ←
  `evidence/configuration-robot2/03-reperes-quatre-articulations.png`
- `models/srdf-planning-chain.png` ←
  `evidence/moveit-setup-assistant/03-chaine-base-link-tool0.png`
- `models/srdf-self-collisions.png` ←
  `evidence/moveit-setup-assistant/09-matrice-collisions.png`
- `models/sdf-rgbd-cell.png` ←
  `evidence/sdf-gazebo/05-camera-rgbd-cellule.png`
- `j2-j3-transmission.png` ← `.../figures/cad-atlas-03-j2-j3-transmission.png`.
  La fenêtre montre les deux coupes principales de la rangée supérieure : les
  autres vues emploient leur propre numérotation. Le fichier original reste entier.
- Les légendes numérotées reprennent les tableaux de
  `chapitres/robot/04-architecture.tex`, sans renumérotation des pièces.
- La capture SDF expose l’arbre des entités de la cellule et la caméra
  `overhead_rgbd`; le robot est chargé séparément au lancement.
- Les deux captures SRDF documentent le groupe `palletizer` et la matrice des
  auto-collisions directement dans MoveIt Setup Assistant.
- L’extrait JSON et le schéma de ses deux branches viennent de `topology` dans
  `sim/robot_description/robot2_constrained_dynamics.json`.
- La capture URDF montre les repères locaux des quatre articulations dans RViz.

## SMED — diagnostic, réalisation, standards et résultat

Source commune : `/Users/macair/Downloads/Soutenance de stage_VIATRIS.pptx`,
36 diapositives. Empreinte SHA-256 :
`15fb7d7ecd175f105c216037ad41c6a7a2667efc261936134f7551362c8eb01c`.
Les numéros ci-dessous désignent les diapositives de ce PowerPoint.

Les fichiers de `smed/` sont des copies binaires, sans retouche, des extractions
déjà conservées dans `evidence/smed/figures/`. Pour les EMF contenant un bitmap,
le PNG est l'image extraite ; il ne s'agit pas d'une reconstruction du contenu.
Les deux détails du logigramme sont des recadrages antérieurs du rendu du SVG.
Le PowerPoint original n'est pas modifié.

| Fichier du bundle | Extraction locale | Slide / artefact interne | Nature et limite de la preuve |
| --- | --- | --- | --- |
| `smed/causes-source.png` | `image48.png` | 22 / `ppt/media/image48.png` | Ishikawa qualitatif : formation, visserie, décision en cas de blocage. Aucune contribution chiffrée attribuée aux causes. |
| `smed/support-common-cad.png` | `image49.png` | 27 / `ppt/media/image49.emf` | Modèle du support de visserie commune ; image CAO, pas une photographie. |
| `smed/support-common-built.png` | `image50.png` | 27 / `ppt/media/image50.emf` | Photo du support commun fabriqué. Support vide ; ne démontre pas un gain propre ou un usage stabilisé sur ligne. |
| `smed/support-brush-cad.png` | `image51.png` | 27 / `ppt/media/image51.emf` | Modèle du support de visserie de la boîte à brosses, et non de la boîte à brosses elle-même. |
| `smed/support-brush-built.png` | `image52.png` | 27 / `ppt/media/image52.emf` | Photo du support de visserie de la boîte à brosses fabriqué. |
| `smed/support-descent-cad.png` | `image53.png` | 27 / `ppt/media/image53.emf` | Modèle du support de visserie de descente. Certaines quantités inscrites diffèrent de l'inventaire slide 26 ; ne pas en déduire une spécification dimensionnelle commune. |
| `smed/support-descent-built.png` | `image54.png` | 27 / `ppt/media/image54.emf` | Photo du support de visserie de descente fabriqué. |
| `smed/standard-na014.png` | `image56.png` | 29 / `ppt/media/image56.emf` | Extrait de la fiche NA014, montage bobine aluminium sur NOACK. Bas déjà tronqué dans la source ; champs rédaction et approbation vides. |
| `smed/decision-left.png` | `decision-left.png` | 30 / rendu de `ppt/media/image57.svg` | Détail de l'orientation qualité/maintenance, checklist 10 min et intervention du chef d'équipe 20 min. Les raccordements se poursuivent hors du recadrage. |
| `smed/decision-right.png` | `decision-right.png` | 30 / rendu de `ppt/media/image57.svg` | Détail de l'escalade maintenance : diagnostic/solution 3 h, responsables, blocage total supérieur à 8 h et cellule de crise. Les délais sont des seuils de décision, pas des résolutions garanties. |
| `smed/test-result-source.png` | `image59.png` | 33 / `ppt/media/image59.png` | Bandeau du test : CDF 655 min, soit 10 h 55 (10,92 h arrondies). Une colonne de 202 min n'a pas de libellé visible ; ne pas l'attribuer ni additionner les charges pour reconstruire la durée. |
| `smed/followup-bob.png` | `image61.png` | 34 / `ppt/media/image61.emf` | Fiche BOB : objectifs, réel, équipes, explication si dépassement de plus de 10 min. Les champs de mesure sont vierges. |
| `smed/followup-bobinette.png` | `image62.png` | 34 / `ppt/media/image62.emf` | Fiche BOBINETTE, même dispositif de suivi. Outil prévu, pas une série de résultats obtenus. |

Les trois couples CAO/photo documentent la réalisation de supports. Ils
n'établissent ni une conformité dimensionnelle à l'ensemble de l'inventaire,
ni un gain de temps individuel, ni une qualification de leur utilisation.
Les photos originales sont conservées, sans ajout de pièces ou de marquages.

Le logigramme original comporte deux raccordements ambigus : la branche
« blocage total non supérieur à 8 h » rejoint la reprise sans confirmation
explicite de résolution ; la cellule de crise rejoint directement « CDF
terminé ». La synthèse de présentation retient les acteurs et seuils
d'escalade ; elle ne présente pas ces retours comme une procédure corrigée
et approuvée.

Les graphiques et schémas natifs de la séquence reprennent les sources
suivantes, sans importer leurs fonds ou interfaces :

- Slide 21, `ppt/charts/chart3.xml` : Pareto 179 min d'attente, 173 min de
  contrôle, 25 min de transport ; 352/377 min pour les deux premières
  catégories. Le pourcentage concerne les temps classés de ce Pareto,
  pas l'intégralité de l'arrêt.
- Slide 25, tableau OOXML : nettoyage rouleau maintenance 5 min en temps
  masqué ; entraide au nettoyage ; programme Linemaster chef d'équipe 10 min
  en temps masqué ; vide de ligne chef d'équipe + qualité 25 min. Le schéma
  de coordination n'est pas un planning à l'échelle ni un gain net de 15 min.
- Slides 13 et 33 : cible 12 h et résultat 655 min ; écart calculé de 65 min.
  Les bases 17 h de cadrage et 16 h d'observation slide 19 ne sont pas
  réconciliées. Aucun pourcentage de réduction avant/après n'en est déduit.

Lecture détaillée et narration : `src/content/smed-selection.md` et
`src/content/smed-story-notes.md`.
