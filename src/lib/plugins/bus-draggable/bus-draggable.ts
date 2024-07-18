import { BaseBusProps } from '$lib/components/scg/bus/types'
import { batch, ReadonlySignal, useComputed, useSignal } from '@preact/signals'

type Props<Id extends string | number> = {
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  changeBusPosition?(element: BaseBusProps<Id>, x: number, y: number): void
  busPositionChanged?(element: BaseBusProps<Id>): void
  zoom: ReadonlySignal<number>
}

type DraggingContext<Id extends string | number> = {
  isDragging: ReadonlySignal<boolean>
  startBusDragging: (e: MouseEvent, bus: BaseBusProps<Id>) => void
  updateBusDragging: (e: MouseEvent) => void
  abortBusDragging: (options?: { revert: boolean }) => void
  stopBusDragging: () => void
  draggedBus: ReadonlySignal<BaseBusProps<Id> | null>
}

export const withBusDraggable = <Id extends string | number>(props: Props<Id>): DraggingContext<Id> => {
  const startPoint = useSignal({ x: 0, y: 0 })
  const totalShift = useSignal({ x: 0, y: 0 })
  const draggedBus = useSignal<BaseBusProps<Id> | null>(null)
  const isDragging = useComputed(() => !!draggedBus.value)

  const startBusDragging = (e: MouseEvent, bus: BaseBusProps<Id>) => {
    draggedBus.value = bus
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    startPoint.value.x = x
    startPoint.value.y = y
    totalShift.value.x = 0
    totalShift.value.y = 0
  }

  const updateBusDragging = (e: MouseEvent) => {
    if (!isDragging.value) return
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    const shiftX = startPoint.value.x - x
    const shiftY = startPoint.value.y - y
    const zoom = props.zoom?.value ?? 1
    batch(() => {
      props.changeBusPosition?.(
        draggedBus.value!,
        draggedBus.value!.dx.value - shiftX / zoom,
        draggedBus.value!.dy.value - shiftY / zoom
      )
    })
    totalShift.value.x += shiftX
    totalShift.value.y += shiftY
    startPoint.value.x = x
    startPoint.value.y = y
  }

  const abortBusDragging = (options?: { revert: boolean }) => {
    if (!isDragging.value) return
    if (options?.revert) {
      const zoom = props.zoom?.value ?? 1
      props.changeBusPosition?.(
        draggedBus.value!,
        draggedBus.value!.dx.value + totalShift.value.x / zoom,
        draggedBus.value!.dy.value + totalShift.value.y / zoom
      )
    }
    stopBusDragging()
  }

  const stopBusDragging = () => {
    if (!isDragging.value) return
    props.busPositionChanged?.(draggedBus.value!)
    draggedBus.value = null
  }

  return { isDragging, startBusDragging, updateBusDragging, abortBusDragging, stopBusDragging, draggedBus }
}
