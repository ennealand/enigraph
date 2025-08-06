import { ReadonlySignal, useComputed } from '@preact/signals'
import './area-selection.css'

export type AreaSelectionProps = {
  shown: ReadonlySignal<boolean>
  type: ReadonlySignal<'deselection' | 'selection' | 'inversion' | undefined>
  x1: ReadonlySignal<number>
  y1: ReadonlySignal<number>
  x2: ReadonlySignal<number>
  y2: ReadonlySignal<number>
}

export const AreaSelection = (props: AreaSelectionProps) => {
  const x = useComputed(() => Math.min(props.x1.value, props.x2.value))
  const y = useComputed(() => Math.min(props.y1.value, props.y2.value))
  const width = useComputed(() => Math.abs(props.x1.value - props.x2.value))
  const height = useComputed(() => Math.abs(props.y1.value - props.y2.value))
  console.log('render area selection')
  return props.shown.value ? (
    <rect
      class={'selection-area'}
      data-type={props.type.value}
      x={x}
      y={y}
      width={width}
      height={height}
      rx='1'
      ry='1'
      stroke-width='1'
      pointer-events='none'
    />
  ) : null
}
