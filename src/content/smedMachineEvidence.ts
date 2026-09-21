/** Selected, shortened labels from VIATRIS slide 18, not complete procedures.
 * Durations are excluded: the PC totals conflict with the slide 20 synthesis.
 */
export const smedMachineEvidence = [
  {
    id: 'noack', name: 'Noack',
    summary: 'Démontage des pièces et relais avec la maintenance.',
    operations: [
      { row: 5, action: 'Démontage des moules et retrait des bandes PVC et aluminium', actor: 'BOB' },
      { row: 10, action: 'Démontage de la trémie, du tamis et du bac de récupération, puis aspiration', actor: 'BOB' },
      { row: 11, action: 'Ensachage et identification des chariots, sortie du box', actor: 'BOB' },
      { row: 14, action: 'Nettoyage du rouleau de scellage', actor: 'Tech. maintenance' },
    ],
  },
  {
    id: 'pc', name: 'PC',
    summary: 'Adapter les éléments mécaniques au nouveau format.',
    operations: [
      { row: 58, action: 'Démontage du pousseur, du contre-pousseur et des magasins', actor: 'BOBINETTE' },
      { row: 72, action: 'Remontage du pousseur et du contre-pousseur', actor: 'BOBINETTE' },
      { row: 74, action: 'Réglage de l’excentrique', actor: 'BOBINETTE' },
      { row: 75, action: 'Remontage et réglage des magasins automatique et manuel', actor: 'BOBINETTE' },
    ],
  },
  {
    id: 'neri', name: 'Neri',
    summary: 'Reconfigurer les programmes et les réglages de la machine.',
    operations: [
      { row: 65, action: 'Chargement du programme et remise à zéro électrique', actor: 'BOBINETTE' },
      { row: 66, action: 'Mise aux cotes des verniers', actor: 'BOBINETTE' },
      { row: 67, action: 'Chargement du programme Linemaster', actor: 'BOBINETTE' },
      { row: 70, action: 'Réglage du convoyeur d’entrée Garvens et des cellules', actor: 'BOBINETTE' },
    ],
  },
  {
    id: 'christ', name: 'Christ',
    summary: 'Associer le changement de programme à la remise au format.',
    operations: [
      { row: 60, action: 'Sauvegarde du programme et démontage de l’élévateur/pousseur', actor: 'BOBINETTE' },
      { row: 62, action: 'Chargement du programme', actor: 'BOBINETTE' },
      { row: 63, action: 'Mise aux cotes du format', actor: 'BOBINETTE' },
      { row: 64, action: 'Montage de l’élévateur et du pousseur', actor: 'BOBINETTE' },
    ],
  },
  {
    id: 'etiqueteuse', name: 'Étiqueteuse',
    summary: 'Réglage du format carton et manipulation de la carte mémoire.',
    operations: [
      { row: 56, action: 'Retrait de la carte mémoire à la dernière caisse', actor: 'BOBINETTE' },
      { row: 77, action: 'Réglage au bon format carton', actor: 'BOBINETTE' },
      { row: 78, action: 'Insertion de la carte mémoire', actor: 'BOBINETTE' },
    ],
  },
] as const

export type SmedMachineId = typeof smedMachineEvidence[number]['id']
