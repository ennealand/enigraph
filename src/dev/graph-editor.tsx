import { EdgeType, Graph } from '$lib/index'
import type { Elements, IEdge, IGroup, INode } from '$lib/types'
import { DeepSignal, deepSignal } from 'deepsignal'
import mock from './mockmin.json'
import MyWorker from './worker.js?worker'
// import { simulate } from './simulation'
import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'

const source = {
  ...(mock as unknown as Elements),
  groups: (mock as unknown as Elements).groups.map(g => ({ ...g, values: new Set(g.values) })),
}

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
    if (!elements.value) return
    node.id = elements.value.nodes.length + 1
    elements.value.nodes.push(node)
  }

  const addEdge = (edge: IEdge) => {
    if (!elements.value) return
    if (edge.source !== edge.target) {
      edge.id = elements.value.edges.length + 1000001
      elements.value.edges.push(edge)
    }
  }

  const addGroup = (group: IGroup) => {
    if (!elements.value) return
    group.id = elements.value.groups.length + 2000001
    elements.value.groups.push(group)
  }

  const changeNodeLabel = (node: INode, label: string) => {
    node.label = label
  }

  const changeNodePosition = (node: INode, x: number, y: number) => {
    node.x = x
    node.y = y
  }

  const removeNode = (id: number) => {
    if (!elements.value) return
    elements.value.groups.forEach(g => g.values.delete(id))
    elements.value.edges = elements.value.edges.filter(e => e.source.id !== id && e.target.id !== id)
    elements.value.nodes = elements.value.nodes.filter(n => n.id !== id)
  }

  const foo = useSignal<
    { type: 'group'; action: (id: number) => void; values: Set<number>; indicators?: Map<number, string> } | undefined
  >(undefined)

  return (
    <>
      <input
        type='checkbox'
        onChange={() => {
          foo.value = foo.value
            ? undefined
            : {
                type: 'group',
                action(groupId) {
                  console.log('got a new group selected:', groupId)
                  if (this.indicators) {
                    for (const [id, indicator] of this.indicators) {
                      if (id !== groupId && indicator === '2') this.indicators.delete(id)
                    }
                    if (this.indicators.get(groupId) === '2') this.indicators.delete(groupId)
                    else this.indicators.set(groupId, '2')
                    this.values = new Set(this.indicators.keys())
                  }
                  foo.value = { ...foo.value! }
                },
                values: new Set(),
                indicators: new Map(),
              }
        }}
      >
        Fine
      </input>
      <div style={{ border: 'solid red 3px', width: 'fit-content', margin: '10rem', borderRadius: '0.8rem' }}>
        {elements.value && (
          <Graph
            elements={elements.value}
            addNode={addNode}
            addEdge={addEdge}
            addGroup={addGroup}
            changeNodeLabel={changeNodeLabel}
            changeNodePosition={changeNodePosition}
            nodePositionChanged={() => console.warn('Node position changed')}
            removeNode={removeNode}
            width={1000}
            height={800}
            padding={15}
            edgeTypes={[EdgeType.ArcConst, EdgeType.EdgeConst, EdgeType.ArcConstPermPosAccess]}
            objectSelection={foo.value}
          />
        )}
      </div>
    </>
  )
}
