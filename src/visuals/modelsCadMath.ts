import { runtimeMath } from '../content/runtimeMath'

type CadMathKey = 'j1_torsor' | 'j1_transport' | 'j1_pivot_velocity' | 'j1_point' | 'j1_velocity_components' | 'j2_torsor'

/** Same precompiled LaTeX glyphs as the robot's other mathematical views. */
function equation(key: CadMathKey): string {
  const item = runtimeMath[key]
  const [, , width, height] = item.viewBox
  return `<div class="ma-cad-equation" data-deck-math="${key}"><svg viewBox="${item.viewBox.join(' ')}" style="--ma-math-width:${width / 1000}em;--ma-math-height:${height / 1000}em" role="img" aria-label="${item.label}">${item.body}</svg></div>`
}

export function j1Kinematics(): string {
  return `<section class="ma-cad-kinematics" aria-label="Modélisation cinématique de J1">
    <p class="ma-label">Modélisation cinématique</p>
    <div class="ma-j1-torsor">${equation('j1_torsor')}</div>
    <div class="ma-j1-point-velocity">
      <p class="ma-label">Vitesse d’un point P</p>
      ${equation('j1_transport')}
      ${equation('j1_pivot_velocity')}
      <div class="ma-j1-components">${equation('j1_point')}${equation('j1_velocity_components')}</div>
    </div>
  </section>`
}

export function j2Kinematics(): string {
  return `<section class="ma-cad-kinematics ma-j2-kinematics" aria-label="Modélisation cinématique de J2">
    <p class="ma-label">Modélisation cinématique</p>
    ${equation('j2_torsor')}
  </section>`
}
