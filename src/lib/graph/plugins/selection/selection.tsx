import { INode } from '$lib/types'
import { batch, useComputed, useSignal } from '@preact/signals'
import { deepSignal } from 'deepsignal'
import { useCallback, useEffect } from 'preact/hooks'
import { AreaSelection, AreaSelectionProps } from './area-selection'

type Props = {
  nodes: INode[]
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  weakLocalize?: (x: number, y: number) => readonly [number, number]
  inversion?: true
  padding?: number
}

export const withSelection = (props: Props) => {
  const weakLocalize = props.weakLocalize ?? ((x, y) => [x, y])

  const area = useSignal(null as AreaSelectionProps | null)
  const progress = useSignal(new Set<string>())
  const values = useSignal(new Set<string>())
  const postponedClickedNodeId = useSignal(null as string | null)

  const clearSelection = useCallback(() => {
    if (values.value.size) values.value = new Set()
  }, [values])

  const startSelection = (e: MouseEvent, options?: { deselection?: boolean; selection?: boolean; clear?: boolean }) => {
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)

    // Select a single node is clicked on it
    const [localX, localY] = weakLocalize(x, y) ?? [x, y]
    const padding = props.padding ?? 15
    const clickedNode = props.nodes.findLast(({ x, y }) => Math.sqrt((x - localX) ** 2 + (y - localY) ** 2) <= padding)

    const newProgress = options?.clear ? new Set<string>() : new Set(values.value)
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
        postponedClickedNodeId.value = clickedNode.id
      } else {
        processSingleClick(newProgress)
      }
    }
    const dontClear = postponedClickedNodeId.value && values.value.has(postponedClickedNodeId.value)
    batch(() => {
      area.value = deepSignal({ x1: x, y1: y, x2: x, y2: y })
      progress.value = dontClear ? new Set(values.value) : newProgress
      if (options?.clear && !dontClear) values.value = new Set<string>()
    })

    document.addEventListener('mouseup', stopSelection, { once: true })
  }

  const updateSelection = (e: MouseEvent, options?: { deselection?: boolean; selection?: boolean }) => {
    if (!area.value) return

    // NOTE: I don't think this ever even happens.. We ONLY postpone the click on a highlighted node
    // cancel single click processing on mouse up (mouse move => not a single click)
    if (postponedClickedNodeId.value) {
      // Select a newly-clicked node so it can be dragged immediately
      values.value.add(postponedClickedNodeId.value)
      postponedClickedNodeId.value = null
      area.value = null
      return
    }
    // this node will be automatically picked up later in this function

    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    area.value.x2 = x
    area.value.y2 = y

    const padding = props.padding ?? 16
    const [x1, y1] = weakLocalize(area.value.x1, area.value.y1)
    const [x2, y2] = weakLocalize(area.value.x2, area.value.y2)
    const fromX = Math.min(x1, x2) - padding
    const toX = Math.max(x1, x2) + padding
    const fromY = Math.min(y1, y2) - padding
    const toY = Math.max(y1, y2) + padding

    const newProgress = new Set<string>()
    for (const index of props.nodes.keys()) {
      const node = props.nodes.at(-index - 1)!
      if (node.x >= fromX && node.x <= toX && node.y >= fromY && node.y <= toY) {
        if (!options?.deselection && !(props.inversion && !options?.selection && values.value.has(node.id))) {
          newProgress.add(node.id)
        }
      } else if (values.value.has(node.id)) {
        newProgress.add(node.id)
      }
    }
    progress.value = newProgress
  }

  const stopSelection = useCallback(() => {
    document.removeEventListener('mouseup', stopSelection)
    if (!area.value) return
    area.value = null
    let newValues: Set<string>

    // process the postponed single click
    if (postponedClickedNodeId.value) {
      newValues = new Set()
      newValues.add(postponedClickedNodeId.value)
      postponedClickedNodeId.value = null
    } else {
      newValues = new Set(progress.value)
    }

    values.value = newValues
    progress.value = new Set()
  }, [])

  useEffect(() => () => document.removeEventListener('mouseup', stopSelection), [stopSelection])

  useEffect(() => {
    console.warn('hola')
    return () => console.warn('bye')
  }, [])

  return {
    /** Area selection rectangle */
    AreaSelection: useCallback(() => area.value && <AreaSelection {...area.value} />, [area]),
    selection: useComputed(() => area.value ? progress.value : values.value),
    isSelecting: useComputed(
      () => !!area.value && (area.value.x1 !== area.value.x2 || area.value.y1 !== area.value.y2)
    ),
    clearSelection,
    startSelection,
    updateSelection,
  }
}
