import { useMemo } from 'preact/hooks'
import style from './grouping.module.css'
import { cl } from '$lib/utils'

type Props = {
  id: string
  top: number
  bottom: number
  left: number
  right: number
  onMouseDown?: (e: MouseEvent, id: string) => void
  opened: boolean
  selected: boolean
}

export const BaseGroup = (props: Props) =>
  useMemo(() => {
    const P = 30
    return (
      <g onMouseDown={e => props.onMouseDown?.(e, props.id)}>
        <rect
          class={cl(style.group, props.opened && style.opened, props.selected && style.selected)}
          x={props.left - P}
          y={props.top - P}
          width={props.right - props.left + P * 2}
          height={props.bottom - props.top + P * 2}
        />
      </g>
    )
  }, Object.values(props))
