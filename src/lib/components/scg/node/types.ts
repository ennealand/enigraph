import { ReadonlySignal } from '@preact/signals'

export type BaseNodeProps<Id extends string | number = string | number, NodeType = unknown> = {
  id: Id
  type: ReadonlySignal<NodeType>
  label?: ReadonlySignal<string>
  x: ReadonlySignal<number>
  y: ReadonlySignal<number>
}
