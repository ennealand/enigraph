export enum NodeType {
  Unknown = 'unknown',
  Const = 'const',
  ConstTuple = 'const.tuple',
  ConstStruct = 'const.struct',
  ConstRole = 'const.role',
  ConstNorole = 'const.norole',
  ConstClass = 'const.class',
  ConstAbstract = 'const.abstract',
  ConstMaterial = 'const.material',
  Var = 'var',
  VarTuple = 'var.tuple',
  VarStruct = 'var.struct',
  VarRole = 'var.role',
  VarNorole = 'var.norole',
  VarClass = 'var.class',
  VarAbstract = 'var.abstract',
  VarMaterial = 'var.material',
}

export enum EdgeType {
  EdgeConst = 'EdgeConst',
  ArcConst = 'ArcConst',
  ArcConstPermPosAccess = 'AccessConstPosPerm',
  ArcConstPermNegAccess = 'AccessConstNegPerm',
  ArcConstPermFuzAccess = 'AccessConstFuzPerm',
}

export interface EdgeProps {
  x1: number
  y1: number
  x2: number
  y2: number
  class?: string
}

export interface INode {
  id: number
  type: NodeType
  label?: string
  x: number
  y: number
}

export interface IEdge {
  id: number
  type: EdgeType
  source: INode
  target: INode
}

export interface IGroup {
  id: number
  label: string
  values: Set<number>
  position: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export type Elements = { nodes: INode[]; edges: IEdge[]; groups: IGroup[] }
