import { INode } from '$lib/types'
import { useSignal } from '@preact/signals'
import { ReadonlySignal, computed } from '@preact/signals'
import { DeepSignal } from 'deepsignal'
import { useCallback, useEffect } from 'preact/hooks'

type Props = {
  nodes: DeepSignal<INode[]>
  selection: ReadonlySignal<Set<number>>
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  changeNodePosition?(element: INode, x: number, y: number): void
  nodePositionChanged?(element: INode): void
  zoom?: ReadonlySignal<number>
}

export const useDraggable = (props: Props) => {
  const dragging = useSignal(false)
  const startPoint = useSignal({ x: 0, y: 0 })
  const totalShift = useSignal({ x: 0, y: 0 })

  const startDragginig = (e: MouseEvent) => {
    dragging.value = true
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    startPoint.value.x = x
    startPoint.value.y = y
    totalShift.value.x = 0
    totalShift.value.y = 0
    document.addEventListener('mouseup', stopDragging, { once: true })
  }

  const updateDragging = (e: MouseEvent) => {
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    const shiftX = startPoint.value.x - x
    const shiftY = startPoint.value.y - y
    const zoom = props.zoom?.value ?? 1
    for (const node of props.nodes) {
      if (!props.selection.value.has(node.id)) continue
      props.changeNodePosition?.(node, node.x - shiftX / zoom, node.y - shiftY / zoom)
    }
    totalShift.value.x += shiftX
    totalShift.value.y += shiftY
    startPoint.value.x = x
    startPoint.value.y = y
  }

  const abortDragging = (options?: { revert: boolean }) => {
    if (!dragging.value) return
    if (options?.revert) {
      const zoom = props.zoom?.value ?? 1
      for (const node of props.nodes) {
        if (!props.selection.value.has(node.id)) continue
        props.changeNodePosition?.(node, node.x + totalShift.value.x / zoom, node.y + totalShift.value.y / zoom)
      }
    }
    stopDragging()
  }

  const stopDragging = useCallback(() => {
    document.removeEventListener('mouseup', stopDragging)
    if (props.nodePositionChanged) {
      for (const node of props.nodes) {
        if (!props.selection.value.has(node.id)) continue
        props.nodePositionChanged(node)
      }
    }
    dragging.value = false
  }, [dragging, props.nodes, props.selection, props.nodePositionChanged])

  useEffect(
    () => () => document.removeEventListener('mouseup', stopDragging),
    [dragging, props.nodes, props.selection, props.nodePositionChanged]
  )

  return { isDragging: computed(() => dragging.value), startDragginig, updateDragging, abortDragging }
}
