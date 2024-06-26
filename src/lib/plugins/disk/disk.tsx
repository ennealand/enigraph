import { ReadonlySignal } from '@preact/signals'
import { JSX } from 'preact'
import { DiskOptions, getOptions } from './options'

type Option<T, P> = {
  types: T[]
  factory: (type: T, deg: number, index: number) => P
  component: (props: P & { type: T | ReadonlySignal<T> }) => JSX.Element
}

type Props<Components extends Record<string, DiskOptions<any, any>>> = {
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  diskComponents: Components
}

type DiskContext = {}

export const withDisk = <Components extends Record<string, DiskOptions<any, any>>>(
  props: Props<Components>
): DiskContext => {
  props
  return {}
}

export const createDiskComponent = <T, P>(options: Option<T, P>): DiskOptions<T, P> => {
  return getOptions(options.types, options.factory)
}
