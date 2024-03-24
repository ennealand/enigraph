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
      const padding = props.padding ?? 16
      const clickedNode = props.nodes.find(({ x, y }) => Math.sqrt((x - localX) ** 2 + (y - localY) ** 2) <= padding)

      const newProgress = options?.clear ? new Set<string>() : new Set(selection.values)
      if (clickedNode) {
        if (!options?.deselection && !(props.inversion && !options?.selection && newProgress.has(clickedNode.id))) {
          newProgress.add(clickedNode.id)
        } else newProgress.delete(clickedNode.id)
      }
      batch(() => {
        selection.area = deepSignal({ x1: x, y1: y, x2: x, y2: y })
        selection.progress = newProgress
        if (options?.clear) selection.values = new Set<string>()
      })

      document.addEventListener('mouseup', stopSelection, { once: true })
    }

    const updateSelection = (e: MouseEvent, options?: { deselection?: boolean; selection?: boolean }) => {
      if (!selection.area) return
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
      selection.area = null

      selection.values = new Set(selection.progress)
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
