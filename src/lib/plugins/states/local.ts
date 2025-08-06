import { BasicBusProps } from '$lib/components/scg/bus'
import { BasicContentProps } from '$lib/components/scg/content'
import { BasicEdgeProps, Edge } from '$lib/components/scg/edge'
import { BasicNodeProps, Node } from '$lib/components/scg/node'
import { ReadonlySignal, signal } from '@preact/signals'
import { createDiskComponent, getEdgeProps, getNodeProps } from '../disk'

export type LocalStateContext = {
  nodes: ReadonlySignal<BasicNodeProps[]>
  edges: ReadonlySignal<BasicEdgeProps[]>
  contents: ReadonlySignal<BasicContentProps[]>
  buses: ReadonlySignal<BasicBusProps[]>
  localize: (x: number, y: number) => readonly [number, number]
}

export const withLocalState = (ctx: LocalStateContext) => {
  const changeBusPosition = (bus: BasicBusProps, x: number, y: number) => {
    bus.dx.value = x
    bus.dy.value = y
  }
  const changeContentPosition = (content: BasicContentProps, x: number, y: number) => {
    content.x.value = x
    content.y.value = y
  }
  const changeNodePosition = (node: BasicNodeProps, x: number, y: number) => {
    node.x.value = x
    node.y.value = y
  }
  const changeNodeLabel = (node: BasicNodeProps, label: string) => {
    node.label!.value = label
  }
  const addNode = (node: Omit<BasicNodeProps, 'id'>) => {
    // @ts-expect-error
    ctx.nodes.value = [...ctx.nodes.value, { ...node, id: ctx.nodes.value.length + 1 }]
  }
  const diskComponents = {
    nodes: createDiskComponent({
      component: Node,
      types: ['var-norole', 'const-tuple'],
      factory: getNodeProps,
      handler: (type, x, y) => {
        const [gx, gy] = ctx.localize(x.value, y.value)
        addNode({ type: signal(type), x: signal(gx), y: signal(gy) })
        console.log('node clicked')
      },
    }),
    edges: createDiskComponent({
      component: Edge,
      types: ['var-norole', 'const-tuple'],
      factory: getEdgeProps,
      handler: () => {
        console.log('edge clicked')
      },
    }),
  }
  return { changeNodePosition, changeNodeLabel, diskComponents, changeBusPosition, changeContentPosition }
}
