import { ReadonlySignal, signal, Signal, useComputed, useSignal } from '@preact/signals'

type Props = {
  getInnerPoint: (x: number, y: number) => readonly [number, number]
}

type MovableContext = {
  transform: ReadonlySignal<{
    x: Signal<number>
    y: Signal<number>
    zoom: Signal<number>
    moving: Signal<boolean>
  }>
  zoom: ReadonlySignal<number>
  localize: (x: number, y: number) => readonly [number, number]
  globalize: (x: number, y: number) => readonly [number, number]
  onwheel: (e: WheelEvent) => void
  startMoving: (e: MouseEvent) => void
  updateMoving: (e: MouseEvent) => void
  stopMoving: () => void
}

export const withMovable = (props: Props): MovableContext => {
  const transform = useComputed(() => ({ x: signal(0), y: signal(0), zoom: signal(1), moving: signal(false) }))
  const localize = (x: number, y: number) =>
    [
      (x - transform.value.x.value) / transform.value.zoom.value,
      (y - transform.value.y.value) / transform.value.zoom.value,
    ] as const
  const globalize = (x: number, y: number) =>
    [
      x * transform.value.zoom.value + transform.value.x.value,
      y * transform.value.zoom.value + transform.value.y.value,
    ] as const

  // Dragging-based moving
  const startPoint = useSignal(null as { x: number; y: number } | null)

  const startMoving = (e: MouseEvent) => {
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    startPoint.value = { x, y }
  }

  const updateMoving = (e: MouseEvent) => {
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)

    startPoint.value = { x, y }
  }

  const stopMoving = () => {
    startPoint.value = null
  }

  // Touch-based moving
  const onwheel = (e: WheelEvent) => {
    e.preventDefault()
    const [offsetX, offsetY] = props.getInnerPoint(e.clientX, e.clientY)
    if (e.ctrlKey) {
      let deltaZoom = e.deltaY * 0.01
      if (transform.value.zoom.value - deltaZoom < 0.1) deltaZoom = transform.value.zoom.value - 0.1
      else if (transform.value.zoom.value - deltaZoom > 10) deltaZoom = transform.value.zoom.value - 10

      transform.value.x.value +=
        (deltaZoom / transform.value.zoom.value) * (offsetX - transform.value.x.value)
      transform.value.y.value +=
        (deltaZoom / transform.value.zoom.value) * (offsetY - transform.value.y.value)
      transform.value.zoom.value -= deltaZoom
    } else {
      transform.value.x.value -= e.deltaX
      transform.value.y.value -= e.deltaY
    }
  }

  return {
    transform,
    zoom: useComputed(() => transform.value.zoom.value),
    localize,
    globalize,
    onwheel,
    startMoving,
    updateMoving,
    stopMoving,
  }
}
