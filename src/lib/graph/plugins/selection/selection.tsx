import { INode } from '$lib/types'
import { batch, computed } from '@preact/signals'
import { deepSignal, useDeepSignal } from 'deepsignal'
import { useCallback, useEffect, useMemo } from 'preact/hooks'
import { AreaSelection, AreaSelectionProps } from './area-selection'

type Props = {
  nodes: INode[]
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  weakLocalize: (x: number, y: number) => readonly [number, number]
  inversion?: true
}

export const useSelection = (props: Props) =>
  useMemo(() => {
    const selection = useDeepSignal({
      area: null as AreaSelectionProps | null,
      progress: new Set<number>(),
      values: new Set<number>(),
    })

    const resetSelection = useCallback(() => {
      if (selection.values.size) selection.values.clear()
    }, [selection.values])

    const startSelection = (e: MouseEvent) => {
      const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
      batch(() => {
        selection.area = deepSignal({ x1: x, y1: y, x2: x, y2: y })
        selection.progress = selection.values
      })
      document.addEventListener('mouseup', stopSelection, { once: true })
    }

    const updateSelection = (e: MouseEvent, options = { deselection: false }) => {
      batch(() => {
        if (!selection.area) return
        const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
        selection.area.x2 = x
        selection.area.y2 = y

        const [x1, y1] = props.weakLocalize(selection.area.x1, selection.area.y1)
        const [x2, y2] = props.weakLocalize(selection.area.x2, selection.area.y2)
        const fromX = Math.min(x1, x2)
        const toX = Math.max(x1, x2)
        const fromY = Math.min(y1, y2)
        const toY = Math.max(y1, y2)

        const newProgress = new Set<number>()
        for (const [index, node] of props.nodes.entries()) {
          if (node.x >= fromX && node.x <= toX && node.y >= fromY && node.y <= toY) {
            if (!options.deselection && !(props.inversion && selection.values.has(index))) {
              newProgress.add(index)
            }
          } else if (selection.values.has(index)) {
            newProgress.add(index)
          }
        }
        selection.progress = newProgress
      })
    }

    const stopSelection = useCallback(() => {
      document.removeEventListener('mouseup', stopSelection)
      selection.area = null

      selection.values = selection.progress
      selection.progress = new Set()
    }, [selection])

    useEffect(() => () => document.removeEventListener('mouseup', stopSelection), [selection])

    return {
      /** Area selection rectangle */
      AreaSelection: useCallback(() => selection.area && <AreaSelection {...selection.area} />, [selection]),
      selection: computed(() => (selection.area ? selection.progress : selection.values)),
      resetSelection,
      startSelection,
      updateSelection,
    }
  }, [props.nodes, props.getInnerPoint, props.weakLocalize, props.inversion])
