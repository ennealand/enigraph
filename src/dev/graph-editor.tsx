import { EdgeType, Graph } from '$lib/index'
import type { Elements, IEdge, IGroup, INode } from '$lib/types'
import { DeepSignal, deepSignal } from 'deepsignal'
import mock from './mockmin.json'
import MyWorker from './worker.js?worker'
// import { simulate } from './simulation'
import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'

const source = mock as unknown as Elements

export const GraphEditor = () => {
  const elements = useSignal<DeepSignal<Elements> | null>(null)

  useEffect(() => {
    elements.value = source
    // simulate(elements, {animate: true})
    const worker = new MyWorker()
    worker.postMessage(source)
    worker.onmessage = e => (elements.value = deepSignal(e.data))
  }, [])

  const addNode = (node: INode) => {
    elements.value?.nodes.push(node)
  }

  const addEdge = (edge: IEdge) => {
    if (edge.source !== edge.target) {
      elements.value?.edges.push(edge)
    }
  }

  const addGroup = (group: IGroup) => {
    if (!elements.value) return
    elements.value.groups.push(group)
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
        addGroup={addGroup}
        width={1000}
        height={800}
        padding={15}
        edgeTypes={[EdgeType.ArcConst, EdgeType.EdgeConst, EdgeType.ArcConstPermPosAccess]}
      />
    </div>
  )
}
