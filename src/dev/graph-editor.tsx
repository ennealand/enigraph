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
    worker.onmessage = e =>
      (elements.value = deepSignal({
        ...e.data,
        groups: [
          {
            id: 'z',
            values: new Set(['g', 'e']),
            position: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          },
          {
            id: 'w',
            values: new Set(['k', 'j']),
            position: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          },
        ],
      }))
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
        <Graph
          elements={elements.value ?? { nodes: [], edges: [], groups: [] }}
          addNode={addNode}
          addEdge={addEdge}
          addGroup={addGroup}
          width={1000}
          height={800}
          padding={15}
          edgeTypes={[EdgeType.ArcConst, EdgeType.EdgeConst, EdgeType.ArcConstPermPosAccess]}
          objectSelection={foo.value}
        />
      </div>
    </>
  )
}
