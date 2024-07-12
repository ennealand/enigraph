import { computed, signal } from '@preact/signals'
import { render } from 'preact'
import { DemoComponentProps, EnigraphDemo } from './graph-demo'
import './style.css'

const N = 10
const E = 12
const B = 6

const label = signal('bye')
const nodes = signal<DemoComponentProps<'node'>>(
  Array.from({ length: N }, (_, i) => ({
    id: i + 1,
    type: signal('const-tuple'),
    x: signal(Math.round(Math.random() * 1000) - 500),
    y: signal(Math.round(Math.random() * 600) - 300),
    label,
  }))
)

const edges = signal<DemoComponentProps<'edge'>>([])
Array.from({ length: E }, (_, i) => {
  const n1 = nodes.value[Math.trunc(Math.random() * N)]
  const e2 =
    !i || Math.random() > 0.7 ? nodes.value[Math.trunc(Math.random() * N)] : edges.value[Math.trunc(Math.random() * i)]
  edges.value.push({
    id: i + 1,
    type: signal('const-tuple'),
    x1: n1.x,
    y1: n1.y,
    x2: 'x' in e2 ? e2.x : computed(() => (e2.x2.value - e2.x1.value) / 2 + e2.x1.value),
    y2: 'y' in e2 ? e2.y : computed(() => (e2.y2.value - e2.y1.value) / 2 + e2.y1.value),
    sourceId: n1.id,
    targetId: e2.id,
  })
})

const buss = signal<DemoComponentProps<'bus'>>([])
Array.from({ length: B }, (_, i) => {
  const n1 = nodes.value[Math.trunc(Math.random() * N)]
  buss.value.push({
    id: i + 1,
    sourceId: n1.id,
    x: n1.x,
    y: n1.y,
    dx: signal(Math.round(Math.random() * 1000) - 500),
    dy: signal(Math.round(Math.random() * 600) - 300),
  })
})

const App = () => {
  return (
    <div class='playground'>
      <div class='header'>
        <h2>Playground</h2>
        <button>Clear</button>
      </div>
      <EnigraphDemo nodes={nodes} edges={edges} buss={buss} />
    </div>
  )
}

render(<App />, document.getElementById('app')!)
