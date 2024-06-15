import { ReadonlySignal } from '@preact/signals'
import { JSX } from 'preact'

export type BaseEdgeProps<Id, EdgeType> = {
  id: Id
  type: ReadonlySignal<EdgeType>
  x1: ReadonlySignal<number>
  y1: ReadonlySignal<number>
  x2: ReadonlySignal<number>
  y2: ReadonlySignal<number>
}

export type BaseEdgeElement = <Id, EdgeType, EdgeProps extends BaseEdgeProps<Id, EdgeType>>(
  props: EdgeProps
) => JSX.Element
