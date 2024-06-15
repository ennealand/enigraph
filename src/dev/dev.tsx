import { EnigraphFactory } from '$lib/graph/factory'
import { withMovable } from '$lib/plugins/movable'
import { ReadonlySignal, signal } from '@preact/signals'
import { render } from 'preact'

const style = signal('background:skyblue')

const Enigraph = new EnigraphFactory()
  .add('node', (props: { id: number; xyz: ReadonlySignal<string> }) => {
    console.log('text is rendered')
    return <text>{props.xyz}</text>
  })
  .plug(withMovable)
  .on('graph:wheel', (ctx, e) => ctx.onwheel(e))
  .plug(() => ({ MyHTMLComponent: () => <div>Three Apples</div> }))
  .on('svg:mouseDown', (_, e) => {
    e.preventDefault()
    style.value = style.value === 'background:pink' ? 'background:skyblue' : 'background:pink'
  })
  .on('graph:mouseUp', (_, e) => {
    e.preventDefault()
    nodes.value[0].xyz.value = nodes.value[0].xyz.value === 'hello' ? 'world' : 'hello'
  })
  .configure(ctx => ({
    svgProps: { style },
    htmlAfter: [ctx.MyHTMLComponent],
  }))
  .create()

const nodes = signal([{ id: 0, xyz: signal('hello') }])

const result = <Enigraph width={signal(400)} height={signal(400)} nodes={nodes} />

render(result, document.getElementById('app')!)
