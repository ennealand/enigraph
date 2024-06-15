import { useComputed } from '@preact/signals'
import { DeepSignal } from 'deepsignal'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import { EdgeType, IGroup, NodeType, type Elements, type IEdge, type INode } from '../types'
import { Edge } from './alphabet'
import { BaseGraph, useBaseGraph } from './base-graph'
import { DrawingEdges, useCreation, type CreationEdge } from '../plugins/creation/creation'
import { useDisk } from '../plugins/disk'
import { Disk } from '../plugins/disk/disk'
import { withDraggable } from '../plugins/draggable/draggable'
import { getGroupPosition } from '../plugins/grouping'
import { Groups, useGrouping } from '../plugins/grouping/grouping'
import { Menu, MenuButton, useMenu } from '../plugins/menu/menu'
import { useMovable } from '../plugins/movable/movable'
import { RenamingArea, useRenaming } from '../plugins/renaming/renaming'
import { AreaSelection, useSelection } from '../plugins/selection/selection'

export interface Props {
  elements: DeepSignal<Elements>
  addNode(node: DeepSignal<INode>): void
  addEdge(edge: IEdge): void
  addGroup(group: IGroup): void
  changeNodeLabel?(element: INode, label: string): void
  changeNodePosition?(element: INode, x: number, y: number): void
  nodePositionChanged?(element: INode): void
  removeNode?(id: number): void
  width: number
  height: number
  nodeTypes?: NodeType[]
  edgeTypes?: EdgeType[]
  padding?: number
  objectSelection?: {
    type: 'group'
    action: (id: number) => void
    values: Set<number>
    indicators?: Map<number, string>
  }
  buttonIcons?: Partial<Record<'type' | 'arrow' | 'group' | 'rename' | 'delete', JSX.Element>>
}

export const Graph = ({
  elements,
  width,
  height,
  padding,
  addNode,
  addEdge,
  addGroup,
  changeNodeLabel,
  changeNodePosition,
  nodePositionChanged,
  removeNode,
  edgeTypes,
  nodeTypes,
  objectSelection,
  buttonIcons,
}: Props) => {
  /// ----------------------------------------- ///
  /// ----------------- Core ------------------ ///
  /// ----------------------------------------- ///

  const { baseGraphProps, getInnerPoint } = useBaseGraph(width, height)

  /// ----------------------------------------- ///
  /// ---------------- Plugins ---------------- ///
  /// ----------------------------------------- ///

  // const duplication = useDuplication({ addNode, addEdge, nodes: elements.nodes })

  const { transform, onwheel, localize, globalize, zoom } = useMovable({
    width,
    height,
    getInnerPoint,
  })

  const { selectionProps, selection, startSelection, updateSelection, clearSelection, isSelecting } = useSelection({
    nodes: elements.nodes,
    getInnerPoint,
    localize,
    inversion: true,
    padding,
    onSelectionStop: useCallback((selection: Set<number>) => createEdges(selection, elements.nodes), [elements.nodes]),
  })

  const { groupingProps, openGroup, closeAllGroups, selectGroup, deselectGroup, selectedGroup, selectedGroupId } =
    useGrouping({
      nodes: elements.nodes,
      groups: elements.groups,
      selection,
    })

  const { renamingProps, startRenaming, isRenaming } = useRenaming({ submit: changeNodeLabel })
  const nolabels = useComputed(() => (isRenaming.value ? new Set([isRenaming.value.node.id]) : undefined))

  const highlight = useComputed(
    () => objectSelection?.values || nolabels.value || selectedGroup.value || selection.value
  )

  const { startDragginig, updateDragging, isDragging, abortDragging } = withDraggable({
    nodes: elements.nodes,
    selection: highlight,
    getInnerPoint,
    zoom,
    changeNodePosition,
    nodePositionChanged,
  })

  const { creationProps, createNode, startDrawingEdge, updateDrawingEdges, createEdges, isDrawingEdges } = useCreation(
    {
      addNode,
      addEdge,
      getInnerPoint,
      localize,
      nodes: elements.nodes,
      Edge: NonSelectableEdge,
      selection,
    }
  )

  const { diskProps, showDisk, hideDisk, isDiskOpened } = useDisk(
    (type, x, y, _e, value) => {
      hideDisk()
      if (menuNodePosition.current && menuNodePosition.current.x === x && menuNodePosition.current.y === y) {
        const array = type === 'node' ? elements.nodes : elements.edges
        for (const element of array) {
          if (!selection.value.has(element.id)) continue
          element.type = value
        }
      } else if (type === 'node') createNode(...localize(x, y), value)
      else startDrawingEdge(x, y, value)
    },
    { nodeTypes, edgeTypes, getInnerPoint }
  )

  const menuNodePosition = useRef<{ x: number; y: number } | null>(null)
  const { menuProps } = useMenu({
    nodes: elements.nodes,
    selection,
    visible: useComputed(
      () => !isSelecting.value && !isDragging.value && !isDiskOpened.value && !isDrawingEdges.value && !isRenaming.value
    ),
    buttons: useComputed<MenuButton[]>(() => {
      const buttons: MenuButton[] = [
        {
          content: buttonIcons ? buttonIcons.type : <span>T</span>,
          action: (_, x, y) => {
            showDisk('node', ...globalize(x, y))
            menuNodePosition.current = { x, y }
            // WARN: No clean up (intended), but would be great to have one later.
            // TODO: Come up use a generic solution of adding and cleaning up global events.
            document.addEventListener('mouseup', () => (menuNodePosition.current = null), { once: true })
          },
        },
        {
          content: buttonIcons ? buttonIcons.arrow : <span>A</span>,
          action: (_, x, y) => showDisk('edge', ...globalize(x, y)),
        },
        {
          content: buttonIcons ? buttonIcons.group : <span>G</span>,
          action: () =>
            addGroup({
              id: 0,
              label: '',
              values: selection.value,
              position: getGroupPosition(elements.nodes, selection.value),
            }),
        },
      ]
      if (changeNodeLabel && selection.value.size === 1) {
        const node = elements.nodes.find(_ => selection.value.has(_.id))
        if (node) {
          buttons.push({
            content: buttonIcons ? buttonIcons.rename : <span>I</span>,
            action: () => startRenaming(node),
          })
        }
      }
      if (removeNode) {
        buttons.push({
          content: buttonIcons ? buttonIcons.delete : <span>D</span>,
          action: () => {
            for (const id of selection.value) removeNode(id)
          },
        })
      }
      return buttons.filter(button => button.content)
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
      {...baseGraphProps}
      elements={elements}
      padding={padding}
      transform={transform}
      highlight={objectSelection ? undefined : highlight}
      noselect={!!objectSelection || isSelecting}
      dragging={useComputed(() => isDragging.value || isDrawingEdges.value)}
      onTextDoubleClick={node => startRenaming(node)}
      nolabels={nolabels}
      onWheel={e => {
        onwheel(e)
        if (isDrawingEdges.value) updateDrawingEdges(e)
      }}
      onMouseDown={e => {
        if (objectSelection) return
        if (isDiskOpened) hideDisk()

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
        if (isDiskOpened) hideDisk()

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
          <Groups
            {...groupingProps}
            nohighlight={!!objectSelection}
            customSelection={objectSelection && new Set(objectSelection.values)}
            onMouseDown={useCallback((_e: MouseEvent, _id: number) => {
              // e.stopPropagation()
              // console.log('closing before')
              // closeGroup(id)
            }, [])}
          />
        </>
      }
      inner={
        <>
          <Groups
            {...groupingProps}
            placeholder
            nohighlight={!!objectSelection}
            customSelection={objectSelection?.values}
            customIndicators={objectSelection?.indicators}
            onMouseDown={useCallback(
              (e: MouseEvent, id: number) => {
                if (objectSelection && objectSelection.type === 'group') {
                  objectSelection.action(id)
                  return
                }
                if (isDiskOpened) hideDisk()

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
              },
              [objectSelection]
            )}
          />
          {creationProps && <DrawingEdges {...creationProps} />}
        </>
      }
      htmlAfter={
        <>
          {menuProps && <Menu {...menuProps} />}
          {renamingProps && <RenamingArea {...renamingProps} />}
        </>
      }
    >
      {diskProps && <Disk {...diskProps} />}
      {selectionProps && <AreaSelection {...selectionProps} />}
    </BaseGraph>
  )
}

const NonSelectableEdge = (props: CreationEdge) => <Edge {...props} noselect />
