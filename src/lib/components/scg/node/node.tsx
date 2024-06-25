import { ReadonlySignal, useComputed } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import './node.css'
import { BaseNodeProps } from './types'
import { cl } from '$lib/utils'

export type BasicNodeProps = BaseNodeProps<number, 'const-tuple' | 'var-norole', 'mutable'> & {
  onMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  onSharedProps?: (id: number) => SharedProps
}
export interface NodeProps extends BasicNodeProps {
  padding: ReadonlySignal<number>
}

export type SharedProps = {
  selected: ReadonlySignal<boolean>
}

export const Node = ({ id, type, x, y, label, padding, onMouseDown, onSharedProps }: NodeProps) => {
  console.log('node render')
  const sharedProps = onSharedProps?.(id)
  const className = useComputed(() => cl('node-container', sharedProps?.selected.value && 'selected'))
  return (
    <g>
      <g class={className} onMouseDown={onMouseDown}>
        {padding && <circle cx={x} cy={y} fill='transparent' />}
        <use class='node' xlinkHref={`#scg-node-${type}`} x={x} y={y} />
      </g>
      {label && (
        <text class='node-label' x={useComputed(() => x.value + 17)} y={useComputed(() => y.value + 21)}>
          {label}
        </text>
      )}
    </g>
  )
}
