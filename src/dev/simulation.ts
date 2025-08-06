import type { IEdge, INode } from '../lib/types.ts'
import * as d3 from 'd3'

export const simulate = <T extends { nodes: any; edges: any }>(data: T, options: { animate?: boolean } = {}): T => {
  const simulation = d3
    .forceSimulation(data.nodes)
    .force(
      'link',
      d3
        .forceLink<INode, IEdge>(data.edges)
        .id(d => d.id)
        .distance(200)
        .strength(0.3)
    )
    .force(
      'charge',
      d3.forceManyBody().strength(() => -700)
    )
    .force(
      'r',
      d3.forceCollide(() => 25)
    )

  if (options.animate) {
    simulation.on('tick', () => {
      data = { ...data }
    })
  } else {
    simulation.stop()
    simulation.tick(1000)
  }

  return data
}
