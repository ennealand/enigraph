import { BaseContentProps } from '$lib/components/scg/content/types'
import { BaseEdgeProps } from '$lib/components/scg/edge/types'
import { BaseGroupProps } from '$lib/components/scg/group/types'
import { BaseNodeProps } from '$lib/components/scg/node/types'
import { batch, ReadonlySignal, useComputed, useSignal } from '@preact/signals'
import { MagneticGroupEffect, magneticGroupEffect } from './magnetic-group'

type Props<Id extends string | number> = {
  nodes?: ReadonlySignal<BaseNodeProps<Id>[]>
  edges?: ReadonlySignal<BaseEdgeProps<Id>[]>
  contents?: ReadonlySignal<BaseContentProps<Id>[]>
  groups?: ReadonlySignal<BaseGroupProps<Id>[]>
  selection: ReadonlySignal<Set<Id>>
  isSelecting: ReadonlySignal<boolean>
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  localize: (x: number, y: number) => readonly [number, number]
  globalize: (x: number, y: number) => readonly [number, number]
  changeNodePosition?(element: BaseNodeProps<Id>, x: number, y: number): void
  changeContentPosition?(element: BaseContentProps<Id>, x: number, y: number): void
  nodePositionChanged?(element: BaseNodeProps<Id>): void
  contentPositionChanged?(element: BaseContentProps<Id>): void
  zoom: ReadonlySignal<number>
}

type DraggingContext = {
  isDragging: ReadonlySignal<boolean>
  isNoselect: ReadonlySignal<boolean>
  startDragging: (e: MouseEvent) => void
  updateDragging: (e: MouseEvent) => void
  abortDragging: (options?: { revert: boolean }) => void
  stopDragging: () => void
  magneticEffects: ReadonlySignal<Map<string | number, MagneticGroupEffect>>
  groupHighlights: ReadonlySignal<Map<string | number, 'enter' | 'leave'>>
}

export const withDraggable = <Id extends string | number>(props: Props<Id>): DraggingContext => {
  const isDragging = useSignal(false)
  const startPoint = useSignal({ x: 0, y: 0 })
  const totalShift = useSignal({ x: 0, y: 0 })
  const pinnedToY = useSignal<boolean | null>(null)

  const magneticEffects = useSignal(new Map<string | number, MagneticGroupEffect>())
  const initialInsideGroups = useSignal(new Set<string | number>())
  const groupHighlights = useSignal(new Map<string | number, 'enter' | 'leave'>())

  const startDragging = (e: MouseEvent) => {
    isDragging.value = true
    const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    startPoint.value.x = x
    startPoint.value.y = y
    totalShift.value.x = 0
    totalShift.value.y = 0
    pinnedToY.value = null

    if (props.groups) {
      const newInsideGroups = new Set<string | number>()
      const groups = props.groups.value
      for (const group of groups) {
        if (props.selection.value.has(group.id)) continue
        const wasInside = !!magneticGroupEffect(props.globalize, group, x, y, { preview: true })
        if (wasInside) newInsideGroups.add(group.id)
      }
      initialInsideGroups.value = newInsideGroups
    }
  }

  const updateDragging = (e: MouseEvent) => {
    if (!isDragging.value) return
    let [x, y] = props.getInnerPoint(e.clientX, e.clientY)
    const [mx, my] = props.localize(x, y)

    const newMagneticEffects: Map<string | number, MagneticGroupEffect> = new Map()
    const newGroupHighlights = new Map<string | number, 'enter' | 'leave'>()
    // Handle dragging into groups
    if (props.groups) {
      const groups = props.groups.value
      const magneticPins: (readonly [number, number])[] = []
      for (const group of groups) {
        if (props.selection.value.has(group.id)) continue
        const wasInside = !!magneticGroupEffect(props.globalize, group, startPoint.value.x, startPoint.value.y, {
          preview: true,
        })
        const initialInside = initialInsideGroups.value.has(group.id)
        if (wasInside !== initialInside) {
          newGroupHighlights.set(group.id, wasInside ? 'enter' : 'leave')
        }
        const isMagnetic = magneticGroupEffect(props.globalize, group, x, y, { revert: wasInside })
        if (isMagnetic) {
          newMagneticEffects.set(group.id, {
            x: x - isMagnetic[0],
            y: isMagnetic[1] - y,
            mouse: { x: mx, y: my },
            revert: wasInside,
          })
          magneticPins.push(isMagnetic)
        }
      }

      if (magneticPins.length && !e.altKey) {
        let maxVx = 0
        let maxVy = 0
        for (const pin of magneticPins) {
          const vx = Math.abs(x - pin[0])
          const vy = Math.abs(y - pin[1])
          if (vx > maxVx) {
            x = pin[0]
            maxVx = vx
          }
          if (vy > maxVy) {
            y = pin[1]
            maxVy = vy
          }
        }
      }
    }

    let shiftX = startPoint.value.x - x
    let shiftY = startPoint.value.y - y
    const zoom = props.zoom?.value ?? 1
    let newPinnedToY: boolean | null = null
    if (e.shiftKey) {
      newPinnedToY = Math.abs(totalShift.value.x + shiftX) > Math.abs(totalShift.value.y + shiftY)
      if (newPinnedToY) {
        shiftY = 0
        if (pinnedToY.value !== newPinnedToY) {
          if (pinnedToY.value !== null) shiftX += totalShift.value.x
          shiftY -= totalShift.value.y
          console.log('switch Y')
        }
      } else {
        shiftX = 0
        if (pinnedToY.value !== newPinnedToY) {
          console.log('switch X')
          if (pinnedToY.value !== null) shiftY += totalShift.value.y
          shiftX -= totalShift.value.x
        }
      }
    } else if (pinnedToY.value !== null) {
      if (pinnedToY.value) shiftY += totalShift.value.y
      else shiftX += totalShift.value.x
    }

    batch(() => {
      groupHighlights.value = newGroupHighlights
      pinnedToY.value = newPinnedToY
      if (newMagneticEffects.size || magneticEffects.value.size) {
        magneticEffects.value = newMagneticEffects
      }
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
    totalShift.value.x += startPoint.value.x - x
    totalShift.value.y += startPoint.value.y - y
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
      if (groupHighlights.value.size) {
        groupHighlights.value = new Map()
      }
      if (initialInsideGroups.value.size) {
        initialInsideGroups.value = new Set()
      }
      if (magneticEffects.value.size) {
        magneticEffects.value = new Map()
      }
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

  const isNoselect = useComputed(() => props.isSelecting.value || isDragging.value)
  return { isDragging, startDragging, updateDragging, abortDragging, stopDragging, isNoselect, magneticEffects, groupHighlights }
}
