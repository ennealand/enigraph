import { BaseContentProps } from '$lib/components/scg/content/types'
import { BaseEdgeProps } from '$lib/components/scg/edge/types'
import { BaseNodeProps } from '$lib/components/scg/node/types'
import { batch, ReadonlySignal, signal, useComputed, useSignal } from '@preact/signals'
import { type AreaSelectionProps } from './area-selection'

type Props<Id extends string | number> = {
  nodes?: ReadonlySignal<BaseNodeProps<Id>[]>
  edges?: ReadonlySignal<BaseEdgeProps<Id>[]>
  contents?: ReadonlySignal<BaseContentProps<Id>[]>
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
  startSelection: (
    e: MouseEvent,
    options?: { deselection?: boolean; selection?: boolean; inversion?: boolean; clear?: boolean },
    clickedId?: Id
  ) => void
  updateSelection: (
    e: MouseEvent,
    options?: { deselection?: boolean; selection?: boolean; inversion?: boolean }
  ) => void
  stopSelection: () => void
}

export const withSelection = <Id extends string | number>(props: Props<Id>): SelectionContext<Id> => {
  const localize = props.localize ?? ((x, y) => [x, y])

  const areaSelection = useComputed(
    () =>
      ({
        shown: signal(false),
        type: signal<'deselection' | 'selection' | 'inversion' | undefined>('deselection'),
        x1: signal(0),
        y1: signal(0),
        x2: signal(0),
        y2: signal(0),
      }) satisfies AreaSelectionProps
  )
  const progress = useSignal(new Set<Id>())
  const values = useSignal(new Set<Id>())
  const postponedClickedNodeId = useSignal(null as Id | null)

  const clearSelection = () => {
    if (values.value.size) values.value = new Set()
  }

  const startSelection = (
    e: MouseEvent,
    options?: { deselection?: boolean; selection?: boolean; inversion?: boolean; clear?: boolean },
    clickedId?: Id
  ) => {
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)

    const newProgress = options?.clear ? new Set<Id>() : new Set(values.value)

    // Select a single node is clicked on it
    if (clickedId !== undefined) {
      const processSingleClick = (values: Set<Id>) => {
        if (!options?.deselection && !(options?.inversion && !options?.selection && values.has(clickedId))) {
          values.add(clickedId)
        } else {
          values.delete(clickedId)
        }
      }
      // If clear => select now; otherwise select later (on mouse move??! might be excessive -- it is!!)
      //       ^ mouse down ^                  ^ mouse move ^  or  ^ mouse up ^ (whatever fires first)
      // The problem is that mouse move might not be triggered (so we need to process stuff on mouse up - uh oh)
      if (options?.clear) {
        // process on mouse up
        postponedClickedNodeId.value = clickedId
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
      areaSelection.value.type.value = options?.deselection
        ? 'deselection'
        : options?.selection
          ? 'selection'
          : options?.inversion && !options.clear
            ? 'inversion'
            : undefined
      progress.value = dontClear ? new Set(values.value) : newProgress
      if (options?.clear && !dontClear) values.value = new Set<Id>()
    })
  }

  const updateSelection = (
    e: MouseEvent,
    options?: { deselection?: boolean; selection?: boolean; inversion?: boolean }
  ) => {
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
    batch(() => {
      areaSelection.value.x2.value = x
      areaSelection.value.y2.value = y
      areaSelection.value.type.value = options?.deselection
        ? 'deselection'
        : options?.selection
          ? 'selection'
          : options?.inversion && values.value.size
            ? 'inversion'
            : undefined
    })

    const padding = props.padding ?? 16
    const [x1, y1] = localize(areaSelection.value.x1.value, areaSelection.value.y1.value)
    const [x2, y2] = localize(areaSelection.value.x2.value, areaSelection.value.y2.value)
    const fromX = Math.min(x1, x2)
    const toX = Math.max(x1, x2)
    const fromY = Math.min(y1, y2)
    const toY = Math.max(y1, y2)

    const newProgress = new Set<Id>()
    if (props.nodes) {
      for (const index of props.nodes.value.keys()) {
        const node = props.nodes.value.at(-index - 1)!
        if (
          node.x.value >= fromX - padding &&
          node.x.value <= toX + padding &&
          node.y.value >= fromY - padding &&
          node.y.value <= toY + padding
        ) {
          if (!options?.deselection && !(options?.inversion && !options?.selection && values.value.has(node.id))) {
            newProgress.add(node.id)
          }
        } else if (values.value.has(node.id)) {
          newProgress.add(node.id)
        }
      }
    }
    if (props.contents) {
      for (const index of props.contents.value.keys()) {
        const content = props.contents.value.at(-index - 1)!
        if (
          content.x.value + content.dx.value + 6.4 >= fromX &&
          content.x.value <= toX &&
          content.y.value + content.dy.value + 6.4 >= fromY &&
          content.y.value <= toY
        ) {
          if (!options?.deselection && !(options?.inversion && !options?.selection && values.value.has(content.id))) {
            newProgress.add(content.id)
          }
        } else if (values.value.has(content.id)) {
          newProgress.add(content.id)
        }
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
