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
- `j2-j3-transmission.png` ← `.../figures/cad-atlas-03-j2-j3-transmission.png`.
  La fenêtre montre les deux coupes principales de la rangée supérieure : les
  autres vues emploient leur propre numérotation. Le fichier original reste entier.
- Les légendes numérotées reprennent les tableaux de
  `chapitres/robot/04-architecture.tex`, sans renumérotation des pièces.
- La capture SDF est une vue de développement avec le robot présent, signalée
  comme telle. Les deux repères ajoutés identifient le poste de prise et la palette.
- L’extrait du groupe `palletizer` vient de `sim/robot_description/robot2.srdf`.
- L’extrait JSON et le schéma de ses deux branches viennent de `topology` dans
  `sim/robot_description/robot2_constrained_dynamics.json`.
- Le croquis URDF reste un emplacement réservé au dessin manuel de l’auteur.
