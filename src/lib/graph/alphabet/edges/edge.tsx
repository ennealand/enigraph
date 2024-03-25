import { EdgeType } from '$lib/types'
import { JSX } from 'preact/jsx-runtime'
import { ArcConst } from './alphabet/ArcConst'
import { ArcConstPermNegAccess } from './alphabet/ArcConstPermNegAccess'
import { ArcConstPermPosAccess } from './alphabet/ArcConstPermPosAccess'
import { EdgeConst } from './alphabet/EdgeConst'
import { ArcConstPermFuzAccess } from './alphabet/_ArcConstPermFuzAccess'
import style from './edge.module.css'

const EDGE_TYPES = {
  [EdgeType.EdgeConst]: EdgeConst,
  [EdgeType.ArcConst]: ArcConst,
  [EdgeType.ArcConstPermPosAccess]: ArcConstPermPosAccess,
  [EdgeType.ArcConstPermNegAccess]: ArcConstPermNegAccess,
  [EdgeType.ArcConstPermFuzAccess]: ArcConstPermFuzAccess,
}

interface Props {
  type: EdgeType
  x1: number
  y1: number
  x2: number
  y2: number
  mousedown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  mouseup?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  highlight?: boolean
  padding?: number
  noselect?: boolean
}

export const Edge = ({ type, noselect, x1 = 0, y1 = 0, x2 = 0, y2 = 0, mousedown, mouseup, highlight, padding = 0 }: Props) => {
  const MyEdge = EDGE_TYPES[type]
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  const dx = length && ((x2 - x1) / length) * padding
  const dy = length && ((y2 - y1) / length) * padding

  return (
    <g class={`${style.container} ${noselect ? style.noselect : ''} ${highlight ? style.highlight : ''}`} onMouseDown={mousedown} onMouseUp={mouseup}>
      <path d={`M ${x1 + dx} ${y1 + dy} L ${x2 - dx} ${y2 - dy}`} stroke-width='15' stroke='transparent' />
      <MyEdge x1={x1 + dx} y1={y1 + dy} x2={x2 - dx} y2={y2 - dy} />
    </g>
  )
}
