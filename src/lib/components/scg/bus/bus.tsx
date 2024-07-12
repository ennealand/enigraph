import { cl } from '$lib/utils'
import { ReadonlySignal, useComputed } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import './bus.css'
import { BaseBusProps } from './types'

export type BasicBusProps = BaseBusProps<number, 'mutable'> & {
  onMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  onThumbMouseDown?: (e: { e: JSX.TargetedMouseEvent<SVGGElement>; id: number }) => void
  onSharedProps?: (id: number) => SharedProps
  padding?: boolean
}

export type SharedProps = {
  selected: ReadonlySignal<boolean>
}

export const Bus = ({ id, x, y, dx, dy, padding, onMouseDown, onThumbMouseDown, onSharedProps }: BasicBusProps) => {
  console.log('bus render')
  const sharedProps = onSharedProps?.(id)
  const className = useComputed(() => cl('bus-container', sharedProps?.selected.value && 'selected'))
  const d = useComputed(() => `M ${x.value} ${y.value} L ${x.value + dx.value} ${y.value + dy.value}`)
  return (
    <g class={className} onMouseDown={onMouseDown}>
      {padding && <path class='bus-padding' d={d} />}
      <path stroke-width='8' class='bus-fill' d={d} />
      <circle
        onMouseDown={e => onThumbMouseDown?.({ e, id })}
        cx={useComputed(() => x.value + dx.value)}
        cy={useComputed(() => y.value + dy.value)}
        class='bus-thumb-padding'
      />
      <circle
        onMouseDown={e => onThumbMouseDown?.({ e, id })}
        cx={useComputed(() => x.value + dx.value)}
        cy={useComputed(() => y.value + dy.value)}
        class='bus-thumb'
      />
    </g>
  )
}
