import { BaseEdgeProps } from '$lib/components/scg/edge/types'
import { BaseNodeProps } from '$lib/components/scg/node/types'
import { ReadonlySignal } from '@preact/signals'
import { customForce } from './layout'

type Props<Id extends string | number, NodeType extends unknown, EdgeType extends unknown> = {
  nodes: ReadonlySignal<BaseNodeProps<Id, NodeType>[]>
  edges: ReadonlySignal<BaseEdgeProps<Id, EdgeType>[]>
  globalize: (x: number, y: number) => readonly [number, number]
  centerX: ReadonlySignal<number>
  centerY: ReadonlySignal<number>
}

export const withAutolayout = <Id extends string | number, NodeType extends unknown, EdgeType extends unknown>(
  props: Props<Id, NodeType, EdgeType>
) => {
  const nodes = props.nodes.value.map(node => ({ id: node.id as string | number, x: 0, y: 0 }))
  const edges = props.edges.value.map(edge => ({
    id: edge.id as string | number,
    sourceId: edge.sourceId,
    targetId: edge.targetId,
  }))

  let data: any = { nodes, edges }
  data = customForce({ nodes, edges }, 50, 50)

  for (const [index, node] of props.nodes.value.entries()) {
    node.x.value = data.nodes[index].x * 2 - props.centerX.value
    node.y.value = data.nodes[index].y * 2 - props.centerY.value
  }
  return {}
}
