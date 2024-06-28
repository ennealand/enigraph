import { INode } from '$lib/types'

export const getGroupPosition = (nodes: INode[], ids: Set<number>) => {
  let top = Infinity
  let bottom = -Infinity
  let left = Infinity
  let right = -Infinity
  for (const node of nodes) {
    if (!ids.has(node.id)) continue
    if (node.x > right) right = node.x
    if (node.x < left) left = node.x
    if (node.y < top) top = node.y
    if (node.y > bottom) bottom = node.y
  }
  return { top, bottom, right, left }
}
