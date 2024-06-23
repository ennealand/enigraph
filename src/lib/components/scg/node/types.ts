import { ReadonlySignal, Signal } from '@preact/signals'
import { JSX } from 'preact/jsx-runtime'

type DynamicSygnal<T, Mutability> = Mutability extends 'mutable' ? Signal<T> : ReadonlySignal<T>

export type BaseNodeProps<
  Id extends string | number = string | number,
  NodeType = unknown,
  Mutability extends 'mutable' | 'immutable' = 'immutable',
> = {
  id: Id
  type: DynamicSygnal<NodeType, Mutability>
  label?: DynamicSygnal<string, Mutability>
  x: DynamicSygnal<number, Mutability>
  y: DynamicSygnal<number, Mutability>
  onMouseDown?: (e: JSX.TargetedMouseEvent<SVGGElement>) => void
}
