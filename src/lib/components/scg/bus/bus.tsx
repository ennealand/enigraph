import { cl } from '$lib/utils'
import { ReadonlySignal, useComputed } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import './bus.css'
import { BaseBusProps } from './types'

export type BasicBusProps = BaseBusProps<number, 'mutable'> & {
  onMouseDown?: ({ e, id, sourceId }: { e: JSX.TargetedMouseEvent<SVGGElement>; id: number; sourceId: number }) => void
  onThumbMouseDown?: (e: { e: JSX.TargetedMouseEvent<SVGGElement>; id: number }) => void
  onSharedProps?: (id: number) => SharedProps
  padding?: boolean
}

export type SharedProps = {
  selected: ReadonlySignal<boolean>
  noselect: ReadonlySignal<boolean>
}

export const Bus = (props: BasicBusProps) => {
  const { id, sourceId, x, y, dx, dy, padding, onMouseDown, onThumbMouseDown, onSharedProps } = props
  console.log('bus render')
  const sharedProps = onSharedProps?.(id)
  const className = useComputed(() =>
    cl('bus-container', sharedProps?.selected.value ? 'selected' : sharedProps?.noselect.value && 'noselect')
  )
  const d = useComputed(() => `M ${x.value} ${y.value} L ${x.value + dx.value} ${y.value + dy.value}`)
  return (
    <g class={className} onMouseDown={e => onMouseDown?.({ e, id, sourceId })}>
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
