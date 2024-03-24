import { Edge, Node } from '$lib/graph/alphabet'
import { JSX } from 'preact/jsx-runtime'
import style from './disk.module.css'
import type { DiskEdgeOptions, DiskNodeOptions } from './options'
import { EdgeType, NodeType } from '$lib/types'

type BaseDiskProps = {
  x: number
  y: number
  edgeOptions: DiskEdgeOptions
  nodeOptions: DiskNodeOptions
} & (
  | {
      type: 'node'
      click: (type: 'node', x: number, y: number, e: JSX.TargetedMouseEvent<SVGGElement>, value: NodeType) => void
    }
  | {
      type: 'edge'
      click: (type: 'edge', x: number, y: number, e: JSX.TargetedMouseEvent<SVGGElement>, value: EdgeType) => void
    }
)
export const BaseDisk = (props: BaseDiskProps) => (
  <g transform={`translate(${props.x} ${props.y})`}>
    <g class={style.disk}>
      {props.type === 'node'
        ? props.nodeOptions.map(({ type, x1, y1, x2, y2, textX, textY, nodeX, nodeY }, index) => (
            <g key={type} onMouseUp={e => props.click(props.type, props.x, props.y, e, type)}>
              <path d={`M ${x1} ${y1} A 70 70 0 0 1 ${x2} ${y2}`} stroke-width='90' />
              <text x={textX} y={textY} stroke-width='90'>
                {index + 1}
              </text>
              <Node x={nodeX} y={nodeY} type={type} />
            </g>
          ))
        : props.edgeOptions.map(({ type, x1, y1, x2, y2, textX, textY, edgeX1, edgeY1, edgeX2, edgeY2 }, index) => (
            <g key={type} onMouseUp={e => props.click(props.type, props.x, props.y, e, type)}>
              <path d={`M ${x1} ${y1} A 70 70 0 0 1 ${x2} ${y2}`} stroke-width='90' />
              <text x={textX} y={textY} stroke-width='90'>
                {index + 1}
              </text>
              <Edge x1={edgeX1} y1={edgeY1} x2={edgeX2} y2={edgeY2} type={type} noselect />
            </g>
          ))}
    </g>
  </g>
)
