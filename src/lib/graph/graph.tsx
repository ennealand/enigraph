import { useComputed } from '@preact/signals'
import { DeepSignal } from 'deepsignal'
import { useCallback, useEffect } from 'preact/hooks'
import { EdgeType, IGroup, NodeType, type Elements, type IEdge, type INode } from '../types'
import { Edge } from './alphabet'
import { useBaseGraph } from './base-graph'
import { CreationEdge, withCreation } from './plugins/creation/creation'
import { withDisk } from './plugins/disk'
import { withDraggable } from './plugins/draggable/draggable'
import { MenuButton, withMenu } from './plugins/menu/menu'
import { withMovable } from './plugins/movable/movable'
import { withSelection } from './plugins/selection/selection'

export interface Props {
  elements: DeepSignal<Elements>
  addNode(node: DeepSignal<INode>): void
  addEdge(edge: IEdge): void
  addGroup(group: IGroup): void
  width: number
  height: number
  nodeTypes?: NodeType[]
  edgeTypes?: EdgeType[]
  padding?: number
}

export const Graph = ({
  elements,
  width,
  height,
  padding,
  addNode,
  addEdge,
  addGroup,
  edgeTypes,
  nodeTypes,
}: Props) => {
  /// ----------------------------------------- ///
  /// ----------------- Core ------------------ ///
  /// ----------------------------------------- ///

  const { BaseGraph, getInnerPoint } = useBaseGraph(width, height)

  /// ----------------------------------------- ///
  /// ---------------- Plugins ---------------- ///
  /// ----------------------------------------- ///

  // const duplication = useDuplication({ addNode, addEdge, nodes: elements.nodes })

  const { transform, onwheel, localize, globalize, zoom } = withMovable({
    width,
    height,
    getInnerPoint,
  })

  const { AreaSelection, selection, startSelection, updateSelection, isSelecting } = withSelection({
    nodes: elements.nodes,
    getInnerPoint,
    localize,
    inversion: true,
    padding,
  })

  const { startDragginig, updateDragging, isDragging } = withDraggable({
    nodes: elements.nodes,
    selection,
    getInnerPoint,
    zoom,
  })

  const { createNode, startDrawingEdge, updateDrawingEdges, DrawingEdges, isDrawingEdges } = withCreation({
    addNode,
    addEdge,
    getInnerPoint,
    localize,
    nodes: elements.nodes,
    Edge: useCallback((props: CreationEdge) => <Edge {...props} noselect />, []),
    selection,
  })

  const { Disk, showDisk, isDiskOpened } = withDisk(
    (type, x, y, _e, value) => {
      if (type === 'node') createNode(...localize(x, y), value)
      else startDrawingEdge(x, y, value)
    },
    { nodeTypes, edgeTypes }
  )

  const { Menu } = withMenu({
    nodes: elements.nodes,
    selection,
    visible: useComputed(() => !isSelecting.value && !isDragging.value && !isDiskOpened.value && !isDrawingEdges.value),
    buttons: useComputed<MenuButton[]>(() => {
      return [
        { content: <span>T</span>, action: () => alert(222) },
        { content: <span>A</span>, action: (_, x, y) => showDisk('edge', ...globalize(x, y)) },
        {
          content: <span>G</span>,
          action: () => addGroup({ id: `${elements.groups.length}`, label: '', values: selection.value }),
        },
      ]
    }),
  })

  // const grouping = useGrouping({ addNode, addEdge, nodes: elements.nodes })

  /// ----------------------------------------- ///
  /// ------------- Global events ------------- ///
  /// ----------------------------------------- ///

  const mousemove = useCallback(
    (e: MouseEvent) => {
      if (isDrawingEdges.value && !isDiskOpened.value) {
        updateDrawingEdges(e)
      }

      if (isDragging.value) {
        updateDragging(e)
      }
      updateSelection(e, { deselection: e.altKey, selection: e.ctrlKey || e.metaKey })
    },
    [updateSelection, updateDragging, isDragging, isDrawingEdges]
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
      padding={padding}
      transform={transform}
      highlight={selection}
      noselect={isSelecting}
      dragging={useComputed(() => isDragging.value || isDrawingEdges.value)}
      onWheel={e => {
        onwheel(e)
        if (isDrawingEdges.value) updateDrawingEdges(e)
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
          if (e.shiftKey) return

          //  Do something
          showDisk('node', ...getInnerPoint(e.clientX, e.clientY))
          return
        }
      }}
      onNodeMouseDown={(e, node) => {
        // Left click
        if (e.buttons === 1) {
          if (e.shiftKey) return

          if (e.ctrlKey || e.metaKey || e.altKey) {
            e.stopPropagation()
            return
          }
          startDragginig(e)
          return
        }

        // Right click
        if (e.buttons === 2) {
          if (e.shiftKey) return

          e.stopPropagation()
          startSelection(e, { clear: true })
          showDisk('edge', ...globalize(node.x, node.y))
        }
      }}
      inner={<>{DrawingEdges && <DrawingEdges />}</>}
      innerHtml={<Menu />}
    >
      <Disk />
      <AreaSelection />
    </BaseGraph>
  )
}
