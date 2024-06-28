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
}
export interface EdgeProps extends BasicEdgeProps {
  padding?: ReadonlySignal<number>
}

export type SharedProps = {
  selected: ReadonlySignal<boolean>
}

export const Edge = ({ id, x1, y1, x2, y2, sourceId, targetId, onSharedProps }: EdgeProps) => {
  console.log('node render')
  const sharedProps = onSharedProps?.({ id, sourceId, targetId })
  const className = useComputed(() => cl('edge-container', sharedProps?.selected.value && 'selected'))
  const rad = useComputed(() => Math.atan2(y2.value - y1.value, x2.value - x1.value))
  const d = useComputed(
    () => `M ${x1.value} ${y1.value} L ${x2.value - Math.cos(rad.value) * 10} ${y2.value - Math.sin(rad.value) * 10}`
  )
  return (
    <g class={className}>
      <path stroke-width='7.5' d={d} class='edge-stroke' />
      <path stroke-width='5' class='edge-fill' d={d} marker-end='url("#end-arrow-common")' />
    </g>
  )
}
