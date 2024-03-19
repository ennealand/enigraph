import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import style from './node.module.css';
export const Node = ({ type, x, y, label, noring, mousedown, mouseup, textDoubleClick, highlight }) => {
    return (_jsxs(_Fragment, { children: [_jsxs("g", { class: `${style.container} ${highlight ? style.highlight : ''}`, onMouseDown: mousedown, onMouseUp: mouseup, children: [!noring && _jsx("circle", { cx: x, cy: y, r: '35', fill: 'transparent' }), _jsx("use", { class: style.node, xlinkHref: `#scgg.node.${type}`, x: x, y: y })] }), label && (_jsx("text", { x: x + 17, y: y + 21, class: style.text, onDblClick: textDoubleClick, children: label }))] }));
};
