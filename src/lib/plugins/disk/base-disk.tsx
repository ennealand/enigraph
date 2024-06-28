import { ReadonlySignal, useComputed } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'
import './disk.css'
import { DiskOptions } from './options'

export type DiskHandler<Type> = (
  type: Type,
  x: ReadonlySignal<number>,
  y: ReadonlySignal<number>,
  e: JSX.TargetedMouseEvent<SVGGElement>
) => void

export type BaseDiskProps<Name, Type, Props> = {
  x: ReadonlySignal<number>
  y: ReadonlySignal<number>
  name: ReadonlySignal<Name | null>
  options: DiskOptions<Type, Props>
  component: ((props: Props & { type: Type }) => JSX.Element) | null
  handler: DiskHandler<Type> | null
}

export const BaseDisk = <Name extends string, Type extends unknown, Props>(props: BaseDiskProps<Name, Type, Props>) => {
  console.log('render disk')
  return (
    props.name.value && (
      <g transform={useComputed(() => `translate(${props.x} ${props.y})`)}>
        <g class='disk'>
          {props.options.map(({ type, x1, y1, x2, y2, textX, textY, componentProps }, index) => (
            <g
              key={type}
              onMouseDown={e => e.stopPropagation()}
              onMouseUp={e => props.handler!(type, props.x, props.y, e)}
            >
              <path d={`M ${x1} ${y1} A 70 70 0 0 1 ${x2} ${y2}`} stroke-width='90' />
              <text x={textX} y={textY} stroke-width='90'>
                {index + 1}
              </text>
              {props.component && <props.component type={type} {...componentProps} />}
            </g>
          ))}
        </g>
      </g>
    )
  )
}
