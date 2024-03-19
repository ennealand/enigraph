import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import styles from './edge.module.css';
export const EdgeCommon = ({ x1, y1, x2, y2 }) => {
    return (_jsxs("g", { class: styles.edge, children: [_jsx("path", { d: `M ${x1} ${y1} L ${x2} ${y2}`, "stroke-width": '8', class: styles.stroke }), _jsx("path", { d: `M ${x1} ${y1} L ${x2} ${y2}`, "stroke-width": '5', class: styles.fill }), _jsx("path", { d: `M ${x1} ${y1} L ${x2} ${y2}`, "stroke-width": '2', class: styles.stroke, "stroke-dasharray": '14 14' })] }));
};
