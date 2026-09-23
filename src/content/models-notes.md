# Slide « Décrire — Modèles & contrats »

## Fil de présentation

1. Partir des pièces et placements CAO déjà exportés. Python/build123d sert à
   importer et exploiter les STEP ; cette étape ne relance pas les générateurs.
2. Regrouper les pièces solidaires, affecter chaque occurrence une seule fois,
   exprimer masses, centres de gravité et tenseurs dans le repère du corps.
3. Parcourir les trois descriptions de haut en bas. Le bus représente les
   informations partagées et les descriptions préparées avec les choix du projet :
   il ne prétend pas que le SDF et le SRDF sont automatiquement déduits des STEP.
4. URDF : expliquer « link = corps rigide » et « joint = liaison entre deux corps ».
   Les cinq corps principaux de l'arbre réduit sont base, colonne, bras, avant-bras
   et outil, reliés par J1–J4. Des repères et accessoires fixes peuvent s'ajouter.
   Les géométries de simulation sont simplifiées ; ce n'est pas un maillage fidèle
   de chaque pièce CAO.
5. SRDF : les quatre axes du bras forment le groupe considéré par MoveIt.
   La géométrie reste définie dans l'URDF. La seconde capture montre les paires
   actuellement désactivées dans la matrice d'auto-collisions ; chaque case doit
   rester une exclusion volontaire et vérifiée, et non une validation implicite.
6. SDF : le monde de cellule contient le poste, les capteurs et la palette
   indexée selon Y ; le robot URDF est chargé par le lancement dans ce monde.
7. En complément oral si nécessaire, préciser le statut du profil à 800 kg :
   c'est une cible provisoire utilisée en simulation, pas la masse prouvée d'un
   robot fabriqué ni d'une CAO déjà allégée.

Le bloc JSON et sa fenêtre ont été retirés de cette slide. Le modèle fermé
reste inchangé dans le projet ; cette suppression ne concerne que la présentation.
Après la fenêtre SDF, ↓ mène directement à « Observer ».

## Sources locales consultées (lecture seule)

Racine : /Users/macair/Documents/robot2-cad

- robot2-rapport/memoire-fusion-ensam/reference/robot/chapitres/30-modeles-physiques.tex :
  repères, indexeur Y, rôle URDF/SRDF/SDF, chargement de la cellule et modèle série.
- docs/15-simulation-physical-model.md :
  appartenance, agrégation, cinq links réduits, modèle contraint, profil 800 kg.
- sim/scripts/generate_physical_model.py :
  traitement cache-only, build123d/NumPy, noms des corps et des hôtes physiques.
- sim/README.md :
  deux modèles et responsabilités, profil massique actif, hypothèses et limites.
- sim/scripts/build_run_manifest.py :
  description des géométries visuelles primitives et absence de maillages
  CAO par link versionnés.

## Transition

La caméra entre d'abord dans le bloc « Décrire ». Pour passer ensuite à Observer,
elle recule depuis le détail jusqu'au graphe maître en grand, laisse un palier
de lecture et entre dans le bloc suivant. Ce même trajet s'applique aux six
blocs et se rejoue à l'envers au retour.

La miniature translucide du graphe, avec le module actif contrasté, assure
l'orientation en pied de slide. Les encadrés « Le contrat commun » et
« Hypothèse conservée » ont été retirés de la surface présentée à la demande
de l'utilisateur ; la provenance et le statut massique sont conservés ici.

La structure accessible reste celle des vraies slides ; les copies de
transition sont inertes et cachées aux lecteurs d'écran. Le mode mouvement
réduit et les captures affichent directement la slide et sa miniature.
