import { EdgeType, IEdge, INode, NodeType } from '$lib/types'
import { ReadonlySignal, useComputed } from '@preact/signals'
import { DeepSignal, useDeepSignal } from 'deepsignal'
import { useCallback } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

type Props = {
  addNode(node: INode): void
  addEdge(edge: IEdge): void
  nodes: DeepSignal<INode[]>
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  localize: (x: number, y: number) => readonly [number, number]
  selection?: ReadonlySignal<Set<string>>
  Edge?: (props: CreationEdge) => JSX.Element
}

export type CreationEdge = { x1: number; y1: number; x2: number; y2: number; type: EdgeType }

type DrawingEdge = {
  type: EdgeType
  source: DeepSignal<INode>
  target: { x: number; y: number }
}

export const withCreation = (props: Props) => {
  const drawingEdges = useDeepSignal({ values: [] as DrawingEdge[] })

  const createNode = (x: number, y: number, type: NodeType) => {
    const newNode = { id: `new-node-${props.nodes.length}`, type, x, y }
    props.addNode(newNode)

    if (drawingEdges.values.length) {
      for (const [index, { type, source }] of drawingEdges.values.entries()) {
        props.addEdge({ id: `new-edge-${props.nodes.length + index}`, type, source, target: newNode })
      }
      drawingEdges.values = []
    }
  }

  const startDrawingEdge = (x: number, y: number, type: EdgeType) => {
    if (!props.selection) return
    const newValues = []
    for (const node of props.nodes) {
      if (props.selection.value.has(node.id)) {
        newValues.push({ type, source: node, target: { x, y } })
      }
    }
    drawingEdges.values = newValues
  }

  const updateDrawingEdges = (e: MouseEvent) => {
    if (!props.selection || !drawingEdges.values.length) return
    const [x, y] = props.localize(...props.getInnerPoint(e.clientX, e.clientY))
    for (const edge of drawingEdges.values) {
      edge.target.x = x
      edge.target.y = y
    }
  }

  const component = useCallback(() => props.Edge ? <DrawingEdges Edge={props.Edge} edges={drawingEdges.values} /> : null, [drawingEdges])
  const isDrawingEdges = useComputed(() => !!drawingEdges.$values?.value.length)
  return { createNode, startDrawingEdge, updateDrawingEdges, DrawingEdges: component, isDrawingEdges }
}

const DrawingEdges = (props: { Edge: NonNullable<Props['Edge']>; edges: DeepSignal<DrawingEdge[]> }) => {
  return (
    <g>
      {props.edges.map((edge, index) => (
        <props.Edge
          key={index}
          type={edge.type}
          x1={edge.source.x}
          y1={edge.source.y}
          x2={edge.target.x}
          y2={edge.target.y}
        />
      ))}
    </g>
  )
}
