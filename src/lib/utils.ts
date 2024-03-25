import { ReadonlySignal, Signal } from '@preact/signals'

export type SignalLike<T> = ReadonlySignal<T> | Signal<T> | T
export const ensureValue = <T>(something: SignalLike<T>) => {
  if (something && typeof something === 'object' && 'value' in something) {
    return something.value
  }
  return something
}
