import { BaseContentProps } from '$lib/components/scg/content/types'
import { batch, ReadonlySignal, useComputed, useSignal } from '@preact/signals'

type Props<Id extends string | number> = {
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  changeContentPosition?(element: BaseContentProps<Id>, x: number, y: number): void
  busPositionChanged?(element: BaseContentProps<Id>): void
  zoom: ReadonlySignal<number>
}

type DraggingContext<Id extends string | number> = {
  isDragging: ReadonlySignal<boolean>
  startContentDragging: (e: MouseEvent, bus: BaseContentProps<Id>) => void
  updateContentDragging: (e: MouseEvent) => void
  abortContentDragging: (options?: { revert: boolean }) => void
  stopContentDragging: () => void
  draggedContent: ReadonlySignal<BaseContentProps<Id> | null>
}

export const withContentDraggable = <Id extends string | number>(props: Props<Id>): DraggingContext<Id> => {
  const startPoint = useSignal({ x: 0, y: 0 })
  const totalShift = useSignal({ x: 0, y: 0 })
  const draggedContent = useSignal<BaseContentProps<Id> | null>(null)
  const isDragging = useComputed(() => !!draggedContent.value)

  const startContentDragging = (e: MouseEvent, bus: BaseContentProps<Id>) => {
    draggedContent.value = bus
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    startPoint.value.x = x
    startPoint.value.y = y
    totalShift.value.x = 0
    totalShift.value.y = 0
  }

  const updateContentDragging = (e: MouseEvent) => {
    if (!isDragging.value) return
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    const shiftX = startPoint.value.x - x
    const shiftY = startPoint.value.y - y
    const zoom = props.zoom?.value ?? 1
    batch(() => {
      props.changeContentPosition?.(
        draggedContent.value!,
        draggedContent.value!.x.value - shiftX / zoom,
        draggedContent.value!.y.value - shiftY / zoom
      )
    })
    totalShift.value.x += shiftX
    totalShift.value.y += shiftY
    startPoint.value.x = x
    startPoint.value.y = y
  }

  const abortContentDragging = (options?: { revert: boolean }) => {
    if (!isDragging.value) return
    if (options?.revert) {
      const zoom = props.zoom?.value ?? 1
      props.changeContentPosition?.(
        draggedContent.value!,
        draggedContent.value!.x.value + totalShift.value.x / zoom,
        draggedContent.value!.y.value + totalShift.value.y / zoom
      )
    }
    stopContentDragging()
  }

  const stopContentDragging = () => {
    if (!isDragging.value) return
    props.busPositionChanged?.(draggedContent.value!)
    draggedContent.value = null
  }

  return { isDragging, startContentDragging, updateContentDragging, abortContentDragging, stopContentDragging, draggedContent }
}
