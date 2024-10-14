import { BaseGroupProps } from '$lib/components/scg/group/types'

export const magneticGroupEffect = <Id extends string | number>(
  globalize: (x: number, y: number) => readonly [number, number],
  group: BaseGroupProps<Id>,
  x: number,
  y: number,
  P: number,
  I: number,
  { preview, revert }: { preview?: boolean; revert?: boolean }
) => {
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
  if (preview) {
    console.log(min <= 0 ? 'OUT' : 'still IN', min)
    return min <= 0 ? undefined : [x, y]
  }
  // console.log(revert ? 'RR' : 'OO', 'min', min)
  if (revert) {
    if (min > 0 || -min > I) return

    if (left <= 0 && -left <= I) x = pLeft
    if (right <= 0 && right <= I) x = pRight
    if (top <= 0 && top <= I) y = pTop
    if (bottom <= 0 && bottom <= I) y = pBottom
  } else {
    if (min < 0 || min > I) return

    if (left === min) x = pLeft
    else if (right === min) x = pRight
    else if (top === min) y = pTop
    else if (bottom === min) y = pBottom
  }

  return [x, y]
}
