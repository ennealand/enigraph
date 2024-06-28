import { batch, ReadonlySignal, signal, useComputed } from '@preact/signals'
import { JSX } from 'preact'
import { BaseDiskProps, DiskHandler } from './base-disk'
import { DiskOptions, getOptions } from './options'

type Option<T, P> = {
  types: T[]
  factory: (type: T, deg: number, index: number) => P
  component: (props: P & { type: T | ReadonlySignal<T> }) => JSX.Element
  handler: DiskHandler<T>
}

type Props<Components extends Record<string, DiskComponent<any, any>>> = {
  getInnerPoint: (x: number, y: number) => readonly [number, number]
  diskComponents: Components
}

type DiskContext<T extends string> = {
  showDisk: (name: T, x: number, y: number) => void
  hideDisk: () => void
  diskProps: ReadonlySignal<BaseDiskProps<T, unknown, unknown>>
  isDiskOpened: ReadonlySignal<boolean>
}

export const withDisk = <
  Components extends Record<string, DiskComponent<any, any>>,
  Name extends string = keyof Components & string,
>(
  props: Props<Components>
): DiskContext<Name> => {
  const menu = useComputed(() => ({ x: signal(0), y: signal(0), name: signal<Name | null>(null) }))

  const showDisk = (name: Name, x: number, y: number) => {
    batch(() => {
      menu.value.x.value = x
      menu.value.y.value = y
      menu.value.name.value = name
    })
  }

  const hideDisk = () => {
    if (menu.value.name.value) {
      menu.value.name.value = null
    }
  }

  const diskProps = useComputed(() => {
    return {
      x: menu.value.x,
      y: menu.value.y,
      name: menu.value.name,
      options: menu.value.name.value ? props.diskComponents[menu.value.name.value].options : [],
      component: menu.value.name.value ? props.diskComponents[menu.value.name.value].component : null,
      handler: (...args) => {
        props.diskComponents[menu.value.name.value!].handler(...args)
        hideDisk()
      },
    } satisfies BaseDiskProps<Name, unknown, unknown>
  })

  const isDiskOpened = useComputed(() => !!menu.value.name.value)

  return { showDisk, hideDisk, diskProps, isDiskOpened }
}

type DiskComponent<T, P> = {
  options: DiskOptions<T, P>
  component: (props: P & { type: T | ReadonlySignal<T> }) => JSX.Element
  handler: DiskHandler<T>
}

export const createDiskComponent = <T, P>(options: Option<T, P>): DiskComponent<T, P> => {
  return { component: options.component, options: getOptions(options.types, options.factory), handler: options.handler }
}
