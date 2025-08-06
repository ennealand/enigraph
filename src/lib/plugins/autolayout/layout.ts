import { CoSELayout, CoSENode, layoutBase, CoSEConstants } from 'cose-base'
const { PointD, DimensionD, LayoutConstants, FDLayoutConstants } = layoutBase

type Data = {
  nodes: { id: string | number; x: number; y: number }[]
  edges: { sourceId: string | number; targetId: string | number }[]
}

const defaults = {
  quality: 'default',
  nodeDimensionsIncludeLabels: false,
  refresh: 30,
  fit: true,
  padding: 30,
  randomize: true,
  nodeRepulsion: 450000,
  idealEdgeLength: 50,
  edgeElasticity: 1.45,
  nestingFactor: 0.1,
  gravity: 0.45,
  numIter: 9500,
  tile: false,
  animate: false,
  // tilingPaddingVertical: 1,
  // tilingPaddingHorizontal: 1,
  gravityRangeCompound: 1.5,
  gravityCompound: 1.0,
  gravityRange: 9.8,
  initialEnergyOnIncremental: 0.5,
}

function getUserOptions(options: any) {
  if (options.nodeRepulsion != null)
    CoSEConstants.DEFAULT_REPULSION_STRENGTH = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = options.nodeRepulsion
  if (options.idealEdgeLength != null)
    CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength
  if (options.edgeElasticity != null)
    CoSEConstants.DEFAULT_SPRING_STRENGTH = FDLayoutConstants.DEFAULT_SPRING_STRENGTH = options.edgeElasticity
  if (options.nestingFactor != null)
    CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR =
      options.nestingFactor
  if (options.gravity != null)
    CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity
  if (options.numIter != null) CoSEConstants.MAX_ITERATIONS = FDLayoutConstants.MAX_ITERATIONS = options.numIter
  if (options.gravityRange != null)
    CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange
  if (options.gravityCompound != null)
    CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH =
      options.gravityCompound
  if (options.gravityRangeCompound != null)
    CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR =
      options.gravityRangeCompound
  if (options.initialEnergyOnIncremental != null)
    CoSEConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL =
      options.initialEnergyOnIncremental

  if (options.quality == 'draft') LayoutConstants.QUALITY = 0
  else if (options.quality == 'proof') LayoutConstants.QUALITY = 2
  else LayoutConstants.QUALITY = 1

  CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS =
    FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS =
    LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS =
      options.nodeDimensionsIncludeLabels
  CoSEConstants.DEFAULT_INCREMENTAL =
    FDLayoutConstants.DEFAULT_INCREMENTAL =
    LayoutConstants.DEFAULT_INCREMENTAL =
      !options.randomize
  CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = options.animate
  CoSEConstants.TILE = options.tile
  CoSEConstants.TILING_PADDING_VERTICAL =
    typeof options.tilingPaddingVertical === 'function'
      ? options.tilingPaddingVertical.call()
      : options.tilingPaddingVertical
  CoSEConstants.TILING_PADDING_HORIZONTAL =
    typeof options.tilingPaddingHorizontal === 'function'
      ? options.tilingPaddingHorizontal.call()
      : options.tilingPaddingHorizontal
}

export const customForce = (data: Data, width: number, height: number): Data => {
  const { nodes, edges } = data
  const options = defaults
  getUserOptions(options)

  const layout = new CoSELayout()

  // Create graph manager and root graph
  const gm = layout.newGraphManager()
  const root = gm.addRoot()

  // Map node IDs to layout nodes
  const idToLNode: any = {}

  // Add nodes to the layout
  nodes.forEach(node => {
    const layoutNode = root.add(
      new CoSENode(
        layout.graphManager,
        new PointD(node.x - width / 2, node.y - height / 2),
        new DimensionD(width, height)
      )
    )
    layoutNode.id = node.id
    idToLNode[node.id] = layoutNode
  })

  // Add edges to the layout
  edges.forEach(edge => {
    const sourceNode = idToLNode[edge.sourceId]
    const targetNode = idToLNode[edge.targetId]
    if (sourceNode !== targetNode && sourceNode.getEdgesBetween(targetNode).length == 0) {
      const layoutEdge = gm.add(layout.newEdge(), sourceNode, targetNode)
      layoutEdge.id = `${edge.sourceId}-${edge.targetId}`
    }
  })

  // Run the layout algorithm
  layout.runLayout()

  // Extract the positions and update the nodes array
  nodes.forEach(node => {
    const layoutNode = idToLNode[node.id]
    node.x = layoutNode.getRect().getCenterX()
    node.y = layoutNode.getRect().getCenterY()
  })

  return { nodes, edges }
}
