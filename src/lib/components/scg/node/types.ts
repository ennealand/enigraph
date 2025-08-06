import { ReadonlySignal, Signal } from '@preact/signals'

type DynamicSygnal<T, Mutability> = Mutability extends 'mutable' ? Signal<T> : ReadonlySignal<T>

export type BaseNodeProps<
  Id extends string | number = string | number,
  NodeType = unknown,
  Mutability extends 'mutable' | 'immutable' = 'mutable',
> = {
  id: Id
  type: DynamicSygnal<NodeType, Mutability>
  label?: DynamicSygnal<string, Mutability>
  x: DynamicSygnal<number, Mutability>
  y: DynamicSygnal<number, Mutability>
}
