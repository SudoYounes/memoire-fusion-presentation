import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
const root = (process.env.ROBOT2_SOURCE ?? '/Users/macair/Documents/robot2-cad').replace(/\/$/, '') + '/'
const run = 'sim/artifacts/multi_carton_campaigns_v2/campaign-12s-qualification-20260910-v6/batch-04-87e66463-dc6a-4adf-84bf-652b67ef223d/'
const stage = 'composite_loaded_lift_transfer_9'
const read = name => fs.readFileSync(root + name, 'utf8')
const sha = name => createHash('sha256').update(read(name)).digest('hex')
const parse = name => {
  const rows = read(run + name).trim().split(/\r?\n/).map(line => line.split(','))
  const header = rows.shift()
  return rows.filter(row => row[1] === stage).map(row => Object.fromEntries(header.map((key, i) => [key, row[i]])))
}
const frozen = JSON.parse(read('sim/audit/2026-09-10/12s-baseline-analytics-v6.json'))
assert.equal(sha(run + 'controller_state.csv'), frozen.identity.reference_controller_state_sha256)
assert.equal(sha(run + 'effort_plant_control_terms.csv'), frozen.identity.reference_effort_plant_control_terms_sha256)
const control = parse('controller_state.csv'), plant = parse('effort_plant_control_terms.csv')
const origin = +control[0].message_stamp_s - +control[0].stage_time_s
const controller = control.map(row => {
  const ref = +row.joint_1_reference_position_rad, feedback = +row.joint_1_feedback_position_rad, error = +row.joint_1_error_position_rad
  assert(Math.abs(ref - feedback - error) < 1e-12)
  return [+row.message_stamp_s - origin, ref * 180 / Math.PI, feedback * 180 / Math.PI, error * 1000]
})
const efforts = plant.map(row => {
  const component = key => +row['joint_2_' + key] - +row['joint_3_' + key]
  const gravity = component('gravity_generalized_Nm'), anticipation = component('dynamic_feedforward_generalized_Nm'), correction = component('controller_command_generalized_Nm')
  const request = +row.actuator_j2_coupled_requested_actuator_Nm, limited = +row.actuator_j2_coupled_limited_actuator_Nm
  const applied = component('applied_generalized_Nm'), armature = +row.actuator_j2_coupled_armature_reaction_actuator_Nm, brake = +row.actuator_j2_coupled_brake_actuator_Nm
  assert(Math.abs(gravity + anticipation + correction - request) < 1e-9)
  assert(Math.abs(limited - request) < 1e-9)
  assert(Math.abs(limited - armature + brake - applied) < 1e-9)
  assert.equal(row.startup_hold_active, 'False')
  return [+row.plant_ros_time_s - origin, gravity, anticipation, correction, request, limited, applied, armature, brake]
})
const peak = efforts.reduce((best, row) => Math.abs(row[4]) > Math.abs(best[4]) ? row : best)
const maxError = controller.reduce((best,row)=>Math.abs(row[3])>Math.abs(best[3])?row:best)
const files = ['controller_state.csv','effort_plant_control_terms.csv']
const provenance = { run, stage, originRosS: origin, controllerSamples: controller.length, plantSamples: efforts.length, errorSign: 'reference minus feedback', effortCoordinates: 'actuator_j2_coupled = generalized_joint_2 - generalized_joint_3', hashes: Object.fromEntries(files.map(file=>[file,sha(run+file)])), frozenManifest: 'sim/audit/2026-09-10/12s-baseline-analytics-v6.json', limits: 'One loaded transfer only; no causal comparison or real-robot qualification.' }
const round = rows => rows.map(row => row.map(value => Number(value.toFixed(9))))
const source = `// Generated from frozen runtime traces. Tuple units are defined below.\nexport const runtimeEvidence = {\n  provenance: ${JSON.stringify(provenance,null,2)},\n  // [simulation time from action start (s), J1 reference (deg), feedback (deg), error (mrad)]\n  controller: ${JSON.stringify(round(controller))},\n  // [time (s), gravity, anticipation, correction, request, limited, applied, armature, brake] in actuator J2 N.m\n  efforts: ${JSON.stringify(round(efforts))},\n  peak: ${JSON.stringify(peak)},\n  maxError: ${JSON.stringify(maxError)},\n} as const\n`
const dest = fileURLToPath(new URL('../../src/content/runtimeEvidence.ts', import.meta.url))
process.stdout.write('*** Begin Patch\n*** Add File: '+dest+'\n'+source.split('\n').map(line=>'+'+line).join('\n')+'\n*** End Patch\n')
process.stderr.write(JSON.stringify({provenance,peak,maxError})+'\n')

