import { runtimeMath } from '../content/runtimeMath'

export type RuntimeMathKey = keyof typeof runtimeMath
const escape = (s:string) => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')

/** Baseline-aligned, precompiled LaTeX. No external fonts, use references or runtime typesetter. */
export const mathWidth = (key:RuntimeMathKey,size:number) => runtimeMath[key].viewBox[2]*size/1000
export function math(x:number, baseline:number, key:RuntimeMathKey, size=23, cls='rf-math-body', gold=false, anchor='start') {
  const item=runtimeMath[key], [vx,vy,vw,vh]=item.viewBox, scale=size/1000
  const width=vw*scale, height=vh*scale, y=baseline+vy*scale
  x-=anchor==='end'?width:anchor==='middle'?width/2:0
  const glyphs=`<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${vx} ${vy} ${vw} ${vh}" overflow="visible" aria-hidden="true">${item.body}</svg>`
  // A mask keeps the sweep in slide coordinates, even though glyph paths use font units.
  const id=`rf-math-${key}-${x}-${baseline}`
  const visual=gold?`<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="${x-2}" y="${y-2}" width="${width+4}" height="${height+4}" style="mask-type:alpha"><g fill="white">${glyphs}</g></mask></defs><rect x="${x-2}" y="${y-2}" width="${width+4}" height="${height+4}" mask="url(#${id})" fill="url(#rf-gold-key)"/>`:glyphs
  return `<g class="rf-math ${cls}" data-rf-math="${key}" data-deck-math="${key}" role="img" aria-label="${escape(item.label)}">${visual}</g>`
}
