import { EdgeType, NodeType } from '$lib/types'

export const DefaultNodeTypes = [
  NodeType.Const,
  NodeType.ConstClass,
  NodeType.ConstStruct,
  NodeType.ConstTuple,
  NodeType.Unknown,
  NodeType.VarTuple,
  NodeType.VarStruct,
  NodeType.VarClass,
  NodeType.Var,
]

export const DefaultEdgeTypes = [
  EdgeType.ArcConstPermNegAccess,
  EdgeType.ArcConstPermPosAccess,
  EdgeType.ArcConst,
  EdgeType.EdgeConst,
]

export const getNodeOptions = (nodeTypes: NodeType[]) =>
  nodeTypes.map((type, index, a) => {
    const deg = (2 * Math.PI) / a.length
    return {
      type,
      x1: Math.round(700 * Math.sin(deg * index)) / 10,
      y1: Math.round(700 * -Math.cos(deg * index)) / 10,
      x2: Math.round(700 * Math.sin(deg * (index + 1))) / 10,
      y2: Math.round(700 * -Math.cos(deg * (index + 1))) / 10,
      textX: Math.round(990 * Math.sin(0.12 + deg * index)) / 10 - 4,
      textY: Math.round(990 * -Math.cos(0.12 + deg * index)) / 10 + 6,
      nodeX: Math.round(740 * Math.sin(0.35 + deg * index)) / 10,
      nodeY: Math.round(740 * -Math.cos(0.35 + deg * index)) / 10,
    }
  })

export const getEdgeOptions = (edgeTypes: EdgeType[]) =>
  edgeTypes.map((type, index, a) => {
    const deg = (2 * Math.PI) / a.length
    return {
      type,
      x1: Math.round(700 * Math.sin(deg * index)) / 10,
      y1: Math.round(700 * -Math.cos(deg * index)) / 10,
      x2: Math.round(700 * Math.sin(deg * (index + 1))) / 10,
      y2: Math.round(700 * -Math.cos(deg * (index + 1))) / 10,
      textX: Math.round(990 * Math.sin(0.12 + deg * index)) / 10 - 4,
      textY: Math.round(990 * -Math.cos(0.12 + deg * index)) / 10 + 6,
      edgeX1: Math.round(450 * Math.sin(deg * (index + 0.5))) / 10,
      edgeY1: Math.round(450 * -Math.cos(deg * (index + 0.5))) / 10,
      edgeX2: Math.round(900 * Math.sin(deg * (index + 0.5))) / 10,
      edgeY2: Math.round(900 * -Math.cos(deg * (index + 0.5))) / 10,
    }
  })

export type DiskNodeOptions = ReturnType<typeof getNodeOptions>
export type DiskEdgeOptions = ReturnType<typeof getEdgeOptions>
