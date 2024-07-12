import { cl } from '$lib/utils'
import { ReadonlySignal, useComputed } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import './edge.css'
import { BaseEdgeProps } from './types'

export type BasicEdgeProps = BaseEdgeProps<number, 'const-tuple' | 'var-norole', 'mutable'> & {
  onMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  onTextDoubleClick?: (data: { e: JSX.TargetedMouseEvent<SVGGElement>; id: number }) => void
  onSharedProps?: (data: { id: number; sourceId: number; targetId: number }) => SharedProps
  sourceId: number
  targetId: number
  padding?: boolean
}

export type SharedProps = {
  selected: ReadonlySignal<boolean>
}

export const Edge = ({ id, x1, y1, x2, y2, sourceId, targetId, onSharedProps }: BasicEdgeProps) => {
  console.log('node render')
  const sharedProps = onSharedProps?.({ id, sourceId, targetId })
  const className = useComputed(() => cl('edge-container', sharedProps?.selected.value && 'selected'))
  const rad = useComputed(() => Math.atan2(y2.value - y1.value, x2.value - x1.value))
  const d = useComputed(
    () => `M ${x1.value} ${y1.value} L ${x2.value - Math.cos(rad.value) * 10} ${y2.value - Math.sin(rad.value) * 10}`
  )

  const arrowPoints = useComputed(() => {
    const arrowLength = 16.5
    const arrowWidth = 7.5
    // Calculate the arrowhead points
    const xx2 = x2.value - Math.cos(rad.value) * 5
    const yy2 = y2.value - Math.sin(rad.value) * 5
    const x3 = x2.value - Math.cos(rad.value) * arrowLength
    const y3 = y2.value - Math.sin(rad.value) * arrowLength
    const x4 = x3 + Math.cos(rad.value + Math.PI / 6) * arrowWidth
    const y4 = y3 + Math.sin(rad.value + Math.PI / 6) * arrowWidth
    const x5 = x3 + Math.cos(rad.value - Math.PI / 6) * arrowWidth
    const y5 = y3 + Math.sin(rad.value - Math.PI / 6) * arrowWidth

    return `${xx2},${yy2} ${x4},${y4} ${x5},${y5}`
  })
  return (
    <g class={className}>
      <path stroke-width='7.5' d={d} class='edge-stroke' />
      <path stroke-width='5' class='edge-fill' d={d} />
      <polygon points={arrowPoints} stroke-width='0' class='edge-arrow' />
    </g>
  )
}
