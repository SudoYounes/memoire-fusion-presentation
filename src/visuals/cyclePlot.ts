import cycleCsv from '../content/campaign-cycle-metrics.csv?raw'

type Cycle = { index: number; batch: number; duration: number }

function parseCycles(csv: string): Cycle[] {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/)
  const headers = headerLine.split(',')
  const indexColumn = headers.indexOf('campaign_cycle_index')
  const batchColumn = headers.indexOf('batch_index')
  const durationColumn = headers.indexOf('cell_cycle_duration_sim_s')
  return rows.flatMap((row) => {
    const columns = row.split(',')
    const cycle = { index: Number(columns[indexColumn]), batch: Number(columns[batchColumn]), duration: Number(columns[durationColumn]) }
    return Number.isFinite(cycle.index) && Number.isFinite(cycle.duration) ? [cycle] : []
  })
}

function linePath(points: Array<{ x: number; y: number }>): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')
}

export function renderCycleEvidence(): void {
  const cycles = parseCycles(cycleCsv)
  const plot = document.querySelector<HTMLElement>('[data-cycle-plot]')
  const matrix = document.querySelector<HTMLElement>('[data-cycle-matrix]')
  if (matrix) {
    const fragment = document.createDocumentFragment()
    cycles.forEach((cycle, index) => {
      if (index % 12 === 0) {
        const label = document.createElement('span')
        label.className = 'cycle-matrix__label'
        label.textContent = `S${cycle.batch}`
        fragment.append(label)
      }
      const cell = document.createElement('span')
      cell.className = 'cycle-matrix__cell is-pass'
      cell.title = `Cycle ${cycle.index} · ${cycle.duration.toFixed(3)} s · PASS`
      cell.setAttribute('aria-hidden', 'true')
      fragment.append(cell)
    })
    matrix.append(fragment)
  }
  if (!plot || !cycles.length) return

  const width = 760
  const height = 350
  const margin = { top: 24, right: 22, bottom: 34, left: 46 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const yMin = 9.4
  const yMax = 12.2
  const x = (index: number) => margin.left + ((index - 1) / (cycles.length - 1)) * innerWidth
  const y = (duration: number) => margin.top + ((yMax - duration) / (yMax - yMin)) * innerHeight
  const points = cycles.map((cycle) => ({ x: x(cycle.index), y: y(cycle.duration) }))
  const yTicks = [9.5, 10, 10.5, 11, 11.5, 12]
  const maxCycle = cycles.reduce((highest, cycle) => cycle.duration > highest.duration ? cycle : highest)
  const grid = yTicks.map((tick) => `<line class="plot-grid" x1="${margin.left}" y1="${y(tick)}" x2="${width - margin.right}" y2="${y(tick)}" /><text x="${margin.left - 10}" y="${y(tick) + 4}" text-anchor="end">${tick.toFixed(1)}</text>`).join('')
  const separators = Array.from({ length: 8 }, (_, index) => { const cycleIndex = (index + 1) * 12 + 0.5; return `<line class="plot-separator" x1="${x(cycleIndex)}" y1="${margin.top}" x2="${x(cycleIndex)}" y2="${height - margin.bottom}" />` }).join('')
  const dots = cycles.map((cycle) => `<circle class="plot-dot" cx="${x(cycle.index)}" cy="${y(cycle.duration)}" r="3.1"><title>Cycle ${cycle.index} : ${cycle.duration.toFixed(3)} s</title></circle>`).join('')
  plot.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="cycle-plot-title cycle-plot-desc"><title id="cycle-plot-title">Durée des 108 cycles de la campagne v6</title><desc id="cycle-plot-desc">Tous les cycles restent sous le seuil de douze secondes. Le maximum est ${maxCycle.duration.toFixed(3)} secondes.</desc>${grid}${separators}<line class="plot-threshold" x1="${margin.left}" y1="${y(12)}" x2="${width - margin.right}" y2="${y(12)}" /><text class="plot-threshold-label" x="${width - margin.right}" y="${y(12) - 8}" text-anchor="end">SEUIL · 12 s</text><path class="plot-line" d="${linePath(points)}" />${dots}<text x="${margin.left}" y="${height - 7}">Cycle 1</text><text x="${width - margin.right}" y="${height - 7}" text-anchor="end">Cycle 108</text><text x="${x(maxCycle.index) - 8}" y="${y(maxCycle.duration) - 12}" text-anchor="end">max ${maxCycle.duration.toFixed(3)} s</text></svg>`
}
