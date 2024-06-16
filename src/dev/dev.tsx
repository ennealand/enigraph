import { Alphabet } from '$lib/components/scg/alphabet'
import { BasicNodeProps, Node } from '$lib/components/scg/node'
import { ComponentProps, EnigraphFactory } from '$lib/graph/factory'
import { withMovable } from '$lib/plugins/movable'
import { signal } from '@preact/signals'
import { render } from 'preact'

const style = signal('background:skyblue')

const nodePadding = signal(10)
const nodeSize = signal(10)

const factory = new EnigraphFactory()
  .add('node', (props: BasicNodeProps) => <Node {...props} padding={nodePadding} />)
  .plug(withMovable)
  .on('graph:wheel', (ctx, e) => ctx.onwheel(e))
  .configure(_ctx => ({ svgProps: { style }, staticBefore: [() => <Alphabet size={nodeSize} />] }))

const Enigraph = factory.create()
const nodes = signal<ComponentProps<typeof factory, 'node'>[]>([
  { id: 0, type: signal('const-tuple'), x: signal(0), y: signal(0), label: signal('hello') },
  { id: 1, type: signal('var-norole'), x: signal(70), y: signal(50), label: signal('world') },
])

const result = <Enigraph width={signal(400)} height={signal(400)} nodes={nodes} />

render(result, document.getElementById('app')!)
