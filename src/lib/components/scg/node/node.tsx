import { ReadonlySignal, Signal, useComputed } from '@preact/signals'
import { BaseNodeProps } from './types'
import './node.css'

export type BasicNodeProps = BaseNodeProps<number, 'const-tuple' | 'var-norole', 'mutable'>
export interface NodeProps extends BasicNodeProps {
  padding: ReadonlySignal<number>
}

export const Node = ({ type, x, y, label, padding, onMouseDown }: NodeProps) => {
  console.log('node render')
  return (
    <g>
      <g class='node-container' onMouseDown={onMouseDown}>
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
