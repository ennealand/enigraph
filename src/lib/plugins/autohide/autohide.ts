import { BaseNodeProps } from '$lib/components/scg/node/types'
import { ReadonlySignal, useSignal, useSignalEffect } from '@preact/signals'

type Props<Id extends string | number, NodeType extends unknown> = {
  nodes: ReadonlySignal<BaseNodeProps<Id, NodeType>[]>
  globalize: (x: number, y: number) => readonly [number, number]
  centerX: ReadonlySignal<number>
  centerY: ReadonlySignal<number>
}

export type AutohideContext<Id extends string | number, NodeType extends unknown> = {
  nodes: ReadonlySignal<BaseNodeProps<Id, NodeType>[]>
}

export const withAutohide = <Id extends string | number, NodeType extends unknown>(
  props: Props<Id, NodeType>
): AutohideContext<Id, NodeType> => {
  const nodes = useSignal<BaseNodeProps<Id, NodeType>[]>(props.nodes.peek())
  useSignalEffect(() => {
    const newNodes = props.nodes.peek().filter(node => {
      const [x, y] = props.globalize(node.x.value, node.y.value)
      return x > -props.centerX.value && x < props.centerX.value && y > -props.centerY.value && y < props.centerY.value
    })
    if (newNodes.length !== nodes.peek().length) nodes.value = newNodes
  })
  return { nodes }
}
