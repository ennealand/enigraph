import { BaseGroupProps } from '$lib/components/scg/group/types'

export type MagneticGroupEffect = {
  x: number
  y: number
  mouse: { x: number; y: number }
  revert: boolean
}

export const magneticGroupEffect = <Id extends string | number>(
  globalize: (x: number, y: number) => readonly [number, number],
  group: BaseGroupProps<Id>,
  x: number,
  y: number,
  P: number,
  I: number,
  maxI: number,
  { preview, revert }: { preview?: boolean; revert?: boolean }
): readonly [number, number] | undefined => {
  if (revert) P = -P
  const pLeft = globalize(group.x.value - P, 0)[0]
  const pRight = globalize(group.x.value + group.dx.value + P, 0)[0]
  const pTop = globalize(0, group.y.value - P)[1]
  const pBottom = globalize(0, group.y.value + group.dy.value + P)[1]

  const left = (x - pLeft) * (revert ? 1 : 1)
  const right = (pRight - x) * (revert ? 1 : 1)
  const top = (y - pTop) * (revert ? 1 : 1)
  const bottom = (pBottom - y) * (revert ? 1 : 1)

  const min = Math.min(left, right, top, bottom)
  const minX = Math.min(left, right)
  const minY = Math.min(top, bottom)
  const Ix = Math.min(Math.abs(group.dx.value / 3), maxI)
  const Iy = Math.min(Math.abs(group.dy.value / 3), maxI)
  if (preview) {
    // console.log(min <= 0 ? 'OUT' : 'still IN', min)
    return min <= 0 ? undefined : [x, y]
  }
  // console.log(revert ? 'RR' : 'OO', 'min', min)
  if (revert) {
    // if (min > 0 || -minX > Ix || -minY > Iy) return
    if (min > 0 || -min > I) return

    if (left <= 0 && -left <= Ix) x = pLeft
    if (right <= 0 && right <= Ix) x = pRight
    if (top <= 0 && top <= Iy) y = pTop
    if (bottom <= 0 && bottom <= Iy) y = pBottom
  } else {
    if (min < 0 || (minX > Ix && minY > Iy)) return

    if (left === min) x = pLeft
    else if (right === min) x = pRight
    else if (top === min) y = pTop
    else if (bottom === min) y = pBottom
  }

  return [x, y]
}
