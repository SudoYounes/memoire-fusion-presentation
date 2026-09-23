import { runtimeMath } from '../content/runtimeMath'

type CadMathKey = 'j1_torsor' | 'j2_torsor' | 'j2_transform' | 'j3_torsor' | 'j3_transform' | 'j4_torsor' | 'j4_transform'

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
  </section>`
}

export function j2Kinematics(): string {
  return `<section class="ma-cad-kinematics ma-j2-kinematics" aria-label="Modélisation cinématique de J2">
    <p class="ma-label">Modélisation cinématique</p>
    ${equation('j2_torsor')}
    <div class="ma-cad-transform">
      <p class="ma-label">Transformation colonne / bras</p>
      ${equation('j2_transform')}
      <p class="ma-detail">Translation exprimée en mètres.</p>
    </div>
  </section>`
}

export function j3Kinematics(): string {
  return `<section class="ma-cad-kinematics ma-j3-kinematics" aria-label="Modélisation cinématique de J3">
    <p class="ma-label">Modélisation cinématique</p>
    ${equation('j3_torsor')}
    <div class="ma-cad-transform">
      <p class="ma-label">Transformation bras / avant-bras</p>
      ${equation('j3_transform')}
      <p class="ma-detail">Translation exprimée en mètres.</p>
    </div>
  </section>`
}

export function j4Kinematics(): string {
  return `<section class="ma-cad-kinematics ma-j4-kinematics" aria-label="Modélisation cinématique de J4">
    <p class="ma-label">Modélisation cinématique</p>
    ${equation('j4_torsor')}
    <div class="ma-cad-transform">
      <p class="ma-label">Transformation avant-bras / outil</p>
      ${equation('j4_transform')}
      <p class="ma-detail">Translation exprimée en mètres.</p>
    </div>
  </section>`
}
