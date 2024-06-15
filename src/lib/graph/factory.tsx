import { type ReadonlySignal, useComputed } from '@preact/signals'
import { type JSX, render } from 'preact'
import { useRef } from 'preact/hooks'
import { BaseGraph } from './base-graph'

// type GraphPlugin<Exports extends Record<string, any>> = Exports
type Events = {
  [K in keyof JSX.HTMLAttributes<HTMLDivElement> as K extends `on${infer E}`
    ? `graph:${Uncapitalize<E>}`
    : never]-?: JSX.HTMLAttributes<HTMLDivElement>[K]
} & {
  [K in keyof JSX.HTMLAttributes<SVGSVGElement> as K extends `on${infer E}`
    ? `svg:${Uncapitalize<E>}`
    : never]-?: JSX.HTMLAttributes<SVGSVGElement>[K]
}

type InitialContext = { width: number; height: number; getInnerPoint: (x: number, y: number) => [number, number] }

export class EnigraphFactory<
  Context extends Record<string, unknown> = InitialContext,
  Components extends Record<string, { id: string | number }> = Record<never, never>,
> {
  constructor() {}

  #components = {} as { [Name in keyof Components]: (props: Components[Name]) => JSX.Element }
  #plugins: ((ctx: Context) => Record<string, unknown>)[] = []
  #events = new Map<keyof Events, (ctx: Context, e: Parameters<Events[keyof Events]>[0]) => void>()

  add<Name extends string, ComponentProps extends { id: string | number }>(
    name: Name,
    component: (props: ComponentProps) => JSX.Element
  ) {
    ;(this.#components as Record<Name, unknown>)[name] = component
    return this as unknown as EnigraphFactory<Context, Components & Record<Name, ComponentProps>>
  }

  plug<Exports extends Record<string, unknown>>(plugin: (ctx: Context) => Exports) {
    this.#plugins.push(plugin)
    return this as EnigraphFactory<{ [k in keyof (Context & Exports)]: (Context & Exports)[k] }, Components>
  }

  on<T extends keyof Events>(event: T, fn: (ctx: Context, e: Parameters<Events[T]>[0]) => void) {
    this.#events.set(event, fn)
    return this
  }

  #getEventProps = <E extends Element>(ctx: Context, prefix: keyof Events extends `${infer P}:${string}` ? P : never) =>
    useComputed(
      (): JSX.HTMLAttributes<E> =>
        Array.from(this.#events.entries()).reduce(
          (a, [event, fn]) => (
            event.includes(prefix + ':') &&
              (a[('on' + event[prefix.length + 1].toUpperCase() + event.slice(prefix.length + 2)) as keyof typeof a] = (
                e: Parameters<Events[keyof Events]>[0]
              ) => fn(ctx, e)),
            a
          ),
          {} as JSX.HTMLAttributes<E>
        )
    )

  create() {
    type Props = {
      [Name in keyof Components as Name extends string ? `${Name}s` : never]: ReadonlySignal<Components[Name][]>
    } & { width: ReadonlySignal<number>; height: ReadonlySignal<number> } // Allow to override using plugins?
    const Enigraph = ({ width, height, ...props }: Props) => {
      const ref = useRef<SVGSVGElement>(null)

      const components = Object.entries(this.#components).map(([name, component]) => {
        const items = (props as Record<string, unknown>)[name + 's']
        if (!items) throw new Error(`Missing '${name}s' prop`)
        return { name, component, items } as {
          name: string
          component: (props: { id: string | number } & Record<string, unknown>) => JSX.Element
          items: ReadonlySignal<({ id: string | number } & Record<string, unknown>)[]>
        }
      })

      const centerX = useComputed(() => width.value / 2)
      const centerY = useComputed(() => height.value / 2)
      const getInnerPoint = (x: number, y: number): [number, number] => {
        if (!ref.current) return [0, 0]
        const rect = ref.current.getBoundingClientRect()
        return [x - rect.x - centerX.value, y - rect.y - centerY.value]
      }

      const context = { width, height, getInnerPoint } as unknown as Context
      for (const plugin of this.#plugins) {
        Object.assign(context, plugin(context))
      }

      const enigraphProps = this.#getEventProps<HTMLDivElement>(context, 'graph')
      const svgProps = this.#getEventProps<SVGSVGElement>(context, 'svg')

      const data = { components, width, height, centerX, centerY, enigraphProps, svgProps }
      return <BaseGraph pref={ref} {...data} />
    }
    Enigraph.mount = (selector: string, props: Props) =>
      render(<Enigraph {...props} />, document.querySelector(selector)!)
    return Enigraph
  }
}
