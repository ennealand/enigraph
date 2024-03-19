import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useSignal } from '@preact/signals';
import { shallow, useDeepSignal } from 'deepsignal';
import { useLayoutEffect, useMemo, useRef } from 'preact/hooks';
import { EdgeType } from '../types';
import { Edge } from './alphabet/edges/edge';
import { Alphabet } from './alphabet/nodes/alphabet';
import { Node } from './alphabet/nodes/node';
import style from './graph.module.css';
import { edgeOptions, nodeOptions } from './options';
export const Graph = ({ elements, addNode, addEdge, width, height }) => {
    const centerX = useMemo(() => width / 2, [width]);
    const centerY = useMemo(() => height / 2, [height]);
    const movable = useDeepSignal({ x: 0, y: 0, zoom: 1, moving: false });
    const moveStart = useRef({ x: 0, y: 0 });
    const dragStart = useRef({ x: 0, y: 0 });
    const selectedNode = useSignal(undefined);
    const drawingEdge = useDeepSignal({ x: 0, y: 0, type: EdgeType.Access, drawing: false });
    const selectable = useDeepSignal({
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        selecting: false,
        dragging: false,
        nodes: shallow(new Set()),
    });
    const shiftIsHeld = useSignal(false);
    const digitKeyHeld = useRef(-1);
    // ==========================
    // Node event listeners
    // ==========================
    function nodeMouseDown(node, index, e) {
        if (selectedNode.value && drawingEdge.drawing) {
            addEdge({
                id: String(elements.edges.length + 10),
                type: drawingEdge.type,
                source: selectedNode.value,
                target: node,
            });
            selectedNode.value = undefined;
            drawingEdge.drawing = false;
            e.stopPropagation();
            return;
        }
        dragStart.current.x = e.clientX;
        dragStart.current.y = e.clientY;
        if (selectable.nodes.size) {
            if (selectable.nodes.has(index)) {
                selectable.dragging = true;
                return;
            }
            else {
                selectable.nodes.clear();
            }
        }
        selectedNode.value = node;
    }
    function nodeMouseUp(_node, _e) {
        // if (selectable.nodes.size) {
        // 	e.stopPropagation()
        // 	return
        // }
        // e.stopPropagation()
        // selectedNode = undefined
    }
    // ==========================
    // Global event listeners
    // ==========================
    const timer = useRef(0);
    const firstClick = useRef(undefined);
    const menu = useDeepSignal({ x: 0, y: 0, shown: false });
    useLayoutEffect(() => {
        document.addEventListener('mousemove', mousemove, true);
        return () => {
            document.removeEventListener('mousemove', mousemove, true);
        };
    }, [elements]);
    const showMenu = (e) => {
        if (selectedNode.value && !drawingEdge.drawing) {
            menu.x = selectedNode.value.x * movable.zoom + centerX + movable.x;
            menu.y = selectedNode.value.y * movable.zoom + centerY + movable.y;
        }
        else {
            menu.x = e.offsetX;
            menu.y = e.offsetY;
        }
        menu.shown = true;
        if (digitKeyHeld.current !== -1) {
            const options = (selectedNode.value && !drawingEdge.drawing) || selectable.nodes.size ? edgeOptions : nodeOptions;
            menuOptionClick(e, options[digitKeyHeld.current].type);
        }
    };
    const mousedown = (e) => {
        e.preventDefault();
        if (selectable.nodes.size && !selectable.dragging) {
            selectable.nodes.clear();
        }
        if (!firstClick.current) {
            firstClick.current = { x: e.clientX, y: e.clientY };
            timer.current = self.setTimeout(() => (firstClick.current = undefined), 280);
        }
        else {
            firstClick.current = undefined;
            showMenu(e);
        }
        document.addEventListener('mouseup', mouseup, false);
        if (!menu.shown && !e.shiftKey && !e.altKey && (e.metaKey || e.ctrlKey)) {
            showMenu(e);
            return;
        }
        if (selectedNode.value && !drawingEdge.drawing)
            return;
        if (selectable.dragging)
            return;
        if (e.buttons === 1) {
            if (e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
                selectable.x1 = (e.offsetX - centerX - movable.x) / movable.zoom;
                selectable.y1 = (e.offsetY - centerY - movable.y) / movable.zoom;
                selectable.x2 = selectable.x1;
                selectable.y2 = selectable.y1;
                selectable.selecting = true;
            }
            else {
                movable.moving = true;
            }
            moveStart.current.x = e.clientX - movable.x;
            moveStart.current.y = e.clientY - movable.y;
        }
    };
    function mousemove(e) {
        if (menu.shown)
            return;
        if (!selectable.selecting && selectable.nodes.size) {
            if (selectable.dragging) {
                for (const index of selectable.nodes) {
                    elements.nodes[index].x += (e.clientX - dragStart.current.x) / movable.zoom;
                    elements.nodes[index].y += (e.clientY - dragStart.current.y) / movable.zoom;
                }
                dragStart.current.x = e.clientX;
                dragStart.current.y = e.clientY;
            }
            return;
        }
        if (firstClick.current &&
            (Math.abs(e.clientX - firstClick.current.x) > 50 ||
                Math.abs(e.clientY - firstClick.current.y) > 50 ||
                selectedNode.value)) {
            self.clearTimeout(timer.current);
            firstClick.current = undefined;
        }
        if (selectedNode.value) {
            if (drawingEdge.drawing) {
                drawingEdge.x = (e.offsetX - centerX - movable.x) / movable.zoom;
                drawingEdge.y = (e.offsetY - centerY - movable.y) / movable.zoom;
            }
            else {
                selectedNode.value.x += (e.clientX - dragStart.current.x) / movable.zoom;
                selectedNode.value.y += (e.clientY - dragStart.current.y) / movable.zoom;
            }
            dragStart.current.x = e.clientX;
            dragStart.current.y = e.clientY;
        }
        if (selectedNode.value && !drawingEdge.drawing)
            return;
        if (!movable.moving && !selectable.selecting)
            return;
        if (e.buttons === 1) {
            const newMovableX = e.clientX - moveStart.current.x;
            const newMovableY = e.clientY - moveStart.current.y;
            if (selectable.selecting) {
                selectable.x2 = (e.offsetX - centerX - movable.x) / movable.zoom;
                selectable.y2 = (e.offsetY - centerY - movable.y) / movable.zoom;
                selectable.nodes = shallow(elements.nodes.reduce((a, node, index) => (node.x >= Math.min(selectable.x1, selectable.x2) &&
                    node.x <= Math.max(selectable.x1, selectable.x2) &&
                    node.y >= Math.min(selectable.y1, selectable.y2) &&
                    node.y <= Math.max(selectable.y1, selectable.y2) &&
                    a.add(index),
                    a), new Set()));
            }
            else {
                if (drawingEdge.drawing) {
                    drawingEdge.x += (movable.x - newMovableX) / movable.zoom;
                    drawingEdge.y += (movable.y - newMovableY) / movable.zoom;
                }
                movable.x = newMovableX;
                movable.y = newMovableY;
            }
        }
    }
    function mouseup(_e) {
        if (!firstClick.current)
            clearTimeout(timer.current);
        if (menu.shown)
            menu.shown = false;
        if (selectable.selecting) {
            selectable.selecting = false;
            selectable.x1 = 0;
            selectable.y1 = 0;
            selectable.x2 = 0;
            selectable.y2 = 0;
        }
        else if (selectable.nodes.size) {
            if (selectable.dragging) {
                selectable.dragging = false;
            }
            else {
                selectable.nodes.clear();
            }
        }
        if (selectedNode.value) {
            if (!drawingEdge.drawing)
                selectedNode.value = undefined;
            return;
        }
        movable.moving = false;
        // moveStart.x = movable.x
        // moveStart.y = movable.y
        document.removeEventListener('mouseup', mouseup, false);
    }
    function wheel(e) {
        e.preventDefault();
        if (selectedNode.value && !drawingEdge.drawing)
            return;
        if (e.ctrlKey) {
            let deltaZoom = e.deltaY * 0.01;
            if (movable.zoom - deltaZoom < 0.1)
                deltaZoom = movable.zoom - 0.1;
            else if (movable.zoom - deltaZoom > 5)
                deltaZoom = movable.zoom - 5;
            movable.x += (deltaZoom / movable.zoom) * (e.offsetX - centerX - movable.x);
            movable.y += (deltaZoom / movable.zoom) * (e.offsetY - centerY - movable.y);
            movable.zoom -= deltaZoom;
        }
        else {
            movable.x -= e.deltaX;
            movable.y -= e.deltaY;
            if (drawingEdge.drawing) {
                drawingEdge.x += e.deltaX / movable.zoom;
                drawingEdge.y += e.deltaY / movable.zoom;
            }
        }
    }
    function keydown(e) {
        if (e.key === 'Shift') {
            shiftIsHeld.value = true;
            return;
        }
        const isDigitKey = /^[1-9]$/.test(e.key);
        if (isDigitKey) {
            const digit = +e.key - 1;
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
            }
            if (menu.shown) {
                const options = (selectedNode.value && !drawingEdge.drawing) || selectable.nodes.size ? edgeOptions : nodeOptions;
                if (options[digit]) {
                    menuOptionClick(undefined, options[digit].type);
                }
            }
            else if (digitKeyHeld.current !== digit) {
                digitKeyHeld.current = digit;
            }
        }
    }
    function keyup(e) {
        if (e.key === 'Shift') {
            shiftIsHeld.value = false;
            return;
        }
        const isDigitKey = /^[1-9]$/.test(e.key);
        if (isDigitKey || e.key === 'Meta') {
            digitKeyHeld.current = -1;
        }
    }
    function mouseenter(_e) {
        document.addEventListener('keydown', keydown, false);
        document.addEventListener('keyup', keyup, false);
    }
    function mouseleave(_e) {
        document.removeEventListener('keydown', keydown, false);
        document.removeEventListener('keyup', keyup, false);
    }
    function menuOptionClick(e, type) {
        e?.stopPropagation();
        if (!menu.shown)
            return;
        if (((_) => !drawingEdge.drawing && !!selectedNode.value)(type)) {
            // Coords should be updated in mousemove to match cursor coords if set to -1
            drawingEdge.x = e ? (e.offsetX - centerX - movable.x) / movable.zoom : selectedNode.value.x;
            drawingEdge.y = e ? (e.offsetY - centerY - movable.y) / movable.zoom : selectedNode.value.y;
            drawingEdge.type = type;
            drawingEdge.drawing = true;
            dragStart.current.x = e ? e.clientX : -1;
            dragStart.current.y = e ? e.clientY : -1;
            menu.shown = false;
            return;
        }
        const newNode = {
            id: String(elements.nodes.length + 10),
            type,
            x: (menu.x - centerX - movable.x) / movable.zoom,
            y: (menu.y - centerY - movable.y) / movable.zoom,
        };
        addNode(newNode);
        if (selectedNode.value && drawingEdge.drawing) {
            addEdge({
                id: String(elements.nodes.length + 10),
                type: drawingEdge.type,
                source: selectedNode.value,
                target: newNode,
            });
            selectedNode.value = undefined;
            drawingEdge.drawing = false;
        }
        menu.shown = false;
    }
    return (_jsx("div", { class: style.graph, "data-moving": movable.moving ? '' : undefined, "data-dragging": selectedNode.value || selectable.nodes.size ? '' : undefined, "data-selecting": selectable.selecting || shiftIsHeld.value ? '' : undefined, children: _jsxs("svg", { xmlns: 'http://www.w3.org/2000/svg', xmlnsXlink: 'http://www.w3.org/1999/xlink', viewBox: `-${centerX} -${centerY} ${width} ${height}`, width: `${width}px`, height: `${height}px`, onContextMenu: e => {
                e.preventDefault();
            }, onMouseDown: mousedown, onWheel: wheel, onMouseEnter: mouseenter, onMouseLeave: mouseleave, children: [_jsx(Alphabet, {}), elements && (_jsxs("g", { transform: `translate(${movable.x} ${movable.y}) scale(${movable.zoom})`, children: [elements.edges.map(edge => (_jsx(Edge, { type: edge.type, x1: edge.source.x, y1: edge.source.y, x2: edge.target.x, y2: edge.target.y }, edge.id))), elements.nodes.map((node, index) => (_jsx(Node, { type: node.type, x: node.x, y: node.y, label: node.label, mousedown: nodeMouseDown.bind(null, node, index), mouseup: nodeMouseUp.bind(null, node), highlight: selectable.nodes.has(index) }, node.id))), selectedNode.value && drawingEdge.drawing && (_jsx(Edge, { type: drawingEdge.type, noselect: true, x1: selectedNode.value.x, y1: selectedNode.value.y, x2: drawingEdge.x, y2: drawingEdge.y })), selectable.selecting && (_jsx("rect", { x: Math.min(selectable.x1, selectable.x2), y: Math.min(selectable.y1, selectable.y2), width: Math.abs(selectable.x1 - selectable.x2), height: Math.abs(selectable.y1 - selectable.y2), rx: '1', ry: '1', "stroke-width": '1', fill: '#0048b61a', stroke: '#2669cf', "pointer-events": 'none' }))] })), menu.shown && (_jsx("g", { transform: `translate(${menu.x - centerX} ${menu.y - centerY})`, children: _jsx("g", { class: style.menu, children: (selectedNode.value && !drawingEdge.drawing) || selectable.nodes.size
                            ? edgeOptions.map(({ type, x1, y1, x2, y2, textX, textY, edgeX1, edgeY1, edgeX2, edgeY2 }, index) => (_jsxs("g", { onMouseUp: e => menuOptionClick(e, type), children: [_jsx("path", { d: `M ${x1} ${y1} A 70 70 0 0 1 ${x2} ${y2}`, "stroke-width": '90' }), _jsx("text", { x: textX, y: textY, "stroke-width": '90', children: index + 1 }), _jsx(Edge, { x1: edgeX1, y1: edgeY1, x2: edgeX2, y2: edgeY2, type: type, noselect: true })] }, type)))
                            : nodeOptions.map(({ type, x1, y1, x2, y2, textX, textY, nodeX, nodeY }, index) => (_jsxs("g", { onMouseUp: e => menuOptionClick(e, type), children: [_jsx("path", { d: `M ${x1} ${y1} A 70 70 0 0 1 ${x2} ${y2}`, "stroke-width": '90' }), _jsx("text", { x: textX, y: textY, "stroke-width": '90', children: index + 1 }), _jsx(Node, { x: nodeX, y: nodeY, type: type, noring: true })] }, type))) }) }))] }) }));
};
