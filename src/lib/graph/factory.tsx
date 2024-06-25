import { type ReadonlySignal, useComputed, useSignal } from '@preact/signals'
import { type JSX, render } from 'preact'
import { type Ref, useEffect, useRef } from 'preact/hooks'
import { BaseGraph } from './base-graph'

type Events = EventValues<'graph', JSX.HTMLAttributes<HTMLDivElement>> &
  EventValues<'svg', JSX.HTMLAttributes<SVGSVGElement>> &
  EventValues<'global', JSX.HTMLAttributes<Document>>

type CustomEvents<Components extends Record<string, { id: string | number }>> = keyof Components extends string
  ? {
      [Name in keyof Components]: EventValues<Name, Components[Name]>
    }[keyof Components]
  : never

type EventValues<Base extends string, T extends Record<any, any>> = {
  [K in keyof T as K extends `on${infer E}` ? `${Base}:${Uncapitalize<E>}` : never]-?: T[K]
}

type InitialContext = {
  width: ReadonlySignal<number>
  height: ReadonlySignal<number>
  centerX: ReadonlySignal<number>
  centerY: ReadonlySignal<number>
  getInnerPoint: (x: number, y: number) => [number, number]
  ref: Ref<HTMLDivElement>
}

type PropertiesOnly<T> = { [K in keyof T as K extends `on${string}` ? never : K]?: T[K] }
type Config = {
  before?: (() => JSX.Element)[]
  after?: (() => JSX.Element)[]
  staticBefore?: (() => JSX.Element)[]
  staticAfter?: (() => JSX.Element)[]
  htmlAfter?: (() => JSX.Element)[]
  enigraphProps?: PropertiesOnly<JSX.HTMLAttributes<HTMLDivElement>>
  svgProps?: PropertiesOnly<JSX.HTMLAttributes<SVGSVGElement>>
}

export class EnigraphFactory<
  Context extends Record<string, unknown> = Record<never, never>,
  Components extends Record<string, { id: string | number }> = Record<never, never>,
> {
  constructor() {}

  #components = {} as { [Name in keyof Components]: (props: Components[Name]) => JSX.Element }
  #plugins: ((ctx: Context & InitialContext) => Record<string, unknown>)[] = []
  #events = new Map<string, (ctx: Context & InitialContext, e: any) => void>()
  #config?: (ctx: Context & InitialContext) => Config

  add<Name extends string, ComponentProps extends { id: string | number }>(
    name: Name,
    component: (props: ComponentProps) => JSX.Element
  ) {
    ;(this.#components as Record<Name, unknown>)[name] = component
    return this as unknown as EnigraphFactory<
      Context & Record<`${Name}s`, ReadonlySignal<ComponentProps[]>>,
      Components & Record<Name, ComponentProps>
    >
  }

  plug<Exports extends Record<string, unknown>>(plugin: (ctx: Context & InitialContext) => Exports) {
    this.#plugins.push(plugin)
    return this as EnigraphFactory<{ [k in keyof (Context & Exports)]: (Context & Exports)[k] }, Components>
  }

  on<T extends string & keyof (Events & CustomEvents<Components>)>(
    event: T,
    fn: (
      ctx: Context & InitialContext,
      e: T extends keyof Events
        ? Parameters<Events[T]>[0]
        : T extends keyof CustomEvents<Components>
          ? CustomEvents<Components>[T] extends (...args: infer Args) => any
            ? Args[0]
            : never
          : never
    ) => void
  ) {
    this.#events.set(event, fn)
    return this
  }

  configure(config: (ctx: Context & InitialContext) => Config) {
    this.#config = config
    return this
  }

  #getEventProps = <E extends Element>(
    ctx: Context & InitialContext,
    prefix: string,
    base: JSX.HTMLAttributes<E> = {}
  ) =>
    useComputed(
      (): JSX.HTMLAttributes<E> =>
        Array.from(this.#events.entries()).reduce(
          (a, [event, fn]) => (
            event.includes(prefix + ':') &&
              (a[
                (prefix === 'global'
                  ? event.slice(prefix.length + 1).toLowerCase()
                  : 'on' + event[prefix.length + 1].toUpperCase() + event.slice(prefix.length + 2)) as keyof typeof a
              ] = (e: Parameters<Events[keyof Events]>[0]) => fn(ctx, e)),
            a
          ),
          base
        )
    )

  create() {
    type Props = { width?: ReadonlySignal<number>; height?: ReadonlySignal<number> } & {
      [Name in keyof Components as Name extends string ? `${Name}s` : never]: ReadonlySignal<Components[Name][]>
    }
    const Enigraph = (props: Props) => {
      const width = props.width ?? useSignal(500)
      const height = props.height ?? useSignal(500)

      const baseRef = useRef<HTMLDivElement>(null)
      const svgRef = useRef<SVGSVGElement>(null)

      const centerX = useComputed(() => width.value / 2)
      const centerY = useComputed(() => height.value / 2)
      const getInnerPoint = (x: number, y: number): [number, number] => {
        if (!svgRef.current) return [0, 0]
        const rect = svgRef.current.getBoundingClientRect()
        return [x - rect.x - centerX.value, y - rect.y - centerY.value]
      }

      let ctx = { width, height, centerX, centerY, getInnerPoint, ref: baseRef } as Context & InitialContext

      for (const name of Object.keys(this.#components)) {
        const items = (props as Record<string, unknown>)[name + 's']
        if (!items) throw new Error(`Missing '${name}s' prop`)
        ;(ctx as Record<string, unknown>)[name + 's'] = items
      }

      for (const plugin of this.#plugins) {
        ctx = { ...ctx, ...plugin(ctx) }
      }

      const components = Object.entries(this.#components).map(([name, component]) => {
        const items = (ctx as Record<string, unknown>)[name + 's']
        return { name, component, items } as {
          name: string
          component: (props: { id: string | number } & Record<string, unknown>) => JSX.Element
          items: ReadonlySignal<({ id: string | number } & Record<string, unknown>)[]>
          events: ReadonlySignal<JSX.HTMLAttributes<Element>>
        }
      })

      const { enigraphProps: baseEnigraphProps, svgProps: baseSvgProps, ...config } = this.#config?.(ctx) ?? {}
      const enigraphProps = this.#getEventProps<HTMLDivElement>(ctx, 'graph', baseEnigraphProps)
      const svgProps = this.#getEventProps<SVGSVGElement>(ctx, 'svg', baseSvgProps)
      const globalProps = this.#getEventProps<SVGSVGElement>(ctx, 'global')

      components.forEach(component => (component.events = this.#getEventProps(ctx, component.name)))

      useEffect(() => {
        for (const [event, handler] of Object.entries(globalProps.value)) {
          document.addEventListener(event, handler)
        }
        return () => {
          for (const [event, handler] of Object.entries(globalProps.value)) {
            document.removeEventListener(event, handler)
          }
        }
      }, [globalProps.value])

      console.log('enigraph is rendered')

      const data = {
        components,
        width,
        height,
        centerX,
        centerY,
        enigraphProps,
        svgProps,
        transform: ctx.transform as never,
      }
      return <BaseGraph baseRef={baseRef} svgRef={svgRef} {...data} {...config} />
    }
    Enigraph.mount = (selector: string, props: Props) =>
      render(<Enigraph {...props} />, document.querySelector(selector)!)
    return Enigraph
  }
}

export type ComponentNames<Factory extends EnigraphFactory<any, any>> =
  Factory extends EnigraphFactory<any, infer Components> ? keyof Components : never

export type ComponentProps<Factory extends EnigraphFactory<any, any>, Name extends ComponentNames<Factory>> =
  Factory extends EnigraphFactory<any, infer Components> ? Components[Name] : never
