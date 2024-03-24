import { INode } from '$lib/types'
import { batch, computed } from '@preact/signals'
import { deepSignal, useDeepSignal } from 'deepsignal'
import { useCallback, useEffect, useMemo } from 'preact/hooks'
import { AreaSelection, AreaSelectionProps } from './area-selection'

type Props = {
  nodes: INode[]
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  weakLocalize?: (x: number, y: number) => readonly [number, number]
  inversion?: true
  padding?: number
}

export const useSelection = (props: Props) =>
  useMemo(() => {
    const weakLocalize = props.weakLocalize ?? ((x, y) => [x, y])
    const selection = useDeepSignal({
      area: null as AreaSelectionProps | null,
      progress: new Set<string>(),
      values: new Set<string>(),
      postponedClickedNodeId: null as string | null,
    })

    const clearSelection = useCallback(() => {
      if (selection.values.size) selection.values = new Set()
    }, [selection])

    const startSelection = (
      e: MouseEvent,
      options?: { deselection?: boolean; selection?: boolean; clear?: boolean }
    ) => {
      const [x, y] = props.getInnerPoint(e.clientX, e.clientY)

      // Select a single node is clicked on it
      const [localX, localY] = weakLocalize(x, y) ?? [x, y]
      const padding = props.padding ?? 15
      const clickedNode = props.nodes.find(({ x, y }) => Math.sqrt((x - localX) ** 2 + (y - localY) ** 2) <= padding)

      const newProgress = options?.clear ? new Set<string>() : new Set(selection.values)
      if (clickedNode) {
        const processSingleClick = (values: Set<string>) => {
          if (!options?.deselection && !(props.inversion && !options?.selection && values.has(clickedNode.id))) {
            values.add(clickedNode.id)
          } else values.delete(clickedNode.id)
        }
        // If clear => select now; otherwise select later (on mouse move??! might be excessive -- it is!!)
        //       ^ mouse down ^                  ^ mouse move ^  or  ^ mouse up ^ (whatever fires first)
        // The problem is that mouse move might not be triggered (so we need to process stuff on mouse up - uh oh)
        if (options?.clear) {
          // process on mouse up
          selection.postponedClickedNodeId = clickedNode.id
        } else {
          processSingleClick(newProgress)
        }
      }
      const dontClear = selection.postponedClickedNodeId && selection.values.has(selection.postponedClickedNodeId)
      batch(() => {
        selection.area = deepSignal({ x1: x, y1: y, x2: x, y2: y })
        selection.progress = dontClear ? new Set(selection.values) : newProgress
        if (options?.clear && !dontClear) selection.values = new Set<string>()
      })

      console.log('START selection')
      document.addEventListener('mouseup', stopSelection, { once: true })
    }

    const updateSelection = (e: MouseEvent, options?: { deselection?: boolean; selection?: boolean }) => {
      if (!selection.area) return
      console.log('updating selection')
      
      // NOTE: I don't think this ever even happens.. We ONLY postpone the click on a highlighted node
      // cancel single click processing on mouse up (mouse move => not a single click)
      if (selection.postponedClickedNodeId) {
        // Select a newly-clicked node so it can be dragged immediately
        selection.values.add(selection.postponedClickedNodeId)
        selection.postponedClickedNodeId = null
        selection.area = null
        return
      }
      // this node will be automatically picked up later in this function
      
      const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
      selection.area.x2 = x
      selection.area.y2 = y

      const padding = props.padding ?? 16
      const [x1, y1] = weakLocalize(selection.area.x1, selection.area.y1)
      const [x2, y2] = weakLocalize(selection.area.x2, selection.area.y2)
      const fromX = Math.min(x1, x2) - padding
      const toX = Math.max(x1, x2) + padding
      const fromY = Math.min(y1, y2) - padding
      const toY = Math.max(y1, y2) + padding

      const newProgress = new Set<string>()
      for (const node of props.nodes) {
        if (node.x >= fromX && node.x <= toX && node.y >= fromY && node.y <= toY) {
          if (!options?.deselection && !(props.inversion && !options?.selection && selection.values.has(node.id))) {
            newProgress.add(node.id)
          }
        } else if (selection.values.has(node.id)) {
          newProgress.add(node.id)
        }
      }
      selection.progress = newProgress
    }

    const stopSelection = () => {
      document.removeEventListener('mouseup', stopSelection)
      if (!selection.area) return
      selection.area = null
      let newValues: Set<string>

      // processed the postponed single click
      if (selection.postponedClickedNodeId) {
        newValues = new Set()
        newValues.add(selection.postponedClickedNodeId)
        selection.postponedClickedNodeId = null
      } else {
        newValues = new Set(selection.progress)
      }

      selection.values = newValues
      selection.progress = new Set()
    }

    useEffect(() => () => document.removeEventListener('mouseup', stopSelection), [selection])

    return {
      /** Area selection rectangle */
      AreaSelection: useCallback(() => selection.area && <AreaSelection {...selection.area} />, [selection]),
      selection: computed(() => (selection.area ? selection.progress : selection.values)),
      isSelecting: computed(
        () => !!selection.area && (selection.area.x1 !== selection.area.x2 || selection.area.y1 !== selection.area.y2)
      ),
      clearSelection,
      startSelection,
      updateSelection,
    }
  }, [props.nodes, props.getInnerPoint, props.weakLocalize, props.inversion])
