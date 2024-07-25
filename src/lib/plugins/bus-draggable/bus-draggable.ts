import { BaseBusProps } from '$lib/components/scg/bus/types'
import { batch, ReadonlySignal, useComputed, useSignal } from '@preact/signals'

type Props<Id extends string | number> = {
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  localize: (x: number, y: number) => readonly [number, number]
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
  const startPoint = useSignal({ dx: 0, dy: 0 })
  const draggedBus = useSignal<BaseBusProps<Id> | null>(null)
  const isDragging = useComputed(() => !!draggedBus.value)

  const startBusDragging = (_e: MouseEvent, bus: BaseBusProps<Id>) => {
    draggedBus.value = bus
    startPoint.value.dx = bus.dx.value
    startPoint.value.dy = bus.dy.value
  }

  const updateBusDragging = (e: MouseEvent) => {
    if (!isDragging.value) return
    const [x, y] = props.localize(...props.getInnerPoint(e.clientX, e.clientY))
    let newDX = x - draggedBus.value!.x.value
    let newDY = y - draggedBus.value!.y.value
    if (e.shiftKey) {
      if (Math.abs(draggedBus.value!.x.value - x) > Math.abs(draggedBus.value!.y.value - y)) newDY = 0
      else newDX = 0
    }
    batch(() => {
      props.changeBusPosition?.(draggedBus.value!, newDX, newDY)
    })
  }

  const abortBusDragging = (options?: { revert: boolean }) => {
    if (!isDragging.value) return
    if (options?.revert) {
      props.changeBusPosition?.(draggedBus.value!, startPoint.value.dx, startPoint.value.dy)
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
