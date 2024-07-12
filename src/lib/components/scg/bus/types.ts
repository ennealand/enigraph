import { ReadonlySignal, Signal } from '@preact/signals'

type DynamicSygnal<T, Mutability> = Mutability extends 'mutable' ? Signal<T> : ReadonlySignal<T>

export type BaseBusProps<
  Id extends string | number = string | number,
  Mutability extends 'mutable' | 'immutable' = 'immutable',
> = {
  id: Id
  sourceId: Id
  x: DynamicSygnal<number, Mutability>
  y: DynamicSygnal<number, Mutability>
  dx: DynamicSygnal<number, Mutability>
  dy: DynamicSygnal<number, Mutability>
}
