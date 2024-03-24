import { EdgeType, IEdge, INode, NodeType } from '$lib/types'
import { DeepSignal, useDeepSignal } from 'deepsignal'
import { useMemo } from 'preact/hooks'

type Props = {
  addNode(node: DeepSignal<INode>): void
  addEdge(edge: IEdge): void
  nodes: DeepSignal<INode[]>
  selection?: DeepSignal<Set<number>>
}

export const useCreation = (props: Props) =>
  useMemo(() => {
    const drawingEdges = useDeepSignal({
      values: new Set<{
        type: EdgeType
        source: DeepSignal<INode>
        target: { x: number; y: number }
      }>(),
    })

    const createNode = (x: number, y: number, type: NodeType) => {
      const newNode = { id: String(props.nodes.length + 10), type, x, y }
      props.addNode(newNode)

      if (drawingEdges.values.size) {
        for (const { type, source } of drawingEdges.values) {
          props.addEdge({ id: String(props.nodes.length + 10), type, source, target: newNode })
        }
        drawingEdges.values.clear()
      }
    }

    const startDrawingEdge = (x: number, y: number, type: EdgeType) => {
      if (!props.selection) return
      for (const nodeIndex of props.selection) {
        drawingEdges.values.add({
          type,
          source: props.nodes[nodeIndex],
          target: { x, y },
        })
      }
    }
    return { createNode, startDrawingEdge, drawingEdge: drawingEdges }
  }, [props.addNode, props.addEdge, props.nodes, props.selection])
