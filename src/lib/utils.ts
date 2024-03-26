import { ReadonlySignal, Signal } from '@preact/signals'

export type SignalLike<T> = ReadonlySignal<T> | Signal<T> | T
export const ensureValue = <T>(something: SignalLike<T>) => {
  if (something && typeof something === 'object' && 'value' in something) {
    return something.value
  }
  return something
}

export const cl = (...args: (string | false | undefined | null | Record<string, unknown>)[]) => {
  let classlist = ''
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'string') classlist += classlist ? ' ' + arg : arg
    else if (typeof arg === 'object') {
      for (const key in arg) {
        if ({}.hasOwnProperty.call(arg, key) && arg[key]) {
          classlist += classlist ? ' ' + key : key
        }
      }
    }
  }
  return classlist
}
