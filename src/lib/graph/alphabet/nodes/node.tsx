import { NodeType } from '$lib/types'
import type { JSX } from 'preact/jsx-runtime'
import style from './node.module.css'

interface Props {
  type: NodeType
  x: number
  y: number
  label?: string
  noring?: boolean
  mousedown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  mouseup?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  textDoubleClick?: () => void
  highlight?: boolean
}

export const Node = ({ type, x, y, label, noring, mousedown, mouseup, textDoubleClick, highlight }: Props) => {
  return (
    <>
      <g class={`${style.container} ${highlight ? style.highlight : ''}`} onMouseDown={mousedown} onMouseUp={mouseup}>
        {!noring && <circle cx={x} cy={y} r='35' fill='transparent' />}
        <use class={style.node} xlinkHref={`#scg.node.${type}`} x={x} y={y} />
      </g>
      {label && (
        <text x={x + 17} y={y + 21} class={style.text} onDblClick={textDoubleClick}>
          {label}
        </text>
      )}
    </>
  )
}
