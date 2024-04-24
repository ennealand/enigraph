import { EdgeType, IEdge, INode, NodeType } from '$lib/types'
import { ReadonlySignal, useComputed } from '@preact/signals'
import { useDeepSignal } from 'deepsignal'
import { JSX } from 'preact/jsx-runtime'

type Props = {
  addNode(node: INode): void
  addEdge(edge: IEdge): void
  nodes: INode[]
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  localize: (x: number, y: number) => readonly [number, number]
  selection?: ReadonlySignal<Set<number>>
  Edge?: (props: CreationEdge) => JSX.Element
}

export type CreationEdge = { x1: number; y1: number; x2: number; y2: number; type: EdgeType }

type DrawingEdge = {
  type: EdgeType
  source: INode
  target: { x: number; y: number }
}

export const useCreation = (props: Props) => {
  const drawingEdges = useDeepSignal({ values: [] as DrawingEdge[] })

  const createNode = (x: number, y: number, type: NodeType) => {
    const newNode = { id: 0, type, x, y }
    props.addNode(newNode)

    if (drawingEdges.values.length) {
      for (const { type, source } of drawingEdges.values) {
        props.addEdge({ id: 0, type, source, target: newNode })
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

  const createEdges = (selection: Set<number>, nodes: INode[]) => {
    if (drawingEdges.values.length) {
      for (const { type, source } of drawingEdges.values) {
        for (const node of nodes) {
          if (!selection.has(node.id)) continue
          props.addEdge({ id: 0, type, source, target: node })
        }
      }
      drawingEdges.values = []
    }
  }

  const creationProps = props.Edge && { Edge: props.Edge, edges: drawingEdges.values as DrawingEdge[] }
  const isDrawingEdges = useComputed(() => !!drawingEdges.$values?.value.length)
  return { createNode, startDrawingEdge, updateDrawingEdges, createEdges, isDrawingEdges, creationProps }
}

type DrawingEdgeProps = { Edge: NonNullable<Props['Edge']>; edges: DrawingEdge[] }
export const DrawingEdges = ({ Edge, edges }: DrawingEdgeProps) => {
  return (
    <g>
      {edges.map((edge, index) => (
        <Edge
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
