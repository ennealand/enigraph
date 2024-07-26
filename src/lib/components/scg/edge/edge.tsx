import { cl } from '$lib/utils'
import { ReadonlySignal, useComputed } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import './edge.css'
import { BaseEdgeProps } from './types'

export type BasicEdgeProps = BaseEdgeProps<number, 'const-tuple' | 'var-norole', 'mutable'> & {
  onMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  onTextDoubleClick?: (data: { e: JSX.TargetedMouseEvent<SVGGElement>; id: number }) => void
  onSharedProps?: (data: { id: number; sourceId: number; targetId: number }) => SharedProps
  padding?: boolean
}

export type SharedProps = {
  selected: ReadonlySignal<boolean>
}

export const Edge = ({ id, x1, y1, x2, y2, sourceRadius, targetRadius, sourceId, targetId, onSharedProps }: BasicEdgeProps) => {
  console.log('node render')
  const sharedProps = onSharedProps?.({ id, sourceId, targetId })
  const className = useComputed(() => cl('edge-container', sharedProps?.selected.value && 'selected'))
  const rad = useComputed(() => Math.atan2(y2.value - y1.value, x2.value - x1.value))
  const d = useComputed(() => `M ${x1.value + Math.cos(rad.value) * ((sourceRadius?.value ?? 0) - 10)} ${y1.value + Math.sin(rad.value) * ((sourceRadius?.value ?? 0) - 10)} L ${x2.value - Math.cos(rad.value) * (targetRadius?.value ?? 0)} ${y2.value - Math.sin(rad.value) * (targetRadius?.value ?? 0)}`)

  const arrowPoints = useComputed(() => {
    const arrowLength = 6.5
    const arrowWidth = 7.5
    // Calculate the arrowhead points
    const xx2 = x2.value - Math.cos(rad.value) * (-10 + (targetRadius?.value ?? 0))
    const yy2 = y2.value - Math.sin(rad.value) * (-10 + (targetRadius?.value ?? 0))
    const x3 = x2.value - Math.cos(rad.value) * (arrowLength + (targetRadius?.value ?? 0))
    const y3 = y2.value - Math.sin(rad.value) * (arrowLength + (targetRadius?.value ?? 0))
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
