// Generated from frozen v6 campaign data. See scripts/results/extract-results.mjs.
export const resultsEvidence = {
  "provenance": {
    "audit": "sim/audit/2026-09-10/12s-baseline-analytics-v6.json",
    "csv": "sim/artifacts/baseline_analytics_multilayer_12s_v6/campaign_cycle_metrics.csv",
    "csvSha256": "7ddf3977ee5f6ce01e22a9820c486ccb11ce68a016c3e3b27efa0f633f0b8f66",
    "report": "sim/audit/2026-09-10/12s-campaign-v6-result.json",
    "reportSha256": "1ebf719dc40f784f99976cfb5c423198a996fb2d8cab8f8d078b1692d0c8c7ca",
    "scenario": "sim/scenarios/horizontal_indexed_multi_carton.json",
    "scenarioSha256": "8aba6dc4be3988416ad2b561f0440f8460002a60a8bfd816a09b9464f80f7eaa",
    "poseRun": "sim/artifacts/multi_carton_campaigns_v2/campaign-12s-qualification-20260910-v6/batch-08-ba327582-43c6-471e-bc25-53e7a69840c9/moveit_result.json",
    "poseRunSha256": "3a0d32193bcc6190cb92bcc4245e3fc50372521ab2cc1280aa6c19a39220542d",
    "scope": "MULTILAYER_12S_COMMISSIONING_ANALYTICS_NO_INDUSTRIAL_RELEASE_CREDIT"
  },
  "sequenceCount": 9,
  "cartonsPerSequence": 12,
  "declaredResets": 8,
  "acceptedCycles": 108,
  "resetTimeIncluded": false,
  "continuousFlowClaim": false,
  "releaseCredit": false,
  "meanSeconds": 10.556268518518518,
  "limits": {
    "seconds": 12,
    "xyMm": 25,
    "zMm": 15,
    "yawDeg": 2,
    "levelDeg": 1,
    "saturationMs": 50
  },
  "worstXY": {
    "sequence": 8,
    "carton": 6,
    "cycle": 90,
    "deltaMm": [
      14.429365713877818,
      -1.3464957937698863,
      -3.899234718472311
    ],
    "yawDeg": -0.9749765559056579,
    "expectedXYZm": [
      0.315,
      1.75309707920968,
      0.905
    ],
    "observedXYZm": [
      0.3294293657138778,
      1.7517505834159102,
      0.9011007652815277
    ]
  },
  "geometry": {
    "cartonMm": [
      600,
      400,
      300
    ],
    "palletMm": [
      1200,
      800,
      150
    ],
    "tangentOffsetsMm": [
      -315,
      315
    ],
    "rowOffsetsMm": {
      "inner": -215,
      "outer": 215
    },
    "contract": "sim/config/multilayer_pallet.json",
    "sha256": "52074e241b3b6c99b5e3b78b661177c6b0a919400fc3d4e357d17180680419aa"
  },
  "placementCases": {
    "xyMm": {
      "sequence": 8,
      "carton": 6,
      "cycle": 90,
      "layer": 2,
      "slotId": "layer_2_outer_right",
      "deltaMm": [
        14.429365713877818,
        -1.3464957937698863,
        -3.899234718472311
      ],
      "expectedXYZm": [
        0.315,
        1.75309707920968,
        0.905
      ],
      "observedXYZm": [
        0.3294293657138778,
        1.7517505834159102,
        0.9011007652815277
      ],
      "expectedYawDeg": 0,
      "observedYawDeg": -0.9749765559056579,
      "errors": {
        "xyMm": 14.49205457578299,
        "zMm": 3.899234718472311,
        "yawDeg": 0.9749765559056579
      },
      "supportId": "product_carton_2",
      "supportCentreZMm": 599.9999774423462,
      "source": "sim/artifacts/multi_carton_campaigns_v2/campaign-12s-qualification-20260910-v6/batch-08-ba327582-43c6-471e-bc25-53e7a69840c9/moveit_result.json",
      "sha256": "3a0d32193bcc6190cb92bcc4245e3fc50372521ab2cc1280aa6c19a39220542d"
    },
    "yawDeg": {
      "sequence": 1,
      "carton": 6,
      "cycle": 6,
      "layer": 2,
      "slotId": "layer_2_outer_right",
      "deltaMm": [
        14.165511630922778,
        -1.7586847954167428,
        -4.176437407273581
      ],
      "expectedXYZm": [
        0.315,
        1.753105061238316,
        0.905
      ],
      "observedXYZm": [
        0.3291655116309228,
        1.7513463764428994,
        0.9008235625927264
      ],
      "expectedYawDeg": 0,
      "observedYawDeg": -0.9853095321405023,
      "errors": {
        "xyMm": 14.27426677540526,
        "zMm": 4.176437407273581,
        "yawDeg": 0.9853095321405023
      },
      "supportId": "product_carton_2",
      "supportCentreZMm": 599.9999733385007,
      "source": "sim/artifacts/multi_carton_campaigns_v2/campaign-12s-qualification-20260910-v6/batch-01-2d016864-5dc8-40f3-b74b-3d81af0ab91b/moveit_result.json",
      "sha256": "2b5353afa95f8adeebfb4007ac39b756c4d183df8dbf1a0d97dd79444646bc52"
    },
    "zMm": {
      "sequence": 4,
      "carton": 12,
      "cycle": 48,
      "layer": 3,
      "slotId": "layer_3_inner_right",
      "deltaMm": [
        -1.9714290771791765,
        -0.4009024276805384,
        -5.12097783643517
      ],
      "expectedXYZm": [
        0.315,
        1.5398157735002536,
        1.205
      ],
      "observedXYZm": [
        0.3130285709228208,
        1.539414871072573,
        1.199879022163565
      ],
      "expectedYawDeg": 0,
      "observedYawDeg": -0.18354142023811754,
      "errors": {
        "xyMm": 2.011779153602027,
        "zMm": 5.12097783643517,
        "yawDeg": 0.1835414202381175
      },
      "supportId": "product_carton_8",
      "supportCentreZMm": 899.9997205971049,
      "source": "sim/artifacts/multi_carton_campaigns_v2/campaign-12s-qualification-20260910-v6/batch-04-87e66463-dc6a-4adf-84bf-652b67ef223d/moveit_result.json",
      "sha256": "f15c6cad47f111b7cb7ff2a326d149534745ab8da83c3a3c725e3dd109de8351"
    }
  },
  "cycles": [
    {
      "index": 1,
      "sequence": 1,
      "carton": 1,
      "seconds": 9.65,
      "xyMm": 2.605563281985752,
      "zMm": 4.24402933714052,
      "yawDeg": 0.23314396993307826,
      "levelDeg": 0.8052037879415934,
      "saturationMs": 0
    },
    {
      "index": 2,
      "sequence": 1,
      "carton": 2,
      "seconds": 9.678,
      "xyMm": 1.5056555694733484,
      "zMm": 4.128472866677169,
      "yawDeg": 0.181732341751074,
      "levelDeg": 0.7262134650025587,
      "saturationMs": 0
    },
    {
      "index": 3,
      "sequence": 1,
      "carton": 3,
      "seconds": 9.934999999999999,
      "xyMm": 4.973770662781334,
      "zMm": 5.029806215012034,
      "yawDeg": 0.4745364274500922,
      "levelDeg": 0.6626964332487262,
      "saturationMs": 0
    },
    {
      "index": 4,
      "sequence": 1,
      "carton": 4,
      "seconds": 10.091000000000001,
      "xyMm": 6.230974079640289,
      "zMm": 4.015165779736707,
      "yawDeg": 0.2332167857203272,
      "levelDeg": 0.6251048242441755,
      "saturationMs": 0
    },
    {
      "index": 5,
      "sequence": 1,
      "carton": 5,
      "seconds": 10.824000000000005,
      "xyMm": 14.37712032174646,
      "zMm": 4.779537031676662,
      "yawDeg": 0.31673010939623353,
      "levelDeg": 0.598072617773127,
      "saturationMs": 10
    },
    {
      "index": 6,
      "sequence": 1,
      "carton": 6,
      "seconds": 10.792000000000002,
      "xyMm": 14.27426677540526,
      "zMm": 4.176437407273581,
      "yawDeg": 0.9853095321405023,
      "levelDeg": 0.5767820143718438,
      "saturationMs": 10
    },
    {
      "index": 7,
      "sequence": 1,
      "carton": 7,
      "seconds": 10.643,
      "xyMm": 13.472523820768567,
      "zMm": 4.35597555437961,
      "yawDeg": 0.0629937016703906,
      "levelDeg": 0.562009582280254,
      "saturationMs": 10
    },
    {
      "index": 8,
      "sequence": 1,
      "carton": 8,
      "seconds": 10.774000000000001,
      "xyMm": 12.494575988938463,
      "zMm": 5.023961380655861,
      "yawDeg": 0.4752250198384836,
      "levelDeg": 0.5456663196068661,
      "saturationMs": 10
    },
    {
      "index": 9,
      "sequence": 1,
      "carton": 9,
      "seconds": 11.466999999999999,
      "xyMm": 3.445498628114628,
      "zMm": 3.4644287118492656,
      "yawDeg": 0.339387841571703,
      "levelDeg": 0.5342056069628427,
      "saturationMs": 10
    },
    {
      "index": 10,
      "sequence": 1,
      "carton": 10,
      "seconds": 11.179000000000002,
      "xyMm": 2.9619089089290567,
      "zMm": 5.113777286364529,
      "yawDeg": 0.21305419024841554,
      "levelDeg": 0.5407465670820528,
      "saturationMs": 10
    },
    {
      "index": 11,
      "sequence": 1,
      "carton": 11,
      "seconds": 11.200999999999993,
      "xyMm": 4.097990636388883,
      "zMm": 5.030296070446916,
      "yawDeg": 0.1539515859077349,
      "levelDeg": 0.5406880755273988,
      "saturationMs": 10
    },
    {
      "index": 12,
      "sequence": 1,
      "carton": 12,
      "seconds": 10.248000000000005,
      "xyMm": 1.8674789663570286,
      "zMm": 3.656993171262668,
      "yawDeg": 0.1350603731705628,
      "levelDeg": 0.5409405167248593,
      "saturationMs": 10
    },
    {
      "index": 13,
      "sequence": 2,
      "carton": 1,
      "seconds": 9.793,
      "xyMm": 3.1016395136411425,
      "zMm": 4.295431584995679,
      "yawDeg": 0.25970139441927487,
      "levelDeg": 0.8018388571063184,
      "saturationMs": 0
    },
    {
      "index": 14,
      "sequence": 2,
      "carton": 2,
      "seconds": 9.774000000000001,
      "xyMm": 1.5260638415749754,
      "zMm": 4.121381988892336,
      "yawDeg": 0.19481012806002299,
      "levelDeg": 0.7211859510551761,
      "saturationMs": 0
    },
    {
      "index": 15,
      "sequence": 2,
      "carton": 3,
      "seconds": 9.958000000000002,
      "xyMm": 5.197892204035562,
      "zMm": 5.028540733550746,
      "yawDeg": 0.47344631693318945,
      "levelDeg": 0.6610958112061098,
      "saturationMs": 0
    },
    {
      "index": 16,
      "sequence": 2,
      "carton": 4,
      "seconds": 10.234000000000002,
      "xyMm": 6.324394811536536,
      "zMm": 5.043097618050552,
      "yawDeg": 0.24182252309296423,
      "levelDeg": 0.623621140396935,
      "saturationMs": 10
    },
    {
      "index": 17,
      "sequence": 2,
      "carton": 5,
      "seconds": 10.82,
      "xyMm": 13.306474678278642,
      "zMm": 3.786427645928736,
      "yawDeg": 0.27630977876925483,
      "levelDeg": 0.6057906315820958,
      "saturationMs": 10
    },
    {
      "index": 18,
      "sequence": 2,
      "carton": 6,
      "seconds": 10.801000000000002,
      "xyMm": 14.306105154306913,
      "zMm": 4.130183701835155,
      "yawDeg": 0.9803183368190953,
      "levelDeg": 0.5801943543239503,
      "saturationMs": 10
    },
    {
      "index": 19,
      "sequence": 2,
      "carton": 7,
      "seconds": 10.831000000000003,
      "xyMm": 12.863266326600614,
      "zMm": 4.567351392922525,
      "yawDeg": 0.16997578324905244,
      "levelDeg": 0.554824291178619,
      "saturationMs": 10
    },
    {
      "index": 20,
      "sequence": 2,
      "carton": 8,
      "seconds": 10.786000000000001,
      "xyMm": 12.630240377897836,
      "zMm": 4.910704633254714,
      "yawDeg": 0.4781143174527693,
      "levelDeg": 0.5465806639908379,
      "saturationMs": 10
    },
    {
      "index": 21,
      "sequence": 2,
      "carton": 9,
      "seconds": 11.262,
      "xyMm": 4.432152275005375,
      "zMm": 3.5972361758793703,
      "yawDeg": 0.1256980888734883,
      "levelDeg": 0.5348376732929978,
      "saturationMs": 10
    },
    {
      "index": 22,
      "sequence": 2,
      "carton": 10,
      "seconds": 11.155999999999992,
      "xyMm": 2.65476211609853,
      "zMm": 3.7951025175895214,
      "yawDeg": 0.15589082654976685,
      "levelDeg": 0.5390328305815189,
      "saturationMs": 10
    },
    {
      "index": 23,
      "sequence": 2,
      "carton": 11,
      "seconds": 11.096000000000004,
      "xyMm": 3.825221820011448,
      "zMm": 4.0301999709317915,
      "yawDeg": 0.1366503037753393,
      "levelDeg": 0.5388274434967002,
      "saturationMs": 10
    },
    {
      "index": 24,
      "sequence": 2,
      "carton": 12,
      "seconds": 10.251999999999995,
      "xyMm": 1.9782877418204396,
      "zMm": 3.650382118503437,
      "yawDeg": 0.1308001707266309,
      "levelDeg": 0.5365817000424187,
      "saturationMs": 10
    },
    {
      "index": 25,
      "sequence": 3,
      "carton": 1,
      "seconds": 9.834999999999999,
      "xyMm": 2.6647452990328464,
      "zMm": 4.246145974447502,
      "yawDeg": 0.22674642256232974,
      "levelDeg": 0.7994098784170092,
      "saturationMs": 0
    },
    {
      "index": 26,
      "sequence": 3,
      "carton": 2,
      "seconds": 9.889000000000003,
      "xyMm": 1.7015424448846734,
      "zMm": 5.062764042451096,
      "yawDeg": 0.20829300933753614,
      "levelDeg": 0.7235302188986168,
      "saturationMs": 0
    },
    {
      "index": 27,
      "sequence": 3,
      "carton": 3,
      "seconds": 9.848000000000003,
      "xyMm": 5.028267115010814,
      "zMm": 5.041711841634933,
      "yawDeg": 0.4702936809187767,
      "levelDeg": 0.6623433541054311,
      "saturationMs": 0
    },
    {
      "index": 28,
      "sequence": 3,
      "carton": 4,
      "seconds": 10.232999999999997,
      "xyMm": 6.280072818626806,
      "zMm": 5.041335787710266,
      "yawDeg": 0.24369170298156953,
      "levelDeg": 0.6207025520658362,
      "saturationMs": 0
    },
    {
      "index": 29,
      "sequence": 3,
      "carton": 5,
      "seconds": 10.815000000000005,
      "xyMm": 13.196706072881303,
      "zMm": 5.01100643389929,
      "yawDeg": 0.2145356308205073,
      "levelDeg": 0.6001879229579856,
      "saturationMs": 0
    },
    {
      "index": 30,
      "sequence": 3,
      "carton": 6,
      "seconds": 10.761999999999993,
      "xyMm": 13.76433375682798,
      "zMm": 5.041111348114136,
      "yawDeg": 0.9778539779278838,
      "levelDeg": 0.5781086926103853,
      "saturationMs": 0
    },
    {
      "index": 31,
      "sequence": 3,
      "carton": 7,
      "seconds": 10.611000000000004,
      "xyMm": 13.58916435081992,
      "zMm": 4.685595129261921,
      "yawDeg": 0.11738072855518607,
      "levelDeg": 0.5564452566048601,
      "saturationMs": 0
    },
    {
      "index": 32,
      "sequence": 3,
      "carton": 8,
      "seconds": 10.769999999999996,
      "xyMm": 12.508567042971094,
      "zMm": 5.023292775182653,
      "yawDeg": 0.4741177510042061,
      "levelDeg": 0.5422831728810138,
      "saturationMs": 0
    },
    {
      "index": 33,
      "sequence": 3,
      "carton": 9,
      "seconds": 11.406000000000006,
      "xyMm": 3.8230339252462997,
      "zMm": 4.584446782084584,
      "yawDeg": 0.31790414373323367,
      "levelDeg": 0.5309352863378507,
      "saturationMs": 0
    },
    {
      "index": 34,
      "sequence": 3,
      "carton": 10,
      "seconds": 11.171000000000006,
      "xyMm": 2.805756374802044,
      "zMm": 4.530049098957489,
      "yawDeg": 0.2078735813402152,
      "levelDeg": 0.5389910356173999,
      "saturationMs": 0
    },
    {
      "index": 35,
      "sequence": 3,
      "carton": 11,
      "seconds": 11.080999999999989,
      "xyMm": 3.896742907415235,
      "zMm": 3.584781082192068,
      "yawDeg": 0.11284824859665148,
      "levelDeg": 0.539422750210278,
      "saturationMs": 0
    },
    {
      "index": 36,
      "sequence": 3,
      "carton": 12,
      "seconds": 10.27600000000001,
      "xyMm": 1.5187749735805363,
      "zMm": 3.644796634038494,
      "yawDeg": 0.15080636401211658,
      "levelDeg": 0.5376441525954334,
      "saturationMs": 0
    },
    {
      "index": 37,
      "sequence": 4,
      "carton": 1,
      "seconds": 9.793000000000003,
      "xyMm": 2.9860998141857267,
      "zMm": 4.805306303116597,
      "yawDeg": 0.24386270703735147,
      "levelDeg": 0.8045611086189268,
      "saturationMs": 0
    },
    {
      "index": 38,
      "sequence": 4,
      "carton": 2,
      "seconds": 9.674,
      "xyMm": 1.4852527896008498,
      "zMm": 4.1216065185247786,
      "yawDeg": 0.19131952983045195,
      "levelDeg": 0.7224058791423431,
      "saturationMs": 0
    },
    {
      "index": 39,
      "sequence": 4,
      "carton": 3,
      "seconds": 9.922,
      "xyMm": 5.196509313614108,
      "zMm": 5.078639212125813,
      "yawDeg": 0.47508654862820776,
      "levelDeg": 0.6591779601208714,
      "saturationMs": 0
    },
    {
      "index": 40,
      "sequence": 4,
      "carton": 4,
      "seconds": 10.088000000000001,
      "xyMm": 6.372778811637236,
      "zMm": 3.93776257235523,
      "yawDeg": 0.23186323041286525,
      "levelDeg": 0.6166676700987352,
      "saturationMs": 0
    },
    {
      "index": 41,
      "sequence": 4,
      "carton": 5,
      "seconds": 10.814,
      "xyMm": 13.347387237380705,
      "zMm": 4.778354707842158,
      "yawDeg": 0.2429055843610806,
      "levelDeg": 0.6058977341773897,
      "saturationMs": 0
    },
    {
      "index": 42,
      "sequence": 4,
      "carton": 6,
      "seconds": 10.817999999999998,
      "xyMm": 14.011535118132437,
      "zMm": 4.4475961042170775,
      "yawDeg": 0.9766375724890741,
      "levelDeg": 0.5757380364476035,
      "saturationMs": 0
    },
    {
      "index": 43,
      "sequence": 4,
      "carton": 7,
      "seconds": 10.63900000000001,
      "xyMm": 13.800486612812206,
      "zMm": 4.563370355693208,
      "yawDeg": 0.06939470625119325,
      "levelDeg": 0.5570049430095736,
      "saturationMs": 0
    },
    {
      "index": 44,
      "sequence": 4,
      "carton": 8,
      "seconds": 10.774000000000001,
      "xyMm": 12.53577242083417,
      "zMm": 5.0205575055535245,
      "yawDeg": 0.4703962733531849,
      "levelDeg": 0.5459081877715732,
      "saturationMs": 0
    },
    {
      "index": 45,
      "sequence": 4,
      "carton": 9,
      "seconds": 11.525999999999996,
      "xyMm": 3.3665108984155303,
      "zMm": 3.7036044134381996,
      "yawDeg": 0.32621903726463486,
      "levelDeg": 0.5356624400742334,
      "saturationMs": 0
    },
    {
      "index": 46,
      "sequence": 4,
      "carton": 10,
      "seconds": 11.158999999999992,
      "xyMm": 2.4481774718791804,
      "zMm": 3.6490175328580676,
      "yawDeg": 0.20176909834046522,
      "levelDeg": 0.5373444642838621,
      "saturationMs": 0
    },
    {
      "index": 47,
      "sequence": 4,
      "carton": 11,
      "seconds": 11.021,
      "xyMm": 4.021403383559418,
      "zMm": 3.4280619106248356,
      "yawDeg": 0.08105032025475122,
      "levelDeg": 0.5397797201531915,
      "saturationMs": 0
    },
    {
      "index": 48,
      "sequence": 4,
      "carton": 12,
      "seconds": 10.304000000000002,
      "xyMm": 2.011779153602027,
      "zMm": 5.12097783643517,
      "yawDeg": 0.1835414202381175,
      "levelDeg": 0.5376398224571659,
      "saturationMs": 0
    },
    {
      "index": 49,
      "sequence": 5,
      "carton": 1,
      "seconds": 9.987,
      "xyMm": 2.8761003587632543,
      "zMm": 4.287140907593301,
      "yawDeg": 0.24932341077181377,
      "levelDeg": 0.8045749229043935,
      "saturationMs": 0
    },
    {
      "index": 50,
      "sequence": 5,
      "carton": 2,
      "seconds": 9.797,
      "xyMm": 0.9464092739056057,
      "zMm": 4.198577731324593,
      "yawDeg": 0.19210933971876393,
      "levelDeg": 0.7200369899625088,
      "saturationMs": 0
    },
    {
      "index": 51,
      "sequence": 5,
      "carton": 3,
      "seconds": 10.001000000000001,
      "xyMm": 5.997643050131803,
      "zMm": 5.053327788855477,
      "yawDeg": 0.46908588014285585,
      "levelDeg": 0.6593511055345118,
      "saturationMs": 0
    },
    {
      "index": 52,
      "sequence": 5,
      "carton": 4,
      "seconds": 10.101999999999997,
      "xyMm": 6.668933037894335,
      "zMm": 3.9411552188943766,
      "yawDeg": 0.231793112831992,
      "levelDeg": 0.6160492577277807,
      "saturationMs": 0
    },
    {
      "index": 53,
      "sequence": 5,
      "carton": 5,
      "seconds": 10.760000000000005,
      "xyMm": 13.148023482022614,
      "zMm": 3.7885510291706392,
      "yawDeg": 0.3291879322192773,
      "levelDeg": 0.5976648935991875,
      "saturationMs": 10
    },
    {
      "index": 54,
      "sequence": 5,
      "carton": 6,
      "seconds": 10.792999999999992,
      "xyMm": 14.10013578425595,
      "zMm": 3.9005768630470117,
      "yawDeg": 0.9466144313709887,
      "levelDeg": 0.5740513203962507,
      "saturationMs": 10
    },
    {
      "index": 55,
      "sequence": 5,
      "carton": 7,
      "seconds": 10.682000000000002,
      "xyMm": 12.177672222103409,
      "zMm": 4.563738384105398,
      "yawDeg": 0.07811875957912492,
      "levelDeg": 0.5591420560979401,
      "saturationMs": 10
    },
    {
      "index": 56,
      "sequence": 5,
      "carton": 8,
      "seconds": 10.735,
      "xyMm": 12.64481312372624,
      "zMm": 5.018106847734183,
      "yawDeg": 0.4767740047774758,
      "levelDeg": 0.5447759564127779,
      "saturationMs": 10
    },
    {
      "index": 57,
      "sequence": 5,
      "carton": 9,
      "seconds": 11.457000000000008,
      "xyMm": 3.26798070386181,
      "zMm": 3.373041855055048,
      "yawDeg": 0.32337125745833484,
      "levelDeg": 0.5360916193279621,
      "saturationMs": 10
    },
    {
      "index": 58,
      "sequence": 5,
      "carton": 10,
      "seconds": 11.164000000000001,
      "xyMm": 2.006936827511966,
      "zMm": 4.867847173678053,
      "yawDeg": 0.21578993887178774,
      "levelDeg": 0.5369251956865781,
      "saturationMs": 10
    },
    {
      "index": 59,
      "sequence": 5,
      "carton": 11,
      "seconds": 11.168000000000006,
      "xyMm": 3.7008639079577543,
      "zMm": 3.4353367361485976,
      "yawDeg": 0.12065300919945439,
      "levelDeg": 0.5385294095066939,
      "saturationMs": 10
    },
    {
      "index": 60,
      "sequence": 5,
      "carton": 12,
      "seconds": 10.263999999999982,
      "xyMm": 2.255819776937238,
      "zMm": 4.538095302449863,
      "yawDeg": 0.14442262478371407,
      "levelDeg": 0.5388276601237152,
      "saturationMs": 10
    },
    {
      "index": 61,
      "sequence": 6,
      "carton": 1,
      "seconds": 9.908000000000001,
      "xyMm": 2.8231694530635694,
      "zMm": 4.87567885994411,
      "yawDeg": 0.24880681025447576,
      "levelDeg": 0.8011749706052882,
      "saturationMs": 10
    },
    {
      "index": 62,
      "sequence": 6,
      "carton": 2,
      "seconds": 9.811,
      "xyMm": 1.1062886368365026,
      "zMm": 4.116882329673555,
      "yawDeg": 0.19060458973791264,
      "levelDeg": 0.7142428839436263,
      "saturationMs": 10
    },
    {
      "index": 63,
      "sequence": 6,
      "carton": 3,
      "seconds": 9.841999999999999,
      "xyMm": 6.17776891809631,
      "zMm": 4.009242743502339,
      "yawDeg": 0.45089883704100314,
      "levelDeg": 0.655808622491449,
      "saturationMs": 10
    },
    {
      "index": 64,
      "sequence": 6,
      "carton": 4,
      "seconds": 10.134,
      "xyMm": 6.637861665840747,
      "zMm": 4.932084627064626,
      "yawDeg": 0.24119920205538675,
      "levelDeg": 0.6241699010278694,
      "saturationMs": 10
    },
    {
      "index": 65,
      "sequence": 6,
      "carton": 5,
      "seconds": 10.852000000000004,
      "xyMm": 13.353258264073666,
      "zMm": 4.567057215787318,
      "yawDeg": 0.19085840147871103,
      "levelDeg": 0.5953084385134417,
      "saturationMs": 10
    },
    {
      "index": 66,
      "sequence": 6,
      "carton": 6,
      "seconds": 10.838999999999999,
      "xyMm": 13.938400432881489,
      "zMm": 5.034791297823471,
      "yawDeg": 0.972636418862545,
      "levelDeg": 0.5784874203940973,
      "saturationMs": 10
    },
    {
      "index": 67,
      "sequence": 6,
      "carton": 7,
      "seconds": 10.823999999999998,
      "xyMm": 13.35834615710984,
      "zMm": 4.357790533717432,
      "yawDeg": 0.22115283649912024,
      "levelDeg": 0.5586894735457122,
      "saturationMs": 10
    },
    {
      "index": 68,
      "sequence": 6,
      "carton": 8,
      "seconds": 10.698999999999998,
      "xyMm": 12.88975289818083,
      "zMm": 4.045361770524503,
      "yawDeg": 0.464351096312245,
      "levelDeg": 0.5426309409776309,
      "saturationMs": 10
    },
    {
      "index": 69,
      "sequence": 6,
      "carton": 9,
      "seconds": 11.408000000000001,
      "xyMm": 3.522636683333852,
      "zMm": 4.469474461715306,
      "yawDeg": 0.31705994922009906,
      "levelDeg": 0.5363888375341048,
      "saturationMs": 10
    },
    {
      "index": 70,
      "sequence": 6,
      "carton": 10,
      "seconds": 11.156000000000006,
      "xyMm": 2.750605291296217,
      "zMm": 3.6327695896005707,
      "yawDeg": 0.1469516756300811,
      "levelDeg": 0.5392558778868164,
      "saturationMs": 10
    },
    {
      "index": 71,
      "sequence": 6,
      "carton": 11,
      "seconds": 11.031999999999996,
      "xyMm": 3.9160434894429064,
      "zMm": 3.419265082735601,
      "yawDeg": 0.07876635735827225,
      "levelDeg": 0.5410298692152651,
      "saturationMs": 10
    },
    {
      "index": 72,
      "sequence": 6,
      "carton": 12,
      "seconds": 10.240000000000009,
      "xyMm": 2.187987083966416,
      "zMm": 3.7112736855053896,
      "yawDeg": 0.12199238692659163,
      "levelDeg": 0.5376004768218507,
      "saturationMs": 10
    },
    {
      "index": 73,
      "sequence": 7,
      "carton": 1,
      "seconds": 9.981000000000002,
      "xyMm": 2.8519935860048093,
      "zMm": 4.247587117618301,
      "yawDeg": 0.2389755471815886,
      "levelDeg": 0.8041790380865876,
      "saturationMs": 0
    },
    {
      "index": 74,
      "sequence": 7,
      "carton": 2,
      "seconds": 9.818000000000001,
      "xyMm": 1.7072645767656232,
      "zMm": 5.058077169211583,
      "yawDeg": 0.21134128387360318,
      "levelDeg": 0.7198635210148865,
      "saturationMs": 10
    },
    {
      "index": 75,
      "sequence": 7,
      "carton": 3,
      "seconds": 9.850999999999999,
      "xyMm": 5.1754905783295015,
      "zMm": 5.032315873220283,
      "yawDeg": 0.4746878011620902,
      "levelDeg": 0.6563106696043093,
      "saturationMs": 10
    },
    {
      "index": 76,
      "sequence": 7,
      "carton": 4,
      "seconds": 10.038000000000004,
      "xyMm": 6.6149637703104665,
      "zMm": 5.0454393058527724,
      "yawDeg": 0.2446286120455522,
      "levelDeg": 0.6192674428649951,
      "saturationMs": 10
    },
    {
      "index": 77,
      "sequence": 7,
      "carton": 5,
      "seconds": 10.736999999999995,
      "xyMm": 13.156323590967125,
      "zMm": 4.157022391895082,
      "yawDeg": 0.2519721844124362,
      "levelDeg": 0.5999551678220882,
      "saturationMs": 10
    },
    {
      "index": 78,
      "sequence": 7,
      "carton": 6,
      "seconds": 10.75200000000001,
      "xyMm": 14.252418561671197,
      "zMm": 4.173469148395337,
      "yawDeg": 0.9718590902690569,
      "levelDeg": 0.5756417660729909,
      "saturationMs": 10
    },
    {
      "index": 79,
      "sequence": 7,
      "carton": 7,
      "seconds": 10.822999999999993,
      "xyMm": 13.838020886892853,
      "zMm": 5.03097004662556,
      "yawDeg": 0.2047119374369358,
      "levelDeg": 0.5563465062755597,
      "saturationMs": 10
    },
    {
      "index": 80,
      "sequence": 7,
      "carton": 8,
      "seconds": 10.793000000000006,
      "xyMm": 12.540528919065576,
      "zMm": 5.020920757450309,
      "yawDeg": 0.4745942319125726,
      "levelDeg": 0.5431259054602151,
      "saturationMs": 10
    },
    {
      "index": 81,
      "sequence": 7,
      "carton": 9,
      "seconds": 11.450999999999993,
      "xyMm": 3.2933765543786335,
      "zMm": 3.3755164501676482,
      "yawDeg": 0.3232002086549634,
      "levelDeg": 0.5358401681803997,
      "saturationMs": 10
    },
    {
      "index": 82,
      "sequence": 7,
      "carton": 10,
      "seconds": 11.164000000000001,
      "xyMm": 1.7119398062011746,
      "zMm": 4.992014202650497,
      "yawDeg": 0.25005102993085104,
      "levelDeg": 0.5384558362592315,
      "saturationMs": 10
    },
    {
      "index": 83,
      "sequence": 7,
      "carton": 11,
      "seconds": 11.171999999999997,
      "xyMm": 3.8952269945806903,
      "zMm": 3.949175842895558,
      "yawDeg": 0.08181860527758851,
      "levelDeg": 0.5408699675768105,
      "saturationMs": 10
    },
    {
      "index": 84,
      "sequence": 7,
      "carton": 12,
      "seconds": 10.27600000000001,
      "xyMm": 2.196647530232966,
      "zMm": 3.697877846487563,
      "yawDeg": 0.12318027341902434,
      "levelDeg": 0.5406101087134942,
      "saturationMs": 10
    },
    {
      "index": 85,
      "sequence": 8,
      "carton": 1,
      "seconds": 9.847000000000001,
      "xyMm": 2.821579881484376,
      "zMm": 4.257404818184818,
      "yawDeg": 0.24362439974601433,
      "levelDeg": 0.8011165718001507,
      "saturationMs": 0
    },
    {
      "index": 86,
      "sequence": 8,
      "carton": 2,
      "seconds": 9.791,
      "xyMm": 1.0529003255474967,
      "zMm": 4.163806075939469,
      "yawDeg": 0.19856950307069512,
      "levelDeg": 0.7151939310777209,
      "saturationMs": 0
    },
    {
      "index": 87,
      "sequence": 8,
      "carton": 3,
      "seconds": 9.942,
      "xyMm": 5.885696511904566,
      "zMm": 5.026710273569157,
      "yawDeg": 0.46917621328768083,
      "levelDeg": 0.6589490666533777,
      "saturationMs": 0
    },
    {
      "index": 88,
      "sequence": 8,
      "carton": 4,
      "seconds": 10.188000000000002,
      "xyMm": 6.60136145638572,
      "zMm": 3.9416980158150094,
      "yawDeg": 0.22767336941045696,
      "levelDeg": 0.6188771605955168,
      "saturationMs": 0
    },
    {
      "index": 89,
      "sequence": 8,
      "carton": 5,
      "seconds": 10.798000000000002,
      "xyMm": 13.866089878404543,
      "zMm": 4.999819032674879,
      "yawDeg": 0.3016815623149306,
      "levelDeg": 0.604246027025809,
      "saturationMs": 0
    },
    {
      "index": 90,
      "sequence": 8,
      "carton": 6,
      "seconds": 10.827999999999996,
      "xyMm": 14.49205457578299,
      "zMm": 3.899234718472311,
      "yawDeg": 0.9749765559056579,
      "levelDeg": 0.575369200056258,
      "saturationMs": 0
    },
    {
      "index": 91,
      "sequence": 8,
      "carton": 7,
      "seconds": 10.631,
      "xyMm": 12.638818722775529,
      "zMm": 5.045694314871563,
      "yawDeg": 0.07758087459878206,
      "levelDeg": 0.5611965485917523,
      "saturationMs": 0
    },
    {
      "index": 92,
      "sequence": 8,
      "carton": 8,
      "seconds": 10.713000000000008,
      "xyMm": 12.54595042871934,
      "zMm": 5.022124438750386,
      "yawDeg": 0.47497505855807665,
      "levelDeg": 0.5425588896314224,
      "saturationMs": 0
    },
    {
      "index": 93,
      "sequence": 8,
      "carton": 9,
      "seconds": 11.254999999999995,
      "xyMm": 4.088834125102517,
      "zMm": 5.074776421470473,
      "yawDeg": 0.18148426770633405,
      "levelDeg": 0.53625942279578,
      "saturationMs": 0
    },
    {
      "index": 94,
      "sequence": 8,
      "carton": 10,
      "seconds": 11.171999999999997,
      "xyMm": 2.560752394529832,
      "zMm": 3.6288402113857643,
      "yawDeg": 0.1949531906241776,
      "levelDeg": 0.5376823447251411,
      "saturationMs": 0
    },
    {
      "index": 95,
      "sequence": 8,
      "carton": 11,
      "seconds": 11.070999999999998,
      "xyMm": 4.153356827395387,
      "zMm": 4.628498587208707,
      "yawDeg": 0.08926595559103297,
      "levelDeg": 0.5402190151213659,
      "saturationMs": 0
    },
    {
      "index": 96,
      "sequence": 8,
      "carton": 12,
      "seconds": 10.253000000000014,
      "xyMm": 2.2677540395569693,
      "zMm": 3.679359087660261,
      "yawDeg": 0.12136766962711772,
      "levelDeg": 0.5398497804334994,
      "saturationMs": 0
    },
    {
      "index": 97,
      "sequence": 9,
      "carton": 1,
      "seconds": 9.834999999999999,
      "xyMm": 2.840800881603825,
      "zMm": 4.255953376538835,
      "yawDeg": 0.23432231417655344,
      "levelDeg": 0.8007783429002444,
      "saturationMs": 0
    },
    {
      "index": 98,
      "sequence": 9,
      "carton": 2,
      "seconds": 9.758000000000003,
      "xyMm": 1.1135149263122164,
      "zMm": 4.318280875984293,
      "yawDeg": 0.20110004877443452,
      "levelDeg": 0.7185469028217568,
      "saturationMs": 0
    },
    {
      "index": 99,
      "sequence": 9,
      "carton": 3,
      "seconds": 9.837999999999997,
      "xyMm": 5.945483487886427,
      "zMm": 4.056670539423934,
      "yawDeg": 0.4486874929936455,
      "levelDeg": 0.6636655597753958,
      "saturationMs": 0
    },
    {
      "index": 100,
      "sequence": 9,
      "carton": 4,
      "seconds": 10.088000000000001,
      "xyMm": 6.823842839028673,
      "zMm": 4.135196763021209,
      "yawDeg": 0.23191884673236512,
      "levelDeg": 0.618625915202685,
      "saturationMs": 0
    },
    {
      "index": 101,
      "sequence": 9,
      "carton": 5,
      "seconds": 10.82,
      "xyMm": 13.000424888196289,
      "zMm": 4.239923546146218,
      "yawDeg": 0.26436404476924025,
      "levelDeg": 0.6020079701906127,
      "saturationMs": 10
    },
    {
      "index": 102,
      "sequence": 9,
      "carton": 6,
      "seconds": 10.901000000000003,
      "xyMm": 14.042607178959036,
      "zMm": 4.922724267171663,
      "yawDeg": 0.974790617000357,
      "levelDeg": 0.5792916860634989,
      "saturationMs": 10
    },
    {
      "index": 103,
      "sequence": 9,
      "carton": 7,
      "seconds": 10.783000000000001,
      "xyMm": 13.671040913598182,
      "zMm": 4.160319740918905,
      "yawDeg": 0.20166062077487773,
      "levelDeg": 0.5557434407603097,
      "saturationMs": 10
    },
    {
      "index": 104,
      "sequence": 9,
      "carton": 8,
      "seconds": 10.763000000000005,
      "xyMm": 12.638822038974103,
      "zMm": 5.026627564036601,
      "yawDeg": 0.482349356854015,
      "levelDeg": 0.5419499829278607,
      "saturationMs": 10
    },
    {
      "index": 105,
      "sequence": 9,
      "carton": 9,
      "seconds": 11.308999999999997,
      "xyMm": 3.7221969123160674,
      "zMm": 3.445859762000403,
      "yawDeg": 0.16761651666182878,
      "levelDeg": 0.5388306349776286,
      "saturationMs": 10
    },
    {
      "index": 106,
      "sequence": 9,
      "carton": 10,
      "seconds": 11.171999999999997,
      "xyMm": 2.235746091799491,
      "zMm": 3.7517606212205123,
      "yawDeg": 0.21381902002215594,
      "levelDeg": 0.5384083734206655,
      "saturationMs": 10
    },
    {
      "index": 107,
      "sequence": 9,
      "carton": 11,
      "seconds": 11.039000000000001,
      "xyMm": 3.916733504349321,
      "zMm": 3.5736270607240606,
      "yawDeg": 0.08133515081869572,
      "levelDeg": 0.5403467426148723,
      "saturationMs": 10
    },
    {
      "index": 108,
      "sequence": 9,
      "carton": 12,
      "seconds": 10.296999999999997,
      "xyMm": 2.0091677002992885,
      "zMm": 3.666832634284134,
      "yawDeg": 0.1551655835168625,
      "levelDeg": 0.5378825177184723,
      "saturationMs": 10
    }
  ]
} as const
