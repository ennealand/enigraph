import { cl } from '$lib/utils'
import { ReadonlySignal, useComputed } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import './group.css'
import { BaseGroupProps } from './types'

export type BasicGroupProps = BaseGroupProps<number, 'mutable'> & {
  onMouseDown?: ({ e, id }: { e: JSX.TargetedMouseEvent<SVGGElement>; id: number }) => void
  onThumbMouseDown?: (e: { e: JSX.TargetedMouseEvent<SVGGElement>; id: number }) => void
  onSharedProps?: (id: number) => SharedProps
  padding?: boolean
}

export type SharedProps = {
  selected: ReadonlySignal<boolean>
  noselect: ReadonlySignal<boolean>
}

export const Group = (props: BasicGroupProps) => {
  const { id, x, y, dx, dy, padding, onMouseDown, onSharedProps } = props
  const sharedProps = onSharedProps?.(id)
  const className = useComputed(() =>
    cl('group-container', sharedProps?.selected.value ? 'selected' : sharedProps?.noselect.value && 'noselect')
  )
  const P = 5
  return (
    <g class={className} onMouseDown={e => onMouseDown?.({ e, id })}>
      {padding && (
        <rect
          x={useComputed(() => x.value - P)}
          y={useComputed(() => y.value - P)}
          width={useComputed(() => dx.value + P * 2)}
          height={useComputed(() => dy.value + P * 2)}
          fill='transparent'
        />
      )}
      <rect class={'group'} x={x} y={y} width={dx} height={dy} />
    </g>
  )
}
