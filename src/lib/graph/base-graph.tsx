import { useComputed, type ReadonlySignal } from '@preact/signals'
import type { Ref } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import './base-graph.css'

type Props = {
  components: {
    name: string
    component: (props: { id: string | number } & Record<string, unknown>) => JSX.Element
    items: ReadonlySignal<({ id: string | number } & Record<string, unknown>)[]>
    events: ReadonlySignal<JSX.HTMLAttributes<Element>>
  }[]
  enigraphProps: ReadonlySignal<JSX.HTMLAttributes<HTMLDivElement>>
  svgProps: ReadonlySignal<JSX.HTMLAttributes<SVGSVGElement>>
  svgRef?: Ref<SVGSVGElement>
  baseRef?: Ref<HTMLDivElement>
  width: ReadonlySignal<number>
  height: ReadonlySignal<number>
  centerX: ReadonlySignal<number>
  centerY: ReadonlySignal<number>
  transform?: ReadonlySignal<{ x: ReadonlySignal<number>; y: ReadonlySignal<number>; zoom: ReadonlySignal<number> }>
  before?: (() => JSX.Element)[]
  after?: (() => JSX.Element)[]
  staticBefore?: (() => JSX.Element)[]
  staticAfter?: (() => JSX.Element)[]
  htmlAfter?: (() => JSX.Element)[]
}

export const List = <Props extends { id: string | number }>({
  Component,
  items,
  events,
  ...props
}: {
  Component: (props: Props) => JSX.Element
  items: ReadonlySignal<Props[]>
  events: ReadonlySignal<JSX.HTMLAttributes<Element>>
} & JSX.HTMLAttributes<SVGGElement>) => {
  console.log('list render')
  return items.value.length ? (
    <g {...props}>
      {items.value.map(item => (
        <Component key={item.id} {...events.value} {...item} />
      ))}
    </g>
  ) : null
}

export const BaseGraph = (props: Props) => {
  console.log('Base enigraph is rendered')
  return (
    <div ref={props.baseRef} class='enigraph' {...props.enigraphProps.value}>
      <svg
        ref={props.svgRef}
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        viewBox={useComputed(() => `-${props.centerX} -${props.centerY} ${props.width} ${props.height}`)}
        width={useComputed(() => `${props.width}px`)}
        height={useComputed(() => `${props.height}px`)}
        {...props.svgProps.value}
      >
        {props.staticBefore?.map(Fn => <Fn />)}
        <g
          transform={useComputed(() =>
            (props.before || props.after || props.components.some(x => x.items.value.length)) && props.transform
              ? `translate(${props.transform.value.x} ${props.transform.value.y}) scale(${props.transform.value.zoom})`
              : undefined
          )}
        >
          {props.before?.map(Fn => <Fn />)}
          {props.components.map(({ name, component, items, events }) => (
            <List key={name} Component={component} items={items} events={events} />
          ))}
          {props.after?.map(Fn => <Fn />)}
        </g>
        {props.staticAfter?.map(Fn => <Fn />)}
      </svg>
      {props.htmlAfter?.length && (
        <div
          class='htmlAfter'
          style={useComputed(
            () =>
              props.transform &&
              `transform:translate(${props.transform.value.x}px, ${props.transform.value.y}px) scale(${props.transform.value.zoom}) translate(50%, 50%)`
          )}
        >
          {props.htmlAfter?.map(Fn => <Fn />)}
        </div>
      )}
    </div>
  )
}
