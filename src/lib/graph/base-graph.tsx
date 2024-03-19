import { type DeepSignal } from 'deepsignal'
import { useMemo } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { type Elements, type IEdge, type INode } from '../types'
import { Edge } from './alphabet/edges/edge'
import { Alphabet } from './alphabet/nodes/alphabet'
import { Node } from './alphabet/nodes/node'
import style from './graph.module.css'

export interface Props {
  elements: Elements | DeepSignal<Elements>
  width: number
  height: number
  children: JSX.Element | JSX.Element[]
  areaSelection?: { x1: number; y1: number; x2: number; y2: number }
  onMouseDown?: (e: JSX.TargetedMouseEvent<SVGSVGElement>) => void
  onWheel?: (e: JSX.TargetedWheelEvent<SVGSVGElement>) => void
  onMouseEnter?: (e: JSX.TargetedMouseEvent<SVGSVGElement>) => void
  onMouseLeave?: (e: JSX.TargetedMouseEvent<SVGSVGElement>) => void
  onNodeMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>, node: INode, index: number) => void
  onNodeMouseUp?: (e: JSX.TargetedMouseEvent<SVGGElement>, node: INode, index: number) => void
  onEdgeMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>, edge: IEdge, index: number) => void
  onEdgeMouseUp?: (e: JSX.TargetedMouseEvent<SVGGElement>, edge: IEdge, index: number) => void

  /** Set of element ids to highlight */
  highlight?: Set<string>

  /** Set of element ids that are non-selectable */
  noselect?: Set<string>

  movable?: true
  moving?: true
  dragging?: true
  selecting?: true

  transform?: { x: 0; y: 0; zoom: 1 }
}

export const BaseGraph = (props: Props) => {
  const centerX = useMemo(() => props.width / 2, [props.width])
  const centerY = useMemo(() => props.height / 2, [props.height])

  return (
    <div
      class={style.graph}
      data-movable={props.movable ? '' : undefined}
      data-moving={props.moving ? '' : undefined}
      data-dragging={props.dragging ? '' : undefined}
      data-selecting={props.selecting ? '' : undefined}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        viewBox={`-${centerX} -${centerY} ${props.width} ${props.height}`}
        width={`${props.width}px`}
        height={`${props.height}px`}
        onContextMenu={e => e.preventDefault()}
        onMouseDown={props.onMouseDown}
        onWheel={props.onWheel} // nonpassive | preventDefault | stopPropagation
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        <Alphabet />

        {props.elements && (
          <g
            transform={
              props.transform && `translate(${props.transform.x} ${props.transform.y}) scale(${props.transform.zoom})`
            }
          >
            {/* Map edges to Edge component */}
            {props.elements.edges.map((edge, index) => (
              <Edge
                key={edge.id}
                type={edge.type}
                x1={edge.source.x}
                y1={edge.source.y}
                x2={edge.target.x}
                y2={edge.target.y}
                mousedown={e => props.onEdgeMouseDown?.(e, edge, index)}
                mouseup={e => props.onEdgeMouseUp?.(e, edge, index)}
                noselect={props.noselect?.has(edge.id)}
              />
            ))}

            {/* Map nodes to Node component */}
            {props.elements.nodes.map((node, index) => (
              <Node
                key={node.id}
                type={node.type}
                x={node.x ?? 0}
                y={node.y ?? 0}
                label={node.label}
                mousedown={e => props.onNodeMouseDown?.(e, node, index)}
                mouseup={e => props.onNodeMouseUp?.(e, node, index)}
                highlight={props.highlight?.has(node.id)}
              />
            ))}

            {/* Area selection rectangle */}
            {props.areaSelection && (
              <rect
                x={Math.min(props.areaSelection.x1, props.areaSelection.x2)}
                y={Math.min(props.areaSelection.y1, props.areaSelection.y2)}
                width={Math.abs(props.areaSelection.x1 - props.areaSelection.x2)}
                height={Math.abs(props.areaSelection.y1 - props.areaSelection.y2)}
                rx='1'
                ry='1'
                stroke-width='1'
                fill='#0048b61a'
                stroke='#2669cf'
                pointer-events='none'
              />
            )}
          </g>
        )}

        {/* User-defined extensions */}
        {props.children}
      </svg>
    </div>
  )
}
