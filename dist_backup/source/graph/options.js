import { EdgeType, NodeType } from '$lib/types';
const nodeTypes = [
    NodeType.Const,
    NodeType.ConstClass,
    NodeType.ConstStruct,
    NodeType.ConstTuple,
    NodeType.Unknown,
    NodeType.VarTuple,
    NodeType.VarStruct,
    NodeType.VarClass,
    NodeType.Var
];
const edgeTypes = [
    EdgeType.AccessConstPosPerm,
    EdgeType.UCommon,
    EdgeType.DCommon,
    EdgeType.DCommonVar,
    EdgeType.UCommonVar,
    EdgeType.AccessVarPosPerm,
];
export const nodeOptions = nodeTypes.map((type, index, a) => {
    const deg = (2 * Math.PI) / a.length;
    return {
        type,
        x1: Math.round(700 * Math.sin(deg * index)) / 10,
        y1: Math.round(700 * -Math.cos(deg * index)) / 10,
        x2: Math.round(700 * Math.sin(deg * (index + 1))) / 10,
        y2: Math.round(700 * -Math.cos(deg * (index + 1))) / 10,
        textX: Math.round(990 * Math.sin(0.12 + deg * index)) / 10 - 4,
        textY: Math.round(990 * -Math.cos(0.12 + deg * index)) / 10 + 6,
        nodeX: Math.round(740 * Math.sin(0.35 + deg * index)) / 10,
        nodeY: Math.round(740 * -Math.cos(0.35 + deg * index)) / 10
    };
});
export const edgeOptions = edgeTypes.map((type, index, a) => {
    const deg = (2 * Math.PI) / a.length;
    return {
        type,
        x1: Math.round(700 * Math.sin(deg * index)) / 10,
        y1: Math.round(700 * -Math.cos(deg * index)) / 10,
        x2: Math.round(700 * Math.sin(deg * (index + 1))) / 10,
        y2: Math.round(700 * -Math.cos(deg * (index + 1))) / 10,
        textX: Math.round(990 * Math.sin(0.12 + deg * index)) / 10 - 4,
        textY: Math.round(990 * -Math.cos(0.12 + deg * index)) / 10 + 6,
        edgeX1: Math.round(900 * Math.sin(0.52 + deg * index)) / 10,
        edgeY1: Math.round(900 * -Math.cos(0.52 + deg * index)) / 10,
        edgeX2: Math.round(450 * Math.sin(0.52 + deg * index)) / 10,
        edgeY2: Math.round(450 * -Math.cos(0.52 + deg * index)) / 10
    };
});
