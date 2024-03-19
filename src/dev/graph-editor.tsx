import { Graph } from '$lib/index'
import type { Elements, IEdge, INode } from '$lib/types'
import { DeepSignal, deepSignal } from 'deepsignal'
import mock from './mockmin.json'
import MyWorker from './worker.js?worker'
// import { simulate } from './simulation'
import { useSignal } from '@preact/signals'
import { useLayoutEffect } from 'preact/hooks'

const source = mock as unknown as Elements

export const GraphEditor = () => {
  const elements = useSignal<DeepSignal<Elements> | undefined>(undefined)

  useLayoutEffect(() => {
    elements.value = deepSignal(source)
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

  return <div style={{ border: 'solid red 3px', width: 'fit-content', margin: '10rem', borderRadius: '0.8rem' }}>
    <Graph elements={elements.value ?? { nodes: [], edges: [], groups: [] }} addNode={addNode} addEdge={addEdge} width={1000} height={800} />
  </div>
}
