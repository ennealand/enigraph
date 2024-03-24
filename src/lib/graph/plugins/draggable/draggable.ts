import { INode } from '$lib/types'
import { useSignal } from '@preact/signals'
import { ReadonlySignal, computed } from '@preact/signals-core'
import { DeepSignal } from 'deepsignal'
import { useCallback, useEffect, useMemo } from 'preact/hooks'

type Props = {
  nodes: DeepSignal<INode[]>
  selection: ReadonlySignal<Set<string>>
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  zoom?: ReadonlySignal<number>
}

export const useDraggable = (props: Props) =>
  useMemo(() => {
    const dragging = useSignal(false)
    const startPoint = useSignal({ x: 0, y: 0 })

    const startDragginig = (e: MouseEvent) => {
      dragging.value = true
      const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
      startPoint.value = { x, y }
      document.addEventListener('mouseup', stopDragging, { once: true })
    }

    const updateDragging = (e: MouseEvent) => {
      const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
      const shiftX = startPoint.value.x - x
      const shiftY = startPoint.value.y - y
      const zoom = props.zoom?.value ?? 1
      for (const node of props.nodes) {
        if (!props.selection.value.has(node.id)) continue
        node.x -= shiftX / zoom
        node.y -= shiftY / zoom
      }
      startPoint.value = { x, y }
    }

    const stopDragging = useCallback(() => {
      document.removeEventListener('mouseup', stopDragging)
      dragging.value = false
    }, [dragging])

    useEffect(() => () => document.removeEventListener('mouseup', stopDragging), [dragging])

    return { isDragging: computed(() => dragging.value), startDragginig, updateDragging }
  }, [props.selection, props.selection, props.getInnerPoint, props.zoom])
