import { useMemo } from 'preact/hooks'
import style from './grouping.module.css'
import { cl } from '$lib/utils'

type Props = {
  value: Map<string, { x: number; y: number }[]>
  opened: Set<string>
  selected: string | null
  placeholder?: true
  onMouseDown?: (e: MouseEvent, id: string) => void
}

export const BaseGroups = (props: Props) => {
  return (
    <g class={props.placeholder && style.placeholder}>
      {Array.from(props.value).map(([id, nodes]) => (
        <BaseGroup
          key={id}
          id={id}
          nodes={nodes}
          onMouseDown={props.onMouseDown}
          opened={props.opened.has(id)}
          selected={props.selected === id}
        />
      ))}
    </g>
  )
}

type GroupProps = {
  id: string
  nodes: { x: number; y: number }[]
  onMouseDown?: (e: MouseEvent, id: string) => void
  opened: boolean
  selected: boolean
}

const BaseGroup = (props: GroupProps) =>
  useMemo(() => {
    let top = Infinity
    let bottom = -Infinity
    let left = Infinity
    let right = -Infinity
    for (const node of props.nodes) {
      if (node.x > right) right = node.x
      if (node.x < left) left = node.x
      if (node.y < top) top = node.y
      if (node.y > bottom) bottom = node.y
    }
    const P = 30

    return (
      <g onMouseDown={e => props.onMouseDown?.(e, props.id)}>
        <rect
          class={cl(style.group, props.opened && style.opened, props.selected && style.selected)}
          x={left - P}
          y={top - P}
          width={right - left + P * 2}
          height={bottom - top + P * 2}
        />
      </g>
    )
  }, [props.nodes, props.opened, props.selected, props.onMouseDown])
