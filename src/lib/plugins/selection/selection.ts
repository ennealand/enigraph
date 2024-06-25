import { BaseNodeProps } from '$lib/components/scg/node/types'
import { batch, ReadonlySignal, useComputed, useSignal } from '@preact/signals'
import { type AreaSelectionProps } from './area-selection'

type Props<Id extends string | number> = {
  nodes: ReadonlySignal<BaseNodeProps<Id>[]>
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  localize?: (x: number, y: number) => readonly [number, number]
  onSelectionStop?: (selection: Set<Id>) => void
  padding?: number
}

export type SelectionContext<Id extends string | number> = {
  areaSelection: ReadonlySignal<AreaSelectionProps>
  selection: ReadonlySignal<Set<Id>>
  isSelecting: ReadonlySignal<boolean>
  clearSelection: () => void
  startSelection: (e: MouseEvent, options?: { deselection?: boolean; selection?: boolean; inversion?: boolean; clear?: boolean }) => void
  updateSelection: (e: MouseEvent, options?: { deselection?: boolean; selection?: boolean; inversion?: boolean }) => void
  stopSelection: () => void
}

export const withSelection = <Id extends string | number>(props: Props<Id>): SelectionContext<Id> => {
  const localize = props.localize ?? ((x, y) => [x, y])

  const areaSelection = useSignal({
    shown: useSignal(false),
    x1: useSignal(0),
    y1: useSignal(0),
    x2: useSignal(0),
    y2: useSignal(0),
  } satisfies AreaSelectionProps)
  const progress = useSignal(new Set<Id>())
  const values = useSignal(new Set<Id>())
  const postponedClickedNodeId = useSignal(null as Id | null)

  const clearSelection = () => {
    if (values.value.size) values.value = new Set()
  }

  const startSelection = (
    e: MouseEvent,
    options?: { deselection?: boolean; selection?: boolean; inversion?: boolean; clear?: boolean }
  ) => {
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)

    // Select a single node is clicked on it
    const [localX, localY] = localize(x, y) ?? [x, y]
    const padding = props.padding ?? 15
    const clickedNode = props.nodes.value.findLast(
      ({ x, y }) => Math.sqrt((x.value - localX) ** 2 + (y.value - localY) ** 2) <= padding
    )

    const newProgress = options?.clear ? new Set<Id>() : new Set(values.value)
    if (clickedNode) {
      const processSingleClick = (values: Set<Id>) => {
        if (!options?.deselection && !(options?.inversion && !options?.selection && values.has(clickedNode.id))) {
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
    const dontClear = postponedClickedNodeId.value !== null && values.value.has(postponedClickedNodeId.value)

    batch(() => {
      areaSelection.value.shown.value = true
      areaSelection.value.x1.value = x
      areaSelection.value.y1.value = y
      areaSelection.value.x2.value = x
      areaSelection.value.y2.value = y
      progress.value = dontClear ? new Set(values.value) : newProgress
      if (options?.clear && !dontClear) values.value = new Set<Id>()
    })
  }

  const updateSelection = (e: MouseEvent, options?: { deselection?: boolean; selection?: boolean, inversion?: boolean }) => {
    if (!areaSelection.value.shown.value) return

    // NOTE: I don't think this ever even happens.. We ONLY postpone the click on a highlighted node
    // cancel single click processing on mouse up (mouse move => not a single click)
    if (postponedClickedNodeId.value !== null) {
      // Select a newly-clicked node so it can be dragged immediately
      values.value.add(postponedClickedNodeId.value)
      postponedClickedNodeId.value = null
      areaSelection.value.shown.value = false
      return
    }
    // this node will be automatically picked up later in this function

    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    areaSelection.value.x2.value = x
    areaSelection.value.y2.value = y

    const padding = props.padding ?? 16
    const [x1, y1] = localize(areaSelection.value.x1.value, areaSelection.value.y1.value)
    const [x2, y2] = localize(areaSelection.value.x2.value, areaSelection.value.y2.value)
    const fromX = Math.min(x1, x2) - padding
    const toX = Math.max(x1, x2) + padding
    const fromY = Math.min(y1, y2) - padding
    const toY = Math.max(y1, y2) + padding

    const newProgress = new Set<Id>()
    for (const index of props.nodes.value.keys()) {
      const node = props.nodes.value.at(-index - 1)!
      if (node.x.value >= fromX && node.x.value <= toX && node.y.value >= fromY && node.y.value <= toY) {
        if (!options?.deselection && !(options?.inversion && !options?.selection && values.value.has(node.id))) {
          newProgress.add(node.id)
        }
      } else if (values.value.has(node.id)) {
        newProgress.add(node.id)
      }
    }
    progress.value = newProgress
  }

  const stopSelection = () => {
    if (!areaSelection.value.shown.value) return
    areaSelection.value.shown.value = false
    let newValues: Set<Id>

    // process the postponed single click
    if (postponedClickedNodeId.value !== null) {
      newValues = new Set()
      newValues.add(postponedClickedNodeId.value)
      postponedClickedNodeId.value = null
    } else {
      newValues = new Set(progress.value)
    }

    props.onSelectionStop?.(newValues)
    values.value = newValues
    progress.value = new Set()
  }
  return {
    /** Area selection rectangle */
    areaSelection,
    selection: useComputed(() => (areaSelection.value.shown.value ? progress.value : values.value)),
    isSelecting: useComputed(
      () =>
        !!areaSelection.value.shown.value &&
        (areaSelection.value.x1.value !== areaSelection.value.x2.value ||
          areaSelection.value.y1.value !== areaSelection.value.y2.value)
    ),
    clearSelection,
    startSelection,
    updateSelection,
    stopSelection,
  }
}
