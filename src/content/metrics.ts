export const robotFacts = {
  requirement: {
    productMaximumObservedKg: 9.6,
    simulationCartonKg: 15,
    robotAxes: 4,
    cycleThresholdSeconds: 12,
  },
  campaign: {
    acceptedCycles: 108,
    sequenceCount: 9,
    cartonsPerSequence: 12,
    declaredResets: 8,
    meanSeconds: 10.556,
    maximumSeconds: 11.526,
    minimumMarginSeconds: 0.474,
    scope: 'commissioning-simulation',
    releaseCredit: false,
  },
  cad: {
    parametricGenerators: 36,
    sourceOfTruth: 'params.py',
    interchangeFormat: 'STEP',
  },
} as const
