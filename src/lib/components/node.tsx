import { ReadonlySignal } from '@preact/signals'
import { JSX } from 'preact'

export type BaseNodeProps<Id, NodeType> = {
  id: Id
  type: ReadonlySignal<NodeType>
  label?: ReadonlySignal<string>
  x: ReadonlySignal<number>
  y: ReadonlySignal<number>
}

export type BaseNodeElement = <Id, NodeType, NodeProps extends BaseNodeProps<Id, NodeType>>(
  props: NodeProps
) => JSX.Element
