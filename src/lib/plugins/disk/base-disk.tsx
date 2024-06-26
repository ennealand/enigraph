import { JSX } from 'preact/jsx-runtime'
import { DiskOptions } from './options'
import './disk.css'
import { ReadonlySignal } from '@preact/signals'

export type BaseDiskProps<Name, Type, Props> = {
  shown: ReadonlySignal<boolean>
  x: ReadonlySignal<number>
  y: ReadonlySignal<number>
  options: ReadonlySignal<DiskOptions<Type, Props>>
  component: (props: Props & { type: Type }) => JSX.Element
  name: Name
  click: (
    type: Name,
    x: ReadonlySignal<number>,
    y: ReadonlySignal<number>,
    e: JSX.TargetedMouseEvent<SVGGElement>,
    value: Type
  ) => void
}

export const BaseDisk = <Name extends string, Type extends unknown, Props>(props: BaseDiskProps<Name, Type, Props>) => (
  <g transform={`translate(${props.x} ${props.y})`}>
    <g class='disk'>
      {props.options.value.map(({ type, x1, y1, x2, y2, textX, textY, componentProps }, index) => (
        <g
          key={type}
          onMouseDown={e => e.stopPropagation()}
          onMouseUp={e => props.click(props.name, props.x, props.y, e, type)}
        >
          <path d={`M ${x1} ${y1} A 70 70 0 0 1 ${x2} ${y2}`} stroke-width='90' />
          <text x={textX} y={textY} stroke-width='90'>
            {index + 1}
          </text>
          <props.component type={type} {...componentProps} />
        </g>
      ))}
    </g>
  </g>
)
