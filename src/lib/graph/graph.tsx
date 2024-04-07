import { useComputed } from '@preact/signals'
import { DeepSignal } from 'deepsignal'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import { EdgeType, IGroup, NodeType, type Elements, type IEdge, type INode } from '../types'
import { Edge } from './alphabet'
import { useBaseGraph } from './base-graph'
import { CreationEdge, withCreation } from './plugins/creation/creation'
import { withDisk } from './plugins/disk'
import { withDraggable } from './plugins/draggable/draggable'
import { getGroupPosition } from './plugins/grouping'
import { withGrouping } from './plugins/grouping/grouping'
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
  objectSelection?: { type: 'group'; action: (id: string) => void, values: Set<string>, indicators?: Map<string, string> }
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
  objectSelection,
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

  const { AreaSelection, selection, startSelection, updateSelection, clearSelection, isSelecting } = withSelection({
    nodes: elements.nodes,
    getInnerPoint,
    localize,
    inversion: true,
    padding,
  })

  const { Group, openGroup, closeAllGroups, selectGroup, deselectGroup, selectedGroup, selectedGroupId } = withGrouping({
    nodes: elements.nodes,
    groups: elements.groups,
    selection,
  })

  const highlight = useComputed(() => objectSelection?.values || selectedGroup.value || selection.value)

  const { startDragginig, updateDragging, isDragging } = withDraggable({
    nodes: elements.nodes,
    selection: highlight,
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
      if (menuNodePosition.current && menuNodePosition.current.x === x && menuNodePosition.current.y === y) {
        const array = type === 'node' ? elements.nodes : elements.edges
        for (const element of array) {
          if (!selection.value.has(element.id)) continue
          element.type = value
        }
      } else if (type === 'node') createNode(...localize(x, y), value)
      else startDrawingEdge(x, y, value)
    },
    { nodeTypes, edgeTypes }
  )

  const menuNodePosition = useRef<{ x: number; y: number } | null>(null)
  const { Menu } = withMenu({
    nodes: elements.nodes,
    selection,
    visible: useComputed(() => !isSelecting.value && !isDragging.value && !isDiskOpened.value && !isDrawingEdges.value),
    buttons: useComputed<MenuButton[]>(() => {
      return [
        {
          content: <span>T</span>,
          action: (_, x, y) => {
            showDisk('node', ...globalize(x, y))
            menuNodePosition.current = { x, y }
            // WARN: No clean up (intended), but would be great to have one later.
            // TODO: Come up with a generic solution of adding and cleaning up global events.
            document.addEventListener('mouseup', () => (menuNodePosition.current = null), { once: true })
          },
        },
        { content: <span>A</span>, action: (_, x, y) => showDisk('edge', ...globalize(x, y)) },
        {
          content: <span>G</span>,
          action: () =>
            addGroup({
              id: `${elements.groups.length}`,
              label: '',
              values: selection.value,
              position: getGroupPosition(elements.nodes, selection.value),
            }),
        },
      ]
    }),
  })

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
      highlight={objectSelection ? undefined : highlight}
      noselect={!!objectSelection || isSelecting}
      dragging={useComputed(() => isDragging.value || isDrawingEdges.value)}
      onWheel={e => {
        onwheel(e)
        if (isDrawingEdges.value) updateDrawingEdges(e)
      }}
      onMouseDown={e => {
        if (objectSelection) return

        deselectGroup()
        if (e.target === e.currentTarget) {
          closeAllGroups()
        }

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
        if (objectSelection) return

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
      before={
        <>
          <Group
            nohighlight={!!objectSelection}
            customSelection={objectSelection && new Set(objectSelection.values)}
            onMouseDown={useCallback((_e: MouseEvent, _id: string) => {
              // e.stopPropagation()
              // console.log('closing before')
              // closeGroup(id)
            }, [])}
          />
        </>
      }
      inner={
        <>
          <Group
            placeholder
            nohighlight={!!objectSelection}
            customSelection={objectSelection?.values}
            customIndicators={objectSelection?.indicators}
            onMouseDown={useCallback((e: MouseEvent, id: string) => {
              if (objectSelection && objectSelection.type === 'group') {
                objectSelection.action(id)
                return
              }

              e.stopPropagation()
              startDragginig(e)
              if (selectedGroupId.value === id) {
                const mouseup = () => {
                  closeAllGroups()
                  openGroup(id)
                  document.removeEventListener('mousemove', mousemove)
                }
                const mousemove = () => {
                  document.removeEventListener('mouseup', mouseup)
                }
                document.addEventListener('mouseup', mouseup, { once: true })
                document.addEventListener('mousemove', mousemove, { once: true })
              } else {
                selectGroup(id)
                clearSelection()
              }
            }, [objectSelection])}
          />
          {DrawingEdges && <DrawingEdges />}
        </>
      }
      innerHtml={<Menu />}
    >
      <Disk />
      <AreaSelection />
    </BaseGraph>
  )
}
