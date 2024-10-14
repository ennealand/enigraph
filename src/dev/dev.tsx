import { computed, signal } from '@preact/signals'
import { render } from 'preact'
import { DemoComponentProps, EnigraphDemo } from './graph-demo'
import './style.css'
import { getContentRadius } from '$lib/components/scg/content'

const GR = 1
const GW = 1000
const GH = 600

const N = 10
const E = 20
const B = 1
const C = 2
const G = 3

const label = signal('')
const nodes = signal<DemoComponentProps<'node'>>(
  Array.from({ length: N }, (_, i) => ({
    id: i + 1,
    type: signal('const-tuple'),
    x: signal(Math.round(Math.random() * GW * GR) - (GW * GR) / 2),
    y: signal(Math.round(Math.random() * GH * GR) - (GH * GR) / 2),
    label,
  }))
)

const buses = signal<DemoComponentProps<'bus'>>([])
Array.from({ length: B }, (_, i) => {
  const n1 = nodes.value[Math.trunc(Math.random() * N)]
  buses.value.push({
    id: N ** 2 + i + 1,
    sourceId: n1.id,
    x: n1.x,
    y: n1.y,
    dx: signal(Math.round(Math.random() * GW * GR) - (GW * GR) / 2),
    dy: signal(Math.round(Math.random() * GH * GR) - (GH * GR) / 2),
  })
})

const contents = signal<DemoComponentProps<'content'>>([])
Array.from({ length: C }, (_, i) => {
  const { type, value } =
    Math.random() > 0.5
      ? {
          type: 'image' as const,
          value:
            'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?cs=srgb&dl=pexels-8moments-1266810.jpg&fm=jpg',
        }
      : { type: 'text' as const, value: 'Ipsum loremsum ipsum loremsum' }
  contents.value.push({
    id: N ** 2 + B ** 2 + i + 1,
    type: signal(type),
    value: signal(value),
    x: signal(Math.round(Math.random() * GW * GR) - (GW * GR) / 2),
    y: signal(Math.round(Math.random() * GH * GR) - (GH * GR) / 2),
    dx: signal(200),
    dy: signal(200),
  })
})

const edges = signal<DemoComponentProps<'edge'>>([])
Array.from({ length: E }, (_, i) => {
  const n1 = nodes.value[Math.trunc(Math.random() * N)]
  const isNode = true || !i || Math.random() > 0.7
  const e2 = isNode
    ? nodes.value[Math.trunc(Math.random() * N)]
    : contents.value[Math.trunc(((Math.random() * i) / N) * C)]
  if (!e2) return
  edges.value.push({
    id: N ** 2 + B ** 2 + C ** 2 + i + 1,
    type: signal('const-tuple'),
    x1: n1.x,
    y1: n1.y,
    x2: 'dx' in e2 ? computed(() => e2.x.value + e2.dx.value / 2 + 3.2) : e2.x,
    y2: 'dy' in e2 ? computed(() => e2.y.value + e2.dy.value / 2 + 3.2) : e2.y,
    sourceRadius: computed(() => 25),
    targetRadius: computed(() => {
      if (!('dx' in e2)) return 25
      return getContentRadius(e2, n1.x, n1.y, 15)
    }),
    sourceId: n1.id,
    targetId: e2.id,
  })
})

const groups = signal<DemoComponentProps<'group'>>([])
Array.from({ length: G }, (_, i) => {
  const x1 = Math.round(Math.random() * GW * GR) - (GW * GR) / 2
  const y1 = Math.round(Math.random() * GH * GR) - (GH * GR) / 2
  const x2 = Math.round(Math.random() * GW * GR) - (GW * GR) / 2
  const y2 = Math.round(Math.random() * GH * GR) - (GH * GR) / 2
  groups.value.push({
    id: N ** 2 + B ** 2 + C ** 2 + E ** 2 + i + 1,
    x: signal(Math.min(x1, x2)),
    y: signal(Math.min(y1, y2)),
    dx: signal(600),
    dy: signal(400),
  })
})

const App = () => {
  return (
    <div class='playground'>
      <div class='header'>
        <h2>Playground</h2>
        <button>Clear</button>
      </div>
      <EnigraphDemo nodes={nodes} edges={edges} buses={buses} contents={contents} groups={groups} />
    </div>
  )
}

render(<App />, document.getElementById('app')!)
