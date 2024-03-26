import { NodeType } from '$lib/types'
import type { JSX } from 'preact/jsx-runtime'
import style from './node.module.css'
import { cl } from '$lib/utils'

interface Props {
  type: NodeType
  x: number
  y: number
  label?: string
  mousedown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  mouseup?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  textDoubleClick?: () => void
  highlight?: boolean
  padding?: number
  noselect?: boolean
}

export const Node = ({
  type,
  noselect,
  x,
  y,
  label,
  mousedown,
  mouseup,
  textDoubleClick,
  highlight,
  padding,
}: Props) => {
  return (
    <g>
      <g
        class={cl(style.container, noselect && style.noselect, highlight && style.highlight)}
        onMouseDown={mousedown}
        onMouseUp={mouseup}
      >
        {padding && <circle cx={x} cy={y} r={padding} fill='transparent' />}
        <use class={style.node} xlinkHref={`#scg.node.${type}`} x={x} y={y} />
      </g>
      {label && (
        <text x={x + 17} y={y + 21} class={style.text} onDblClick={textDoubleClick}>
          {label}
        </text>
      )}
    </g>
  )
}
