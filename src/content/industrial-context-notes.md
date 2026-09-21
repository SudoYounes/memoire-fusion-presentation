# Périmètres du projet

Première intégration du PowerPoint dans la présentation Vite. Une diapositive
précède désormais l’ouverture Robot 2. Les identifiants et le contenu des vingt
diapositives existantes sont conservés.

## Sources

- `Soutenance de stage_VIATRIS.pptx`, diapositive 6 : définition du CDF, site de
  Meyzieu, contexte et trois impacts. Le texte de définition est repris tel quel.
- Le visuel `ppt/media/image23.png` de cette slide donne les opérations :
  démontage, nettoyage, remontage, réglage, sur les équipements de la ligne à
  l’arrêt. La séquence est transcrite en HTML modifiable.
- Le visuel `ppt/media/image24.png` donne 59 références de produits, 9 formats
  d’étuis et 5 formats de blisters. Ces données sont transcrites en HTML.
- Les deux versos Automatisation sont une synthèse éditoriale du contenu déjà
  présent dans `#robot-2`, `#enjeu`, `#cellule` et `#livrables`. Ils décrivent la
  palettisation de Robot 2, pas une automatisation démontrée du changement de
  format. Aucun gain terrain ni chiffre de performance supplémentaire n’est
  affirmé. L’auteur a confirmé ce cadrage pour les versos Automatisation.

## Séquence et revue

État 0 : les trois cartes en retrait. Étapes 1–5 : définition CDF, définition
automatisation, contexte industriel, impact CDF, impact automatisation.

Flèches, Espace et molette avancent ou reculent d’une étape avant de changer de
diapositive. Les titres sélectionnent les cartes. Les deux boutons « Tourner la
page » permettent de revoir les versos. Le feuillet se soulève depuis le coin
supérieur droit, puis s’incurve en diagonale pour découvrir le verso. Le mouvement
dure 1,35 s et se déroule aussi à l’envers. Les contrôles locaux restent disponibles
sur mobile et en mouvement réduit. Le mode mouvement réduit supprime la courbure.
Les pieds des faces consacrées au changement de format portent le libellé SMED.
Les en-têtes et pieds des trois cartes ont un fond gris clair `#e7edef`,
identique dans les variantes sombre et claire. L'opacité de la carte entière
reste réduite lorsqu'elle n'est pas active.

L’effet est isolé dans `src/visuals/industrialPageCurl.ts`. Pendant la transition,
des bandes de texte HTML suivent les tangentes d’une feuille courbée. Ces copies,
masquées aux lecteurs d’écran, sont supprimées à la fin du mouvement, au changement
de slide ou au redimensionnement. Les contenus d’origine restent modifiables.

Le fond par défaut reprend exactement `theme-teal` de la slide 8 initiale. La
déclinaison claire `theme-industrial-light` conserve la même maille triangulaire
avec une palette gris clair teintée de vert.

- Vue sombre : `/#contexte-industriel`
- Vue claire : `/?industrial-theme=light#contexte-industriel`
- Étape précise : `/?industrial-step=2#contexte-industriel`
- Capture : `/?capture=contexte-industriel&industrial-step=3`

## Réversibilité

Base vérifiée : `b576f9d`. Branche de sécurité :
`safety/avant-contexte-industriel-b576f9d`. Travail isolé sur
`feat/contexte-industriel`. Aucun push ni déploiement lors de cette intégration.
