import { MagneticGroupEffect } from '$lib/plugins/draggable/magnetic-group'
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
  magneticEffects?: ReadonlySignal<Map<string | number, MagneticGroupEffect>>
  groupHighlights?: ReadonlySignal<Set<string | number>>
}

export const Group = (props: BasicGroupProps) => {
  const { id, x, y, dx, dy, padding, onMouseDown, onSharedProps } = props
  const sharedProps = onSharedProps?.(id)
  const highlight = useComputed(() => sharedProps?.groupHighlights?.value.get(id))
  const className = useComputed(() =>
    cl(
      'group-container',
      sharedProps?.selected.value ? 'selected' : sharedProps?.noselect.value && 'noselect',
      highlight.value && `highlight-${highlight.value}`
    )
  )
  const shadowEffect = useComputed(() => {
    const magnet = sharedProps?.magneticEffects?.value.get(id)
    if (!magnet) return
    const x1 = (magnet.x < 0 && !magnet.revert) || (magnet.x > 0 && magnet.revert) ? x.value + dx.value : x.value
    const x2 = magnet.x ? x1 : x.value + dx.value
    const y1 = (magnet.y > 0 && !magnet.revert) || (magnet.y < 0 && magnet.revert) ? y.value + dy.value : y.value
    const y2 = magnet.y ? y1 : y.value + dy.value
    const cx = magnet.x ? x1 + magnet.x / 2 : magnet.mouse.x
    const cy = magnet.y ? y1 - magnet.y / 2 : magnet.mouse.y
    // console.log({ x1, y1, x2, y2, cx, cy })
    return `M${x1} ${y1} C${cx} ${cy} ${cx} ${cy} ${x2} ${y2}`
  })
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
      {shadowEffect.value && <path class={'magnet'} d={shadowEffect} />}
      <rect class={'group'} x={x} y={y} width={dx} height={dy} />
    </g>
  )
}
