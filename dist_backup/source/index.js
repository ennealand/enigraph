import { jsx as _jsx } from "preact/jsx-runtime";
import { render } from 'preact';
export { Graph } from './graph/graph';
export { NodeType, EdgeType, } from './types';
import { Graph } from './graph/graph';
export default (id, props) => render(_jsx(Graph, { ...props }), document.getElementById(id));
