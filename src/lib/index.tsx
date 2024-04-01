import { render } from 'preact'
export { Graph, type Props as GraphProps } from './graph/graph'
export {
  type INode as GraphNode,
  type IEdge as GraphEdge,
  type IGroup as GraphGroup,
  type Elements as GraphElements,
  NodeType,
  EdgeType,
} from './types'

import { Graph, Props } from './graph/graph'
export default (id: string, props: Props) => render(<Graph {...props} />, document.getElementById(id)!)

// import { deepSignal, useDeepSignal } from 'deepsignal'
// import { Elements } from './types'
// export const useCreateGraph = () => useDeepSignal<Elements>({ nodes: [], edges: [] })
// export const createGraph = () => deepSignal<Elements>({ nodes: [], edges: [] })
