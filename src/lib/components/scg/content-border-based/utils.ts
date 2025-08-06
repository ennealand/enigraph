import { SignalLike } from '$lib/utils'
import { BasicContentProps } from '.'

export const getContentRadius = (
  content: BasicContentProps,
  x2: SignalLike<number>,
  y2: SignalLike<number>,
  radius: SignalLike<number>
) => {
  const w = content.dx.value / 2 + 3.2,
    h = content.dy.value / 2 + 3.2,
    dx = content.x.value + w - (x2 as number),
    dy = content.y.value + h - (y2 as number)
  return Math.sqrt(dx ** 2 + dy ** 2) / Math.max(Math.abs(dx / w), Math.abs(dy / h)) + (radius as number)
}
