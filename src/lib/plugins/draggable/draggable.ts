import { BaseContentProps } from '$lib/components/scg/content/types'
import { BaseEdgeProps } from '$lib/components/scg/edge/types'
import { BaseNodeProps } from '$lib/components/scg/node/types'
import { batch, ReadonlySignal, useSignal } from '@preact/signals'

type Props<Id extends string | number> = {
  nodes?: ReadonlySignal<BaseNodeProps<Id>[]>
  edges?: ReadonlySignal<BaseEdgeProps<Id>[]>
  contents?: ReadonlySignal<BaseContentProps<Id>[]>
  selection: ReadonlySignal<Set<Id>>
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  changeNodePosition?(element: BaseNodeProps<Id>, x: number, y: number): void
  changeContentPosition?(element: BaseContentProps<Id>, x: number, y: number): void
  nodePositionChanged?(element: BaseNodeProps<Id>): void
  edgePositionChanged?(element: BaseEdgeProps<Id>): void
  contentPositionChanged?(element: BaseContentProps<Id>): void
  zoom: ReadonlySignal<number>
}

type DraggingContext = {
  isDragging: ReadonlySignal<boolean>
  startDragging: (e: MouseEvent) => void
  updateDragging: (e: MouseEvent) => void
  abortDragging: (options?: { revert: boolean }) => void
  stopDragging: () => void
}

export const withDraggable = <Id extends string | number>(props: Props<Id>): DraggingContext => {
  const isDragging = useSignal(false)
  const startPoint = useSignal({ x: 0, y: 0 })
  const totalShift = useSignal({ x: 0, y: 0 })

  const startDragging = (e: MouseEvent) => {
    isDragging.value = true
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    startPoint.value.x = x
    startPoint.value.y = y
    totalShift.value.x = 0
    totalShift.value.y = 0
  }

  const updateDragging = (e: MouseEvent) => {
    if (!isDragging.value) return
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    const shiftX = startPoint.value.x - x
    const shiftY = startPoint.value.y - y
    const zoom = props.zoom?.value ?? 1
    batch(() => {
      const edgesSet = new Set<Id>()
      if (props.edges) {
        for (const edge of props.edges.value) {
          if (!props.selection.value.has(edge.id)) continue
          if (!props.selection.value.has(edge.sourceId)) edgesSet.add(edge.sourceId)
          if (!props.selection.value.has(edge.targetId)) edgesSet.add(edge.targetId)
        }
      }
      if (props.nodes) {
        for (const node of props.nodes.value) {
          if (!props.selection.value.has(node.id) && !edgesSet.has(node.id)) continue
          props.changeNodePosition?.(node, node.x.value - shiftX / zoom, node.y.value - shiftY / zoom)
        }
      }
      if (props.contents) {
        for (const content of props.contents.value) {
          if (!props.selection.value.has(content.id) && !edgesSet.has(content.id)) continue
          props.changeContentPosition?.(content, content.x.value - shiftX / zoom, content.y.value - shiftY / zoom)
        }
      }
    })
    totalShift.value.x += shiftX
    totalShift.value.y += shiftY
    startPoint.value.x = x
    startPoint.value.y = y
  }

  const abortDragging = (options?: { revert: boolean }) => {
    if (!isDragging.value) return
    if (options?.revert) {
      const zoom = props.zoom?.value ?? 1
      batch(() => {
        const edgesSet = new Set<Id>()
        if (props.edges) {
          for (const edge of props.edges.value) {
            if (!props.selection.value.has(edge.id)) continue
            if (!props.selection.value.has(edge.sourceId)) edgesSet.add(edge.sourceId)
            if (!props.selection.value.has(edge.targetId)) edgesSet.add(edge.targetId)
          }
        }
        if (props.nodes) {
          for (const node of props.nodes.value) {
            if (!props.selection.value.has(node.id) && !edgesSet.has(node.id)) continue
            props.changeNodePosition?.(
              node,
              node.x.value + totalShift.value.x / zoom,
              node.y.value + totalShift.value.y / zoom
            )
          }
        }
        if (props.contents) {
          for (const content of props.contents.value) {
            if (!props.selection.value.has(content.id) && !edgesSet.has(content.id)) continue
            props.changeContentPosition?.(
              content,
              content.x.value + totalShift.value.x / zoom,
              content.y.value + totalShift.value.y / zoom
            )
          }
        }
      })
    }
    stopDragging()
  }

  const stopDragging = () => {
    if (!isDragging.value) return
    batch(() => {
      const edgesSet = new Set<Id>()
      if (props.edges) {
        for (const edge of props.edges.value) {
          if (!props.selection.value.has(edge.id)) continue
          if (!props.selection.value.has(edge.sourceId)) edgesSet.add(edge.sourceId)
          if (!props.selection.value.has(edge.targetId)) edgesSet.add(edge.targetId)
        }
      }
      if (props.nodes && props.nodePositionChanged) {
        for (const node of props.nodes.value) {
          if (!props.selection.value.has(node.id) && !edgesSet.has(node.id)) continue
          props.nodePositionChanged(node)
        }
      }
      if (props.contents && props.contentPositionChanged) {
        for (const content of props.contents.value) {
          if (!props.selection.value.has(content.id) && !edgesSet.has(content.id)) continue
          props.contentPositionChanged(content)
        }
      }
    })
    isDragging.value = false
  }

  return { isDragging, startDragging, updateDragging, abortDragging, stopDragging }
}
