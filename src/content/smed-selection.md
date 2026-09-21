# SMED — lecture des preuves et proposition de narration

Statut : proposition éditoriale. Seul le premier écran, « Réduire l'arrêt lié
au changement de format », a été autorisé puis intégré après cette analyse
(voir `smed-challenge-notes.md`). Les autres choix restent à valider par l'auteur.
Analyse du 21 septembre 2026.

## 1. Périmètre et méthode de lecture

Source : `/Users/macair/Downloads/Soutenance de stage_VIATRIS.pptx`, 36 diapositives.
Empreinte SHA-256 :
`15fb7d7ecd175f105c216037ad41c6a7a2667efc261936134f7551362c8eb01c`.
Les numéros ci-dessous sont ceux du PowerPoint, pas ceux du deck Vite.

Lecture des textes et tableaux OOXML, des données mises en cache des trois
graphiques natifs, des figures bitmap extraites des EMF, et du logigramme SVG
rendu. La cartographie vectorielle de la slide 19 a été examinée par ses textes
et primitives : ses limites sont explicitées ci-dessous. L'export intégral par
PowerPoint n'a pas abouti ; ce travail n'est donc pas une certification visuelle
de la mise en page des 36 slides. Les figures décisives ont été examinées
individuellement. Les notes des slides 1–2 contiennent un ancien sujet sans
rapport avec le chantier ; elles ne sont pas retenues comme source.

Les extractions locales sont dans `evidence/smed/` (ignoré par Git et non servi
par Vite). Le PowerPoint original est conservé sans modification. Les références
aux artefacts désignent le fichier interne `ppt/media/` ou `ppt/charts/`.

## 2. Le sens du projet

Le récit étayé n'est pas « démonter plus vite ». Le changement de format mobilise
plusieurs machines et intervenants ; une partie des pertes provient de leur
coordination, de la recherche des pièces et de pratiques insuffisamment
standardisées. Les solutions portent donc sur l'enchaînement des opérations,
la préparation matérielle, la transmission du savoir-faire et l'escalade des
blocages. Un test final est présenté sous la cible, puis un dispositif de suivi
est proposé.

Fil narratif recommandé :

> Rendre du temps à la ligne en organisant mieux son changement de format,
> tout en conservant les exigences de qualité.

Ce fil est distinct de Robot 2 : le SMED traite ici l'organisation du changement,
l'automatisation traite la palettisation. Aucun résultat de l'un ne doit être
attribué à l'autre.

## 3. Ce que disent réellement les chiffres

| Mesure | Valeur et source | Usage défendable |
| --- | --- | --- |
| Référence du projet | 17 h — slides 13 et 33 | Référence affichée, dont la définition reste à confirmer ; ne pas la nommer « moyenne historique » sans confirmation. |
| Objectif | 12 h — slides 13 et 33 | Cible, pas résultat. Réduction visée par rapport à 17 h : 29,4 %. |
| Durée du CDF observé | 16 h — slide 19 | Observation annoncée ; ne pas l'assimiler automatiquement aux 17 h. |
| Somme des activités | 1 121 min = 18 h 41 — slide 20, charts 1 et 2 | Charge cumulée des activités représentées, pas durée calendaire d'arrêt. |
| Pertes du Pareto | Attente 179 min, contrôle 173 min, transport 25 min — slide 21, chart 3 | 377 min dans ce classement ; attente + contrôle = 352 min, soit 93,37 % de ces 377 min seulement. |
| Résultat du test | 655 min = 10 h 55 — slide 33, image59 | Un test présenté. L'affichage décimal 10,92 h est arrondi : ne pas écrire 10 h 92. |
| Écart à la cible | 720 − 655 = 65 min | Le test est 1 h 05 sous la cible de 12 h. |

### Séparer les bases de calcul

- Si la référence de 17 h est comparable au test : gain de 365 min, soit 6 h 05
  et 35,8 %. Ce calcul est conditionnel, pas encore un titre de slide.
- Si la base pertinente était l'observation de 16 h : 305 min, soit 5 h 05 et
  31,8 %. Ne pas choisir la base qui donne le plus grand pourcentage.
- Les graphiques 1–2 référencent `AD_Ibuprofene 200mg (CF complet) 1.xlsx` ;
  le Pareto référence `Cartographie SMED (1).xlsx`. Les classeurs ne sont pas
  embarqués. Les codages ne concordent pas : attente 43 min dans le chart 2
  contre 179 min dans le Pareto ; contrôle 188 contre 173 min. Les deux vues
  ne doivent pas être fusionnées sans leur règle de classement.
- Le bandeau du test contient BOB 553 min, BOBINETTE 520 min, une colonne
  non identifiée de 202 min et CDF 655 min. Ne pas inventer l'intitulé de 202,
  ni additionner ces charges pour reconstituer la durée du changement.

### Décomposition vérifiée de la slide 20

| Machine / activité | Minutes cumulées |
| --- | ---: |
| NOACK | 639 |
| NERI | 186 |
| PC | 118 |
| CHRIST | 82 |
| Étiqueteuse | 77 |
| Rangement | 12 |
| ADC | 7 |
| **Total** | **1 121** |

Le NOACK représente 57,0 % de cette charge. C'est une concentration d'activités,
pas la preuve qu'il cause 57 % de l'arrêt ou constitue seul le chemin critique.
Par fonction, la figure regroupe production à 16,02 h, maintenance à 2,17 h et
qualité à 0,50 h. La production inclut les opérateurs et le chef d'équipe.

Par phase, les mêmes 1 121 min se répartissent en réglage 475, contrôle 188,
remontage 120, préparation 96, démontage 82, nettoyage 77, attente 43,
transport 25, démarrage 10 et vidange 5. Ce tableau et le Pareto répondent à
des questions différentes ; ils ne sont pas deux versions interchangeables.

## 4. Inventaire raisonné des 36 slides

| Slides source | Contenu / rôle | Décision proposée |
| --- | --- | --- |
| 1–2 | Couverture et sommaire | Ne pas importer ; le deck fusion a son identité et sa progression. |
| 3–4 | Section entreprise, groupe et site | Garder le contexte du site si nécessaire, pas une nouvelle présentation corporate. |
| 5–7 | Définition CDF, diversité des formats, indisponibilité de ligne et problème | La slide 6 nourrit déjà « Périmètres du projet ». Ne pas la répéter ; utiliser l'enjeu de disponibilité pour ouvrir le SMED. |
| 8–10 | Bibliographie, principes SMED et DMAIC | Petit repère méthodologique ou détail facultatif. Éviter deux slides de cours. Les références bibliographiques n'ont pas été vérifiées extérieurement. |
| 11–13 | Cadrage, WBS, équipe, référence 17 h et cible 12 h | Cible au premier plan ; périmètre et acteurs en détail. WBS complet hors récit principal. |
| 14–17 | Ligne, rôles, changement de produit observé | Ancre concrète du diagnostic ; schéma de ligne réduit, pas quatre slides successives. |
| 18–19 | Opérations observées, cartographie SMED, durée annoncée 16 h | Preuve de la méthode d'observation. Extrait lisible dans une fenêtre, avec limites du périmètre visible. |
| 20 | Charges par machine, fonction, acteur et phase | Analyse secondaire ; conserver une vue utile NOACK/charge, ne pas empiler quatre graphiques. |
| 21 | Pareto des pertes classées NVA | Graphique principal du diagnostic, avec dénominateur et précaution sur les contrôles. |
| 22–23 | Ishikawa et leviers | Reformuler les liens « observation → mécanisme → réponse » ; original en détail. |
| 24–25 | Nouveau scénario et partage des opérations | Preuve centrale de la réorganisation, en séquence multi-acteurs. |
| 26–27 | Inventaire visserie, CAO et supports fabriqués | Preuve matérielle centrale. Photo réelle au premier plan ; inventaire et variantes en fenêtre. |
| 28 | Organisation 6S et préparation standardisée | Action décrite ; pas de faux avant/après ni de résultat mesuré à lui attribuer. |
| 29 | Construction d'un standard, exemple NA014 | Preuve de formalisation du savoir-faire ; détail photographique lisible. |
| 30 | Logigramme de traitement des blocages | Synthèse d'escalade au premier niveau, arbre détaillé en fenêtre après clarification de ses raccordements. |
| 31–32 | Section validation et page de garde COPIL | Jalon de gouvernance secondaire, pas attestation de validation complète. |
| 33 | Résultat chronométré et comparaison à l'objectif | Preuve principale de l'impact ; valeur exacte 10 h 55. |
| 34 | Fiches de suivi BOB et BOBINETTE | Dispositif de pérennisation prévu, pas série de résultats. |
| 35–36 | Intertitre conclusion/perspectives, remerciements | Construire la conclusion à partir des preuves ; ne pas importer ces écrans. |

## 5. Lecture sémantique des artefacts décisifs

### Observer : granularité réelle, vue temporelle partielle

Le changement étudié slide 17 passe d'ACEBUTOLOL 400 mg, 90 cps, étui 20,
blister 44 × 120 mm à IBUPROFENE 200 mg, 30 cps, étui 1, blister 39 × 98 mm.
Il donne un cas concret ; la source ne précise pas que le test final répète
exactement cette transition.

La slide 18 annonce 87 opérations et en présente des extraits avec rôle,
machine, action et durée. La cartographie de la slide 19 (`image45.emf`)
n'est pas un planning complet de 16 h : l'extrait contient 23 lignes BOB,
toutes classées INTERNE, et des colonnes Numéro, Étapes, Rôle, Type,
INT-EXT, Durée, Début et Fin. L'axe visible va de 0 à 340 par pas de 5.
Les débuts/fins inscrits s'enchaînent de 0 à 222, sans chevauchement numérique.
Les cases de couleur arrondies aux pas de 5 créent de petits chevauchements
visuels : ce n'est pas la preuve d'un travail parallèle. Ne pas reconstruire
un Gantt complet, un chemin critique ou un pourcentage d'externalisation à
partir de cet extrait.

Autre limite de rapprochement : le nettoyage du rouleau est attribué à BOB
dans cet extrait, mais au technicien maintenance dans la décomposition
slide 18. Ne pas assembler un scénario initial définitif en mélangeant ces
deux documents. L'unité « min » est cohérente avec la décomposition associée,
mais n'est pas explicitement inscrite dans l'en-tête de l'EMF.

### Diagnostiquer : ce qui est compté et ce qui est interprété

Le Pareto (`chart3.xml`) situe l'attente et le contrôle dans le classement des
pertes retenu par l'auteur. Son 93,37 % ne décrit ni toute la durée du CDF ni
une quantité intégralement supprimable. Il manque une définition détaillée
de « contrôle » dans ce classement. Formulation sûre : « Dans le Pareto du
diagnostic, attente et contrôle concentrent l'essentiel des temps classés. »

L'Ishikawa (`image48.png`) documente trois mécanismes qualitatifs :

| Mécanisme analysé | Réponse proposée | Preuve ultérieure |
| --- | --- | --- |
| Connaissance limitée des opérations, hésitations et besoin d'assistance | Formaliser les gestes et transmettre le savoir-faire | Fiche standard NA014, slide 29 |
| Visserie désorganisée, recherche des pièces et déplacements | Inventorier, compartimenter, préparer | Tableau slide 26, CAO et photos slide 27 |
| Résolution autonome trop longue, pratiques d'appel variables | Définir des règles d'escalade | Logigramme slide 30 |

Ces liens sont une lecture de l'analyse source, pas une mesure statistique de
l'effet de chaque cause. Ne pas dessiner des flèches proportionnelles ni
attribuer une part chiffrée du gain à chacun de ces leviers.

### Réorganiser : masquer du temps sans supprimer le travail

Le tableau slide 25 distribue le travail entre BOB, BOBINETTE, chef d'équipe
et maintenance. Deux opérations sont explicitement marquées « temps masqué » :
nettoyage du rouleau de scellage par maintenance, 5 min ; arrêt/chargement
Linemaster par le chef d'équipe, 10 min. L'aide de BOBINETTE au nettoyage
final apparaît également. Le vide de ligne chef d'équipe + qualité, 25 min,
reste présent.

La preuve est un nouvel enchaînement et une coordination des acteurs.
« Temps masqué » ne signifie pas automatiquement « opération externe pendant
que la ligne produit ». Les 5 et 10 min ne constituent pas à elles seules
15 min de gain net démontré. Un schéma peut représenter les responsabilités
et le principe du parallélisme, mais doit être libellé « schéma de principe,
non à l'échelle » tant que les positions temporelles complètes manquent.

### Matérialiser : de l'inventaire au support fabriqué

L'inventaire slide 26 référence machine, zone, quantité, désignation,
dimensions et destination laverie/ligne. Slide 27 :

| Artefacts | Nature de la preuve |
| --- | --- |
| image49 / image50 | CAO du support de visserie commune / photo du support métallique fabriqué |
| image51 / image52 | CAO du support de visserie de la boîte à brosses / photo de la fabrication |
| image53 / image54 | CAO du support de visserie de descente / photo de la fabrication |
| image55 | Support des vis restant en ligne, montré en CAO uniquement |

Les trois paires sont une bonne preuve de réalisation, pas seulement une
intention. Les photos montrent toutefois des supports vides, sans marquages
finaux lisibles. Elles ne prouvent ni le gain chronométré de chaque support,
ni une qualification hygiénique, ni son usage stabilisé sur la ligne. Ne pas
générer une photo de pièces en place qui pourrait passer pour une preuve réelle.
La désignation PC varie entre 4250, 4200 et 4000 selon les documents : garder
« PC » dans une synthèse jusqu'à confirmation.

### Standardiser : un document n'est pas encore une pratique démontrée

La fiche NA014 (`image56.emf`) porte sur le montage de la bobine aluminium
NOACK. Elle associe photos, commentaires et points de vigilance (état de la
bobine, mandrin, vis de blocage). Elle prouve la formalisation du geste.
L'extrait comporte des champs rédaction/approbation non remplis : ne pas
affirmer que toutes les équipes sont formées ou que ce standard est approuvé.

Le logigramme (`image57.svg`) sépare qualité et maintenance : information
qualité + chef d'équipe pour le premier cas ; checklist 10 min maximum, puis
analyse chef d'équipe 20 min maximum s'il est disponible, sinon maintenance.
Il prévoit ensuite un seuil de 3 h pour diagnostic/solution, une escalade
aux responsables et une cellule de crise si le blocage total dépasse 8 h.
Ce sont des seuils de décision, pas des délais de résolution garantis.

Deux raccordements doivent être clarifiés avant de redessiner le logigramme :
la branche « blocage inférieur à 8 h » rejoint la reprise sans confirmation
explicite de résolution ; la cellule de crise rejoint directement « CDF
terminé ». Proposition pour une future synthèse, à valider : conserver une
vérification explicite de résolution avant la reprise. Ne pas présenter cette
correction éditoriale comme une procédure déjà approuvée par le site.

### Éprouver et suivre : résultat ponctuel, pérennisation à établir

La slide 32 (`image58.emf`) est une page de garde de COPIL du 11 juin 2026,
pas un procès-verbal signé. La slide 33 (`image59.png`, `image60.emf`)
présente le résultat du test. Aucun effectif de répétitions, intervalle de
dispersion ou série temporelle n'est fourni.

Les fiches BOB/BOBINETTE slide 34 (`image61.emf`, `image62.emf`) demandent
objectif, temps réel, équipe et explication des dépassements de plus de 10 min.
Les champs de mesure sont vierges. Elles démontrent l'outil de suivi prévu,
pas une réduction durable déjà prouvée. Aucun gain TRS, financier ou
généralisé à tous les formats n'est établi dans ce fichier.

## 6. Proposition : quatre chapitres, cinq écrans

La partie Redesign mérite deux écrans : un modèle temporel pour l'organisation,
une preuve matérielle pour la réalisation. Les réduire à des miniatures dans
une même slide affaiblirait deux contributions distinctes. Si le temps oral
impose quatre écrans, les réunir en deux états d'une même slide ; garder
toutefois au moins une vraie photo de support au premier niveau.

Les titres ci-dessous sont des propositions, pas des textes déjà intégrés.

| Chapitre | Écran / titre-message | Configuration et preuve centrale | Fenêtre de détail |
| --- | --- | --- | --- |
| 01 — Enjeu | **Réduire l'arrêt lié au changement de format** | Fond foncé. Cible 12 h clairement étiquetée ; ligne simplifiée et périmètre du changement. Référence 17 h distincte, sous réserve de sa définition. | Transition produit/format observée, rôles et périmètre ; slides 13, 15–17. |
| 02 — Diagnostic | **L'attente et le contrôle dominent les pertes classées** | Fond clair. Trois barres horizontales : 179 / 173 / 25 min ; annotation 352 sur 377 min. Un second état relie les causes aux leviers, sans fausse pondération. | Extrait d'observation ; vue NOACK en charge cumulée ; Ishikawa source. |
| 03 — Redesign A | **Réorganiser les interventions pendant le changement** | Fond foncé. Couloirs par acteur et révélations successives des deux opérations en temps masqué. La qualité reste un passage identifié. Schéma de principe non à l'échelle. | Tableau original du scénario, recadré par séquence ; slide 25. |
| 03 — Redesign B | **Donner une place aux pièces et un repère aux gestes** | Fond clair. Grande photo réelle d'un support, avec son modèle CAO en second état. Deux points d'accès discrets : standard opérateur et règles de blocage. | Inventaire → compartiment ; galerie des trois fabrications ; fiche NA014 ; logigramme d'escalade. |
| 04 — Impact | **Un test à 10 h 55, sous la cible de 12 h** | Fond foncé. 10 h 55 dominant, comparaison sur axe commun à la cible, écart 1 h 05. Séparer visuellement « résultat du test » et « suivi prévu ». | Bandeau source du résultat ; fiches de suivi ; jalon COPIL contextualisé. |

### Pourquoi ces représentations

- Diagnostic : les barres horizontales rendent les trois valeurs lisibles ;
  une courbe de Pareto à double axe n'ajoute pas d'information nécessaire ici.
  Ne pas appeler ce graphique « répartition des 16 h ».
- Réorganisation : les couloirs expliquent qui intervient et quelles tâches
  peuvent être coordonnées. Un camembert ou une grille de cartes ne décrit
  pas cet enchaînement.
- Réalisation : la photo est la preuve ; la CAO explique l'intention de
  conception. Les deux portent des légendes distinctes « conçu / fabriqué ».
- Impact : une comparaison à la cible est aujourd'hui plus robuste qu'un
  gros pourcentage avant/après. Utiliser un axe partant de zéro ; ne pas
  dessiner de tendance ou de distribution à partir d'un seul test présenté.

### Trame orale proposée

1. **Enjeu.** « Chaque changement de produit et de format immobilise la ligne.
   Le projet vise à réduire cette indisponibilité, avec une cible de douze
   heures, sans retirer les opérations nécessaires à la qualité. »
2. **Diagnostic.** « Nous avons observé les opérations et les intervenants.
   Dans le Pareto retenu, attente et contrôle représentent 352 des 377 minutes
   classées. Cela ne veut pas dire supprimer les contrôles : cela conduit à
   examiner leur préparation et leur coordination, ainsi que les causes
   de recherche et d'hésitation identifiées sur le terrain. »
3. **Organisation.** « Le scénario redistribue les interventions. Le nettoyage
   du rouleau et le chargement Linemaster sont identifiés en temps masqué.
   On change l'enchaînement du travail ; les étapes qualité restent présentes. »
4. **Réalisation.** « La visserie a été inventoriée puis traduite en supports
   compartimentés : voici le modèle et la pièce fabriquée. Les standards
   illustrés et les règles d'escalade complètent cette préparation matérielle. »
5. **Impact.** « Le test présenté atteint 655 minutes, soit dix heures
   cinquante-cinq : une heure cinq sous la cible. Les fiches de suivi sont
   prévues pour documenter les prochains changements et leurs écarts ; la
   tenue dans le temps reste à mesurer. »

Adapter les « nous » à la contribution personnelle réelle de l'auteur ; le
PowerPoint ne permet pas d'attribuer seul chaque fabrication ou décision.

## 7. Traduction dans l'ADN du deck Vite

Reprendre les typographies, l'échelle, les repères et les fonds maillés du deck.
Alternance foncé / gris clair comme les séquences Robot ; ne pas transporter
les fonds violets/verts ou les tableaux Excel miniaturisés du PowerPoint.
Chaque écran porte un message et une preuve dominante. Le cuivre sert de
repère ponctuel ; il ne code pas simultanément rôle, alerte et résultat.

Les fenêtres reprennent le principe de `modelsArtifacts.ts` : ouvrir une
preuve depuis le bloc dont on parle, conserver le contexte du slide et revenir
au même état à la fermeture. Une fenêtre = une question et un artefact lisible,
avec titre, source, repères et une phrase « ce que cela démontre ». Plusieurs
planches peuvent former une galerie locale, pas une nouvelle navigation du deck.

Prévoir clavier, fermeture Échap, focus restitué au déclencheur, commandes
tactiles et mouvement réduit. La future animation ne doit ni suggérer des
durées non mesurées, ni faire disparaître une étape qualité pour illustrer un
gain. Garder l'effet de page pour les deux périmètres ; les preuves SMED
gagnent plutôt à s'ouvrir, se recadrer et se révéler progressivement.

## 8. Points à confirmer avant intégration des affirmations concernées

1. Que représentent exactement les 17 h ? Les 16 h sont-elles une observation
   particulière ? Le test de 655 min porte-t-il sur le même produit/format
   et le même début/fin de mesure ?
2. Que recouvre « contrôle » dans le Pareto et pourquoi son codage diffère-t-il
   du tableau d'analyse de déroulement ?
3. Existe-t-il le planning complet, les classeurs de mesure et des essais
   supplémentaires ? Sans eux, pas de chemin critique ni de gain durable chiffré.
4. Quels supports et standards ont été effectivement mis en service et
   approuvés, au-delà de ce que montrent les photos et documents ?
5. Les deux raccordements ambigus du logigramme peuvent-ils être corrigés,
   et quelle est la désignation exacte de la machine PC ?

Ces questions n'empêchent pas de préparer les écrans. Elles limitent les
affirmations : conserver les formulations prudentes indiquées tant que les
réponses manquent. Cette analyse n'autorise pas l'intégration des écrans suivants.
