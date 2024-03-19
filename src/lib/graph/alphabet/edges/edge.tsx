import { EdgeType } from '$lib/types'
import { JSX } from 'preact/jsx-runtime'
import { EdgeCommon } from './edge-common'
import styles from './edge.module.css'

const EDGE_TYPES = {
  [EdgeType.UCommon]: EdgeCommon,
  [EdgeType.DCommon]: EdgeCommon,
  [EdgeType.UCommonConst]: EdgeCommon,
  [EdgeType.DCommonConst]: EdgeCommon,
  [EdgeType.UCommonVar]: EdgeCommon,
  [EdgeType.DCommonVar]: EdgeCommon,
  [EdgeType.Access]: EdgeCommon,
  [EdgeType.AccessConstPosPerm]: EdgeCommon,
  [EdgeType.AccessConstNegPerm]: EdgeCommon,
  [EdgeType.AccessConstFuzPerm]: EdgeCommon,
  [EdgeType.AccessConstPosTemp]: EdgeCommon,
  [EdgeType.AccessConstNegTemp]: EdgeCommon,
  [EdgeType.AccessConstFuzTemp]: EdgeCommon,
  [EdgeType.AccessVarPosPerm]: EdgeCommon,
  [EdgeType.AccessVarNegPerm]: EdgeCommon,
  [EdgeType.AccessVarFuzPerm]: EdgeCommon,
  [EdgeType.AccessVarPosTemp]: EdgeCommon,
  [EdgeType.AccessVarNegTemp]: EdgeCommon,
  [EdgeType.AccessVarFuzTemp]: EdgeCommon,
}

interface Props {
  type: EdgeType
  noselect?: boolean
  x1: number
  y1: number
  x2: number
  y2: number
  mousedown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
  mouseup?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
}

export const Edge = ({ type, noselect = false, x1 = 0, y1 = 0, x2 = 0, y2 = 0, mousedown, mouseup }: Props) => {
  const MyEdge = EDGE_TYPES[type]

  return (
    <g class={`${styles.container} ${noselect ? styles.noselect : ''}`} onMouseDown={mousedown} onMouseUp={mouseup}>
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke-width='35' stroke='transparent' />
      <MyEdge x1={x1} y1={y1} x2={x2} y2={y2} noselect={noselect} />
    </g>
  )
}
