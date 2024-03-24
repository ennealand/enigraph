import { EdgeType, Graph } from '$lib/index'
import type { Elements, IEdge, INode } from '$lib/types'
import mock from './mockmin.json'
import MyWorker from './worker.js?worker'
// import { simulate } from './simulation'
import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'

const source = mock as unknown as Elements

export const GraphEditor = () => {
  const elements = useSignal<Elements | null>(null)

  useEffect(() => {
    elements.value = source
    // simulate(elements, {animate: true})
    const worker = new MyWorker()
    worker.postMessage(source)
    worker.onmessage = e => (elements.value = e.data)
  }, [])

  const addNode = (node: INode) => {
    elements.value?.nodes.push(node)
  }

  const addEdge = (edge: IEdge) => {
    if (edge.source !== edge.target) {
      elements.value?.edges.push(edge)
    }
  }

  // const test = useMemo(() => {
  //   const ok = deepSignal(new Set([{ wow: 3 }]))
  //   console.warn(ok)
  //   console.warn('1', ok.has({wow: 2}))
  //   console.warn('1', ok.has({wow: 2}))
  //   console.warn(ok.$size)
  //   const d = {wow: 5}
  //   console.warn('2', ok.add(d))
  //   console.warn('5', ok.has(d))
  //   console.warn(ok.$size)
  // }, [])

  return (
    <div style={{ border: 'solid red 3px', width: 'fit-content', margin: '10rem', borderRadius: '0.8rem' }}>
      <Graph
        elements={elements.value ?? { nodes: [], edges: [], groups: [] }}
        addNode={addNode}
        addEdge={addEdge}
        width={1000}
        height={800}
        edgeTypes={[EdgeType.ArcConst, EdgeType.EdgeConst]}
      />
    </div>
  )
}
