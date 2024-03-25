import { DeepSignal } from 'deepsignal'
import { useCallback, useEffect, useMemo } from 'preact/hooks'
import { EdgeType, NodeType, type Elements, type IEdge, type INode } from '../types'
import { useBaseGraph } from './base-graph'
import { withCreation } from './plugins/creation/creation'
import { useDisk, type DiskClickCallback } from './plugins/disk'
import { withDraggable } from './plugins/draggable/draggable'
import { withMovable } from './plugins/movable/movable'
import { withSelection } from './plugins/selection/selection'

export interface Props {
  elements: DeepSignal<Elements>
  addNode(node: DeepSignal<INode>): void
  addEdge(edge: IEdge): void
  width: number
  height: number
  nodeTypes?: NodeType[]
  edgeTypes?: EdgeType[]
  padding?: number
}

export const Graph = ({ elements, width, height, padding, addEdge, addNode, edgeTypes, nodeTypes }: Props) =>
  useMemo(() => {
    /// ----------------------------------------- ///
    /// ----------------- Core ------------------ ///
    /// ----------------------------------------- ///

    const { BaseGraph, getInnerPoint } = useBaseGraph(width, height)

    /// ----------------------------------------- ///
    /// ---------------- Plugins ---------------- ///
    /// ----------------------------------------- ///

    // const duplication = useDuplication({ addNode, addEdge, nodes: elements.nodes })
    const creation = withCreation({ addNode, addEdge, nodes: elements.nodes })
    const { transform, localize, onwheel, weakLocalize, zoom } = withMovable({ width, height, getInnerPoint })

    const { AreaSelection, selection, startSelection, updateSelection, isSelecting } = withSelection({
      nodes: elements.nodes,
      getInnerPoint,
      weakLocalize,
      inversion: true,
      padding,
    })

    const { startDragginig, updateDragging, isDragging } = withDraggable({
      nodes: elements.nodes,
      selection,
      getInnerPoint,
      zoom,
    })

    const onDiskClick: DiskClickCallback = (type, x, y, _e, value) => {
      if (type === 'node') creation.createNode(...localize(x, y), value)
      else creation.startDrawingEdge(x, y, value)
    }

    const { Disk } = useDisk(onDiskClick, { nodeTypes, edgeTypes })

    /// ----------------------------------------- ///
    /// ------------- Global events ------------- ///
    /// ----------------------------------------- ///

    const mousemove = useCallback(
      (e: MouseEvent) => {
        if (isDragging.value) {
          updateDragging(e)
        }
        updateSelection(e, { deselection: e.altKey, selection: e.ctrlKey || e.metaKey })
      },
      [updateSelection, updateDragging, isDragging]
    )

    useEffect(() => {
      document.addEventListener('mousemove', mousemove, true)
      return () => document.removeEventListener('mousemove', mousemove, true)
    }, [mousemove])
    useEffect(() => () => document.removeEventListener('mousemove', mousemove, true), [])

    /// ------------ Render component ----------- ///
    return (
      <BaseGraph
        width={width}
        height={height}
        centerX={width / 2}
        centerY={height / 2}
        elements={elements}
        padding={padding ?? 15}
        transform={transform}
        highlight={selection}
        noselect={isSelecting}
        dragging={isDragging}
        onWheel={e => {
          onwheel(e)
        }}
        onMouseDown={e => {
          // Left click
          if (e.buttons === 1) {
            startSelection(e, {
              deselection: e.altKey,
              selection: e.ctrlKey || e.metaKey,
              clear: !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey,
            })
            return
          }

          // Right click
          if (e.buttons === 2) {
            //  Do something
            return
          }
        }}
        onNodeMouseDown={e => {
          // Left click
          if (e.buttons === 1) {
            if (e.shiftKey) return

            // if

            if (e.ctrlKey || e.metaKey || e.altKey) {
              e.stopPropagation()
              return
            }
            startDragginig(e)
            return
          }
        }}
      >
        <Disk />
        <AreaSelection />
      </BaseGraph>
    )
  }, [elements, width, height, padding, addEdge, addNode, edgeTypes, nodeTypes])
