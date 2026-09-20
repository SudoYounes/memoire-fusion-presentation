// Read the frozen campaign without modifying its files. Emit an apply_patch patch.
// Rebuild with: node scripts/results/extract-results.mjs | apply_patch
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = process.env.ROBOT2_SOURCE ?? '/Users/macair/Documents/robot2-cad'
const read = file => fs.readFileSync(`${root}/${file}`, 'utf8')
const hash = file => createHash('sha256').update(read(file)).digest('hex')
const auditPath = 'sim/audit/2026-09-10/12s-baseline-analytics-v6.json'
const audit = JSON.parse(read(auditPath))
const reportPath = audit.campaign.qualification_report
const report = JSON.parse(read(reportPath))
assert.equal(hash(reportPath), audit.identity.qualification_report_sha256)
const scenarioPath = `sim/${report.acceptance_policy.scenario_path}`
assert.equal(hash(scenarioPath), report.acceptance_policy.scenario_sha256)
const scenario = JSON.parse(read(scenarioPath))
const contractPath = `sim/${report.acceptance_policy.multilayer_contract_path}`
assert.equal(hash(contractPath), report.acceptance_policy.multilayer_contract_sha256)
const contract = JSON.parse(read(contractPath))
const csvPath = 'sim/artifacts/baseline_analytics_multilayer_12s_v6/campaign_cycle_metrics.csv'
assert.equal(hash(csvPath), audit.identity.campaign_cycle_metrics_sha256)
const [header, ...lines] = read(csvPath).trim().split(/\r?\n/).map(line => line.split(','))
const rows = lines.map(row => Object.fromEntries(header.map((key, i) => [key, row[i]])))
const cycles = rows.map(row => ({
  index: +row.campaign_cycle_index, sequence: +row.batch_index, carton: +row.carton_index,
  seconds: +row.cell_cycle_duration_sim_s, xyMm: +row.placement_xy_error_m * 1000,
  zMm: +row.placement_z_error_m * 1000, yawDeg: +row.placement_yaw_error_deg,
  levelDeg: +row.q2_q3_max_error_deg, saturationMs: +row.saturation_global_max_contiguous_s * 1000,
}))
assert.equal(cycles.length, 108)
assert(rows.every(row => row.status === 'PASS'))
assert(cycles.every((row, i) => row.index === i + 1 && row.sequence === Math.floor(i / 12) + 1 && row.carton === i % 12 + 1))
const maximum = key => cycles.reduce((best, row) => row[key] > best[key] ? row : best)
const close = (a, b) => assert(Math.abs(a - b) < 1e-9)
close(maximum('seconds').seconds, audit.metrics.cell_cycle_max_sim_s)
close(cycles.reduce((sum, row) => sum + row.seconds, 0) / cycles.length, audit.metrics.cell_cycle_mean_sim_s)
for (const [key, field, scale] of [
  ['xyMm', 'maximum_placement_xy_m', 1000], ['zMm', 'maximum_placement_z_m', 1000],
  ['yawDeg', 'maximum_placement_yaw_deg', 1], ['levelDeg', 'maximum_q2_q3_error_deg', 1],
  ['saturationMs', 'maximum_contiguous_saturation_s', 1000],
]) close(maximum(key)[key], audit.metrics[field] * scale)

const worstXY = maximum('xyMm')
const run = report.runs.find(run => run.batch_index === worstXY.sequence)
assert.equal(hash(run.result_path), run.result_sha256)
const result = JSON.parse(read(run.result_path))
const pose = result.placement_evidence.find(p => p.carton_index === worstXY.carton && Math.abs(p.errors.xy_m * 1000 - worstXY.xyMm) < 1e-9)
assert(pose && pose.status === 'PLACEMENT_VERIFIED')
const deltaMm = pose.observed_xyz_m.map((n, i) => (n - pose.expected_xyz_m[i]) * 1000)
close(Math.hypot(...deltaMm.slice(0, 2)), worstXY.xyMm)
const placementCases = Object.fromEntries([['xyMm','xy_m',1000],['yawDeg','yaw_deg',1],['zMm','z_m',1000]].map(([key,field,factor])=>{
  const cycle = maximum(key)
  const source = report.runs.find(run=>run.batch_index===cycle.sequence)
  assert.equal(hash(source.result_path),source.result_sha256)
  const raw = JSON.parse(read(source.result_path))
  const p = raw.placement_evidence.find(p=>p.carton_index===cycle.carton && Math.abs(p.errors[field]*factor-cycle[key])<1e-9)
  assert(p && p.status==='PLACEMENT_VERIFIED')
  const slot = contract.slots.find(slot=>slot.slot_id===p.slot_id)
  assert(slot)
  const signed = p.observed_xyz_m.map((n,i)=>(n-p.expected_xyz_m[i])*1000)
  close(Math.hypot(...signed.slice(0,2)),p.errors.xy_m*1000)
  close(Math.abs(signed[2]),p.errors.z_m*1000)
  close(Math.abs(p.observed_yaw_rad-p.expected_yaw_rad)*180/Math.PI,p.errors.yaw_deg)
  return [key,{sequence:cycle.sequence,carton:cycle.carton,cycle:cycle.index,layer:p.layer_index,slotId:p.slot_id,deltaMm:signed,expectedXYZm:p.expected_xyz_m,observedXYZm:p.observed_xyz_m,expectedYawDeg:p.expected_yaw_rad*180/Math.PI,observedYawDeg:p.observed_yaw_rad*180/Math.PI,errors:{xyMm:p.errors.xy_m*1000,zMm:p.errors.z_m*1000,yawDeg:p.errors.yaw_deg},supportId:p.support_kind,supportCentreZMm:p.support_pose?(p.observed_xyz_m[2]-p.support_pose.centre_delta_z_m)*1000:null,source:source.result_path,sha256:hash(source.result_path)}]
}))
const placement = scenario.multi_carton.placement_tolerances
const limits = {
  seconds: audit.campaign.acceptance_target_s_per_carton,
  xyMm: placement.xy_m * 1000, zMm: placement.z_m * 1000, yawDeg: placement.yaw_deg,
  levelDeg: scenario.multi_carton.q2_q3.observed_tolerance_deg,
  saturationMs: scenario.acceptance.persistent_saturation_duration_s * 1000,
}
assert(Object.values(limits).every(Number.isFinite))
assert.deepEqual(limits, { seconds: 12, xyMm: 25, zMm: 15, yawDeg: 2, levelDeg: 1, saturationMs: 50 })
for (const key of Object.keys(limits)) assert(cycles.every(row => row[key] < limits[key]))
const data = {
  provenance: { audit: auditPath, csv: csvPath, csvSha256: hash(csvPath), report: reportPath, reportSha256: hash(reportPath), scenario: scenarioPath, scenarioSha256: hash(scenarioPath), poseRun: run.result_path, poseRunSha256: hash(run.result_path), scope: audit.scope },
  sequenceCount: report.runs.length, cartonsPerSequence: 12, declaredResets: report.declared_sequence_resets,
  acceptedCycles: report.accepted_cycle_count, resetTimeIncluded: report.reset_time_included,
  continuousFlowClaim: report.continuous_material_flow_claim, releaseCredit: report.release_credit,
  meanSeconds: audit.metrics.cell_cycle_mean_sim_s, limits,
  worstXY: { sequence: worstXY.sequence, carton: worstXY.carton, cycle: worstXY.index, deltaMm, yawDeg: pose.observed_yaw_rad * 180 / Math.PI, expectedXYZm: pose.expected_xyz_m, observedXYZm: pose.observed_xyz_m },
  geometry: { cartonMm:contract.geometry.carton_dimensions_xyz_m.map(n=>n*1000),palletMm:contract.geometry.pallet_dimensions_xyz_m.map(n=>n*1000),tangentOffsetsMm:contract.geometry.tangent_offsets_m.map(n=>n*1000),rowOffsetsMm:Object.fromEntries(Object.entries(contract.geometry.row_offsets_from_pallet_center_m).map(([k,n])=>[k,n*1000])),contract:contractPath,sha256:hash(contractPath) },
  placementCases,
  cycles,
}
const source = `// Generated from frozen v6 campaign data. See scripts/results/extract-results.mjs.\nexport const resultsEvidence = ${JSON.stringify(data, null, 2)} as const\n`
const destination = fileURLToPath(new URL('../../src/content/resultsEvidence.ts', import.meta.url))
const existing = fs.existsSync(destination) ? fs.readFileSync(destination, 'utf8') : null
if (existing === source) { console.error('Results evidence is current.'); process.exit(0) }
const body = source.trimEnd().split('\n').map(line => '+' + line).join('\n')
console.log(`*** Begin Patch\n${existing === null ? `*** Add File: ${destination}\n` : `*** Update File: ${destination}\n@@\n${existing.trimEnd().split('\n').map(line => '-' + line).join('\n')}\n`}${body}\n*** End Patch`)
console.error(JSON.stringify({ cycles: cycles.length, sequences: report.runs.length, limits, maximumCycle: maximum('seconds').index, worstXYCycle: worstXY.index }))
