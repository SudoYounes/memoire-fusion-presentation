import { runtimeMath } from '../content/runtimeMath'

/** Build-time LaTeX paths keep the supplied objectives sharp and self-contained. */
export function renderProjectObjectives(): void {
  document.querySelectorAll<HTMLElement>('#objectifs-projet [data-objective-math]').forEach(holder => {
    const key = holder.dataset.objectiveMath as keyof typeof runtimeMath
    const item = runtimeMath[key]
    const [x, y, width, height] = item.viewBox
    holder.innerHTML = `<svg viewBox="${x} ${y} ${width} ${height}" style="width:${width / 1000}em;height:${height / 1000}em;vertical-align:${-(y + height) / 1000}em" role="img" aria-label="${item.label}">${item.body}</svg>`
  })
}
