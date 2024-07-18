import { ReadonlySignal, Signal } from '@preact/signals'

export type DynamicSygnal<T, Mutability> = Mutability extends 'mutable' ? Signal<T> : ReadonlySignal<T>

export type BaseEdgeProps<
  Id extends string | number = string | number,
  EdgeType = unknown,
  Mutability extends 'mutable' | 'immutable' = 'immutable',
> = {
  id: Id
  type: DynamicSygnal<EdgeType, Mutability>
  x1: DynamicSygnal<number, Mutability>
  y1: DynamicSygnal<number, Mutability>
  x2: DynamicSygnal<number, Mutability>
  y2: DynamicSygnal<number, Mutability>
  sourceRadius?: DynamicSygnal<number, Mutability>
  targetRadius?: DynamicSygnal<number, Mutability>
}
