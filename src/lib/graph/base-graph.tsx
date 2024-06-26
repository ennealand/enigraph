import { SignalLike, ensureValue } from '$lib/utils'
import { type DeepSignal } from 'deepsignal'
import { Ref } from 'preact'
import { useCallback, useMemo, useRef } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { type Elements, type IEdge, type INode } from '../types'
import { Alphabet } from './alphabet/alphabet'
import { Edge } from './alphabet/edges/edge'
import { Node } from './alphabet/nodes/node'
import style from './graph.module.css'

export interface Props {
  elements: Elements | DeepSignal<Elements>
  width: number
  height: number
  centerX: number
  centerY: number
  children?: JSX.Element | (JSX.Element | null)[]
  before?: JSX.Element
  inner?: JSX.Element
  innerHtml?: JSX.Element
  onMouseDown?: (e: JSX.TargetedMouseEvent<SVGSVGElement>) => void
  onWheel?: (e: JSX.TargetedWheelEvent<SVGSVGElement | HTMLDivElement>) => void
  onMouseEnter?: (e: JSX.TargetedMouseEvent<SVGSVGElement>) => void
  onMouseLeave?: (e: JSX.TargetedMouseEvent<SVGSVGElement>) => void
  onNodeMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>, node: INode, index: number) => void
  onNodeMouseUp?: (e: JSX.TargetedMouseEvent<SVGGElement>, node: INode, index: number) => void
  onEdgeMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>, edge: IEdge, index: number) => void
  onEdgeMouseUp?: (e: JSX.TargetedMouseEvent<SVGGElement>, edge: IEdge, index: number) => void
  onTextDoubleClick?: (node: INode) => void

  /** Set of element ids to highlight */
  highlight?: SignalLike<Set<number>>

  /** Set of element ids that are non-selectable */
  noselect?: SignalLike<Set<number> | boolean>

  /** Set of element ids that have labels disabled */
  nolabels?: SignalLike<Set<number> | true | undefined>

  pref?: Ref<SVGSVGElement>

  movable?: SignalLike<boolean>
  dragging?: SignalLike<boolean>
  selecting?: SignalLike<boolean>

  transform?: SignalLike<{ x: number; y: number; zoom: number; moving: boolean }>
  padding?: number
}

export const useBaseGraph = (width: number, height: number) => {
  const ref = useRef<SVGSVGElement>(null)
  const centerX = width && useMemo(() => width / 2, [width])
  const centerY = height && useMemo(() => height / 2, [height])
  const baseGraphProps = { width, height, centerX, centerY, pref: ref }
  const getInnerPoint = useCallback(
    (x: number, y: number): [number, number] => {
      if (!ref.current) return [0, 0]
      const rect = ref.current.getBoundingClientRect()
      return [x - rect.x - centerX, y - rect.y - centerY]
    },
    [ref.current]
  )
  return { baseGraphProps, ref, getInnerPoint }
}

export const BaseGraph = (props: Props) => {
  const transform = ensureValue(props.transform)
  const noselect = ensureValue(props.noselect)
  const nolabels = ensureValue(props.nolabels)
  return (
    <div
      class={style.graph}
      data-movable={ensureValue(props.movable) ? '' : undefined}
      data-moving={transform?.moving ? '' : undefined}
      data-dragging={ensureValue(props.dragging) ? '' : undefined}
      data-selecting={ensureValue(props.selecting) ? '' : undefined}
    >
      <svg
        ref={props.pref}
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        viewBox={`-${props.centerX} -${props.centerY} ${props.width} ${props.height}`}
        width={`${props.width}px`}
        height={`${props.height}px`}
        onContextMenu={e => (e.preventDefault(), e.stopPropagation())}
        onMouseDown={props.onMouseDown}
        onWheel={props.onWheel} // nonpassive | preventDefault | stopPropagation
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        <Alphabet />

        {props.elements && (
          <g transform={transform && `translate(${transform.x} ${transform.y}) scale(${transform.zoom})`}>
            {/* User-defined inner before-extensions */}
            {props.before}

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
                highlight={ensureValue(props.highlight)?.has(edge.id)}
                noselect={noselect && (noselect === true || noselect.has(edge.id))}
                padding={props.padding}
              />
            ))}

            {/* Map nodes to Node component */}
            {props.elements.nodes.map((node, index) => (
              <Node
                key={node.id}
                type={node.type}
                x={Math.round(node.x) || 0}
                y={Math.round(node.y) || 0}
                label={nolabels && (nolabels === true || nolabels.has(node.id)) ? undefined : node.label}
                mousedown={e => props.onNodeMouseDown?.(e, node, index)}
                mouseup={e => props.onNodeMouseUp?.(e, node, index)}
                highlight={ensureValue(props.highlight)?.has(node.id)}
                noselect={noselect && (noselect === true || noselect.has(node.id))}
                padding={props.padding && props.padding + 1}
                textDoubleClick={() => props.onTextDoubleClick?.(node)}
              />
            ))}

            {/* User-defined inner extensions */}
            {props.inner}
          </g>
        )}

        {/* User-defined extensions */}
        {props.children}
      </svg>
      <div
        class={style.innerHtml}
        style={{
          transform:
            transform && `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom}) translate(50%, 50%)`,
        }}
        onWheel={props.onWheel} // nonpassive | preventDefault | stopPropagation
      >
        {/* User-defined html extensions */}
        {props.innerHtml}
      </div>
    </div>
  )
}
