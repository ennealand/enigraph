export declare enum NodeType {
    Unknown = "unknown",
    Const = "const",
    ConstTuple = "const.tuple",
    ConstStruct = "const.struct",
    ConstRole = "const.role",
    ConstNorole = "const.norole",
    ConstClass = "const.class",
    ConstAbstract = "const.abstract",
    ConstMaterial = "const.material",
    Var = "var",
    VarTuple = "var.tuple",
    VarStruct = "var.struct",
    VarRole = "var.role",
    VarNorole = "var.norole",
    VarClass = "var.class",
    VarAbstract = "var.abstract",
    VarMaterial = "var.material"
}
export declare enum EdgeType {
    UCommon = "UCommon",
    DCommon = "DCommon",
    UCommonConst = "UCommonConst",
    DCommonConst = "DCommonConst",
    UCommonVar = "UCommonVar",
    DCommonVar = "DCommonVar",
    Access = "Access",
    AccessConstPosPerm = "AccessConstPosPerm",
    AccessConstNegPerm = "AccessConstNegPerm",
    AccessConstFuzPerm = "AccessConstFuzPerm",
    AccessConstPosTemp = "AccessConstPosTemp",
    AccessConstNegTemp = "AccessConstNegTemp",
    AccessConstFuzTemp = "AccessConstFuzTemp",
    AccessVarPosPerm = "AccessVarPosPerm",
    AccessVarNegPerm = "AccessVarNegPerm",
    AccessVarFuzPerm = "AccessVarFuzPerm",
    AccessVarPosTemp = "AccessVarPosTemp",
    AccessVarNegTemp = "AccessVarNegTemp",
    AccessVarFuzTemp = "AccessVarFuzTemp"
}
export interface EdgeProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    noselect?: boolean;
    class?: string;
}
export interface INode {
    id: string;
    type: NodeType;
    label?: string;
    x: number;
    y: number;
}
export interface IEdge {
    id: string;
    type: EdgeType;
    source: INode;
    target: INode;
}
export type Elements = {
    nodes: INode[];
    edges: IEdge[];
};
