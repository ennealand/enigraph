import { ReadonlySignal } from '@preact/signals'

export type BaseNodeProps<Id, NodeType> = {
  id: Id
  type: ReadonlySignal<NodeType>
  label?: ReadonlySignal<string>
  x: ReadonlySignal<number>
  y: ReadonlySignal<number>
}
