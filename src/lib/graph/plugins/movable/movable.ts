import { useSignal } from '@preact/signals'
import { useDeepSignal } from 'deepsignal'

type Props = {
  width: number
  height: number
  getInnerPoint: (x: number, y: number) => readonly [number, number]
}

export const withMovable = (props: Props) => {
  const centerX = props.width / 2
  const centerY = props.height / 2

  const transform = useDeepSignal({ x: 0, y: 0, zoom: 1, moving: false })
  const localize = (x: number, y: number) =>
    [(x - centerX - transform.x) / transform.zoom, (y - centerY - transform.y) / transform.zoom] as const
  const weakLocalize = (x: number, y: number) =>
    [(x - transform.x) / transform.zoom, (y - transform.y) / transform.zoom] as const

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
    if (e.ctrlKey) {
      let deltaZoom = e.deltaY * 0.01
      if (transform.zoom - deltaZoom < 0.1) deltaZoom = transform.zoom - 0.1
      else if (transform.zoom - deltaZoom > 5) deltaZoom = transform.zoom - 5

      transform.x += (deltaZoom / transform.zoom) * (e.offsetX - centerX - transform.x)
      transform.y += (deltaZoom / transform.zoom) * (e.offsetY - centerY - transform.y)
      transform.zoom -= deltaZoom
    } else {
      transform.x -= e.deltaX
      transform.y -= e.deltaY
    }
  }

  return {
    transform,
    centerX,
    centerY,
    localize,
    weakLocalize,
    onwheel,
    zoom: transform.$zoom,
    startMoving,
    updateMoving,
    stopMoving,
  }
}
