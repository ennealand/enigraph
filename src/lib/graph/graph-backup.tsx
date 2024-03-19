import { computed, useSignal } from '@preact/signals'
import { DeepSignal, shallow, useDeepSignal } from 'deepsignal'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'preact/hooks'
import { EdgeType, NodeType, type Elements, type IEdge, type INode } from '../types'
import { Edge } from './alphabet/edges/edge'
import { Alphabet } from './alphabet/nodes/alphabet'
import { Node } from './alphabet/nodes/node'
import style from './graph.module.css'
import { DefaultEdgeTypes, DefaultNodeTypes, getEdgeOptions, getNodeOptions } from './plugins/disk/options'

export interface Props {
  elements: DeepSignal<Elements>
  addNode(node: DeepSignal<INode>): void
  addEdge(edge: IEdge): void
  width: number
  height: number
}

export const Graph = ({ elements, addNode, addEdge, width, height }: Props) => {
  const centerX = useMemo(() => width / 2, [width])
  const centerY = useMemo(() => height / 2, [height])

  const movable = useDeepSignal({ x: 0, y: 0, zoom: 1, moving: false })
  const moveStart = useRef({ x: 0, y: 0 })

  const keydown = useRef<(e: KeyboardEvent) => void>()
  const keyup = useRef<(e: KeyboardEvent) => void>()
  const mouseupRef = useRef<(e: MouseEvent) => void>()

  const dragStart = useRef({ x: 0, y: 0 })
  const selectedNode = useSignal<DeepSignal<INode> | undefined>(undefined)
  const drawingEdge = useDeepSignal({ x: 0, y: 0, type: EdgeType.Access, drawing: false })

  const selection = useSignal(new Set<number>())
  const selectable = useDeepSignal({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    selecting: false,
    dragging: false,
    nodes: shallow(new Set<number>()),
  })
  const shiftIsHeld = useSignal(false)
  const spaceIsHeld = useSignal(false)
  const digitKeyHeld = useRef(-1)

  // ==========================
  // Node event listeners
  // ==========================

  function nodeMouseDown(node: DeepSignal<INode>, index: number, e: MouseEvent) {
    if (selectedNode.value && drawingEdge.drawing) {
      addEdge({
        id: String(elements.edges.length + 10),
        type: drawingEdge.type,
        source: selectedNode.value,
        target: node,
      })
      selectedNode.value = undefined
      drawingEdge.drawing = false
      e.stopPropagation()
      return
    }
    dragStart.current.x = e.clientX
    dragStart.current.y = e.clientY
    if (selectable.nodes.size) {
      if (selectable.nodes.has(index)) {
        selectable.dragging = true
        return
      } else {
        selectable.nodes.clear()
      }
    }
    if (selection.value.size) selection.value.clear()
    selectedNode.value = node
  }

  function nodeMouseUp(_node: DeepSignal<INode>, _e: MouseEvent) {
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

  const timer = useRef<number>(0)
  const firstClick = useRef<{ x: number; y: number } | undefined>(undefined)
  const menu = useDeepSignal({ x: 0, y: 0, shown: false })

  useLayoutEffect(() => {
    document.addEventListener('mousemove', mousemove, true)
    return () => {
      document.removeEventListener('mousemove', mousemove, true)
    }
  }, [elements])

  const showMenu = (e: MouseEvent) => {
    if (selectedNode.value && !drawingEdge.drawing) {
      menu.x = selectedNode.value.x * movable.zoom + centerX + movable.x
      menu.y = selectedNode.value.y * movable.zoom + centerY + movable.y
    } else {
      menu.x = e.offsetX
      menu.y = e.offsetY
    }
    menu.shown = true

    if (digitKeyHeld.current !== -1) {
      const options = (selectedNode.value && !drawingEdge.drawing) || selectable.nodes.size ? getEdgeOptions(DefaultEdgeTypes) : getNodeOptions(DefaultNodeTypes)
      menuOptionClick(e, options[digitKeyHeld.current].type)
    }
  }

  const mousedown = (e: MouseEvent) => {
    e.preventDefault()
    if (selectable.nodes.size && !selectable.dragging && !shiftIsHeld.value) {
      selectable.nodes.clear()
    }

    if (!firstClick.current) {
      firstClick.current = { x: e.clientX, y: e.clientY }
      timer.current = self.setTimeout(() => (firstClick.current = undefined), 280)
    } else {
      firstClick.current = undefined
      showMenu(e)
    }

    mouseupRef.current = mouseup
    document.addEventListener('mouseup', mouseup)

    if (!menu.shown && !e.shiftKey && !e.altKey && (e.metaKey || e.ctrlKey)) {
      showMenu(e)
      return
    }

    if (selectedNode.value && !drawingEdge.drawing) return
    if (selectable.dragging) return

    if (e.buttons === 1) {
      if (!e.altKey && !e.ctrlKey && !e.metaKey) {
        if (spaceIsHeld.value) {
          movable.moving = true
        } else {
          selectable.x1 = (e.offsetX - centerX - movable.x) / movable.zoom
          selectable.y1 = (e.offsetY - centerY - movable.y) / movable.zoom
          selectable.x2 = selectable.x1
          selectable.y2 = selectable.y1
          selectable.selecting = true
        }
      }
      moveStart.current.x = e.clientX - movable.x
      moveStart.current.y = e.clientY - movable.y
    }
  }

  function mousemove(e: MouseEvent) {
    if (menu.shown) return

    if (!selectable.selecting && selectable.nodes.size) {
      if (selectable.dragging) {
        for (const index of selectable.nodes) {
          elements.nodes[index].x += (e.clientX - dragStart.current.x) / movable.zoom
          elements.nodes[index].y += (e.clientY - dragStart.current.y) / movable.zoom
        }
        dragStart.current.x = e.clientX
        dragStart.current.y = e.clientY
      }
      return
    }

    if (
      firstClick.current &&
      (Math.abs(e.clientX - firstClick.current.x) > 50 ||
        Math.abs(e.clientY - firstClick.current.y) > 50 ||
        selectedNode.value)
    ) {
      self.clearTimeout(timer.current)
      firstClick.current = undefined
    }

    if (selectedNode.value) {
      if (drawingEdge.drawing) {
        drawingEdge.x = (e.offsetX - centerX - movable.x) / movable.zoom
        drawingEdge.y = (e.offsetY - centerY - movable.y) / movable.zoom
      } else {
        selectedNode.value.x += (e.clientX - dragStart.current.x) / movable.zoom
        selectedNode.value.y += (e.clientY - dragStart.current.y) / movable.zoom
      }
      dragStart.current.x = e.clientX
      dragStart.current.y = e.clientY
    }

    if (selectedNode.value && !drawingEdge.drawing) return
    if (!movable.moving && !selectable.selecting) return

    if (e.buttons === 1) {
      const newMovableX = e.clientX - moveStart.current.x
      const newMovableY = e.clientY - moveStart.current.y
      if (selectable.selecting) {
        selectable.x2 = (e.offsetX - centerX - movable.x) / movable.zoom
        selectable.y2 = (e.offsetY - centerY - movable.y) / movable.zoom
        selectable.nodes.clear()
        for (const [index, node] of elements.nodes.entries()) {
          if (
            node.x <= Math.max(selectable.x1, selectable.x2) &&
            node.x >= Math.min(selectable.x1, selectable.x2) &&
            node.y >= Math.min(selectable.y1, selectable.y2) &&
            node.y <= Math.max(selectable.y1, selectable.y2)
          ) {
            selectable.nodes.add(index)
          }
        }
      } else {
        // See `!movable.moving && !selectable.selecting` condition above

        if (drawingEdge.drawing) {
          drawingEdge.x += (movable.x - newMovableX) / movable.zoom
          drawingEdge.y += (movable.y - newMovableY) / movable.zoom
        }
        movable.x = newMovableX
        movable.y = newMovableY
      }
    }
  }

  const mouseup = (_e: MouseEvent) => {
    if (!firstClick.current) clearTimeout(timer.current)
    if (menu.shown) menu.shown = false

    if (selectable.selecting) {
      selectable.selecting = false
      selectable.x1 = 0
      selectable.y1 = 0
      selectable.x2 = 0
      selectable.y2 = 0
      selection.value = nodesToHighlight.value

      if (selectedNode.value && drawingEdge.drawing) {
        for (const index of selectable.nodes) {
          addEdge({
            id: String(elements.nodes.length + 10 + index),
            type: drawingEdge.type,
            source: selectedNode.value,
            target: elements.nodes[index],
          })
        }
        selectedNode.value = undefined
        drawingEdge.drawing = false
      }
    } else {
      if (selectable.nodes.size) {
        if (selectable.dragging) {
          selectable.dragging = false
        } else {
          selectable.nodes.clear()
        }
      }
      if (selection.value.size) selection.value.clear()
    }

    if (selectedNode.value) {
      if (!drawingEdge.drawing) selectedNode.value = undefined
    } else {
      movable.moving = false
    }
    // moveStart.x = movable.x
    // moveStart.y = movable.y
    if (mouseupRef.current) document.removeEventListener('mouseup', mouseupRef.current)
  }

  function wheel(e: WheelEvent) {
    e.preventDefault()
    if (selectedNode.value && !drawingEdge.drawing) return
    if (e.ctrlKey) {
      let deltaZoom = e.deltaY * 0.01
      if (movable.zoom - deltaZoom < 0.1) deltaZoom = movable.zoom - 0.1
      else if (movable.zoom - deltaZoom > 5) deltaZoom = movable.zoom - 5

      movable.x += (deltaZoom / movable.zoom) * (e.offsetX - centerX - movable.x)
      movable.y += (deltaZoom / movable.zoom) * (e.offsetY - centerY - movable.y)
      movable.zoom -= deltaZoom
    } else {
      movable.x -= e.deltaX
      movable.y -= e.deltaY
      if (drawingEdge.drawing) {
        drawingEdge.x += e.deltaX / movable.zoom
        drawingEdge.y += e.deltaY / movable.zoom
      }
    }
  }

  const mouseenter = (_e: MouseEvent) => {
    keydown.current = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        shiftIsHeld.value = true
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        spaceIsHeld.value = true
        return
      }

      const isDigitKey = /^[1-9]$/.test(e.key)
      if (isDigitKey) {
        const digit = +e.key - 1

        if (e.metaKey || e.ctrlKey) {
          e.preventDefault()
        }

        if (menu.shown) {
          const options =
            (selectedNode.value && !drawingEdge.drawing) || selectable.nodes.size ? getEdgeOptions(DefaultEdgeTypes) : getNodeOptions(DefaultNodeTypes)
          if (options[digit]) {
            menuOptionClick(undefined, options[digit].type)
          }
        } else if (digitKeyHeld.current !== digit) {
          digitKeyHeld.current = digit
        }
      }
    }

    keyup.current = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        shiftIsHeld.value = false
        return
      }

      if (e.code === 'Space') {
        spaceIsHeld.value = false
        return
      }

      const isDigitKey = /^[1-9]$/.test(e.key)
      if (isDigitKey || e.key === 'Meta') {
        digitKeyHeld.current = -1
      }
    }

    document.addEventListener('keydown', keydown.current)
    document.addEventListener('keyup', keyup.current)
  }

  const mouseleave = useCallback((_e: MouseEvent) => {
    if (!keydown.current || !keyup.current) return
    document.removeEventListener('keydown', keydown.current)
    document.removeEventListener('keyup', keyup.current)
  }, [])

  function menuOptionClick(e: MouseEvent | undefined, type: NodeType | EdgeType) {
    if (mouseupRef.current) document.removeEventListener('mouseup', mouseupRef.current)
    // cancel mouse down sybscription!!!!
    e?.stopPropagation()
    if (!menu.shown) return

    if (((_: NodeType | EdgeType): _ is EdgeType => !drawingEdge.drawing && !!selectedNode.value)(type)) {
      // Coords should be updated in mousemove to match cursor coords if set to -1
      drawingEdge.x = e ? (e.offsetX - centerX - movable.x) / movable.zoom : selectedNode.value!.x
      drawingEdge.y = e ? (e.offsetY - centerY - movable.y) / movable.zoom : selectedNode.value!.y
      drawingEdge.type = type
      drawingEdge.drawing = true

      dragStart.current.x = e ? e.clientX : -1
      dragStart.current.y = e ? e.clientY : -1
      menu.shown = false
      return
    }

    const newNode = {
      id: String(elements.nodes.length + 10),
      type,
      x: (menu.x - centerX - movable.x) / movable.zoom,
      y: (menu.y - centerY - movable.y) / movable.zoom,
    }
    addNode(newNode)

    if (selectedNode.value && drawingEdge.drawing) {
      addEdge({
        id: String(elements.nodes.length + 10),
        type: drawingEdge.type,
        source: selectedNode.value,
        target: newNode,
      })
      selectedNode.value = undefined
      drawingEdge.drawing = false
    }

    menu.shown = false
  }

  const nodesToHighlight = computed(() => {
    const toHighlight = new Set<number>()
    for (const index of selectable.nodes) {
      if (!selection.value.has(index)) toHighlight.add(index)
    }
    for (const index of selection.value) {
      if (!selectable.nodes.has(index)) toHighlight.add(index)
    }
    return toHighlight
  })

  return (
    <div
      class={style.graph}
      data-movable={spaceIsHeld.value ? '' : undefined}
      data-moving={movable.moving ? '' : undefined}
      data-dragging={selectedNode.value || selectable.nodes.size ? '' : undefined}
      data-selecting={selectable.selecting ? '' : undefined}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        viewBox={`-${centerX} -${centerY} ${width} ${height}`}
        width={`${width}px`}
        height={`${height}px`}
        onContextMenu={e => {
          e.preventDefault()
        }}
        onMouseDown={mousedown}
        onWheel={wheel} // nonpassive|preventDefault|stopPropagation
        onMouseEnter={mouseenter}
        onMouseLeave={mouseleave}
      >
        <Alphabet />

        {elements && (
          <g transform={`translate(${movable.x} ${movable.y}) scale(${movable.zoom})`}>
            {/* <!-- Map edges to EdgeCommon component --> */}
            {elements.edges.map(edge => (
              <Edge
                key={edge.id}
                type={edge.type}
                x1={edge.source.x}
                y1={edge.source.y}
                x2={edge.target.x}
                y2={edge.target.y}
              />
            ))}

            {/* <!-- Map nodes to Node component --> */}
            {elements.nodes.map((node, index) => (
              <Node
                key={node.id}
                type={node.type}
                x={node.x ?? 0}
                y={node.y ?? 0}
                label={node.label}
                mousedown={nodeMouseDown.bind(null, node, index)}
                mouseup={nodeMouseUp.bind(null, node)}
                highlight={nodesToHighlight.value.has(index)}
              />
            ))}

            {selectedNode.value && drawingEdge.drawing && (
              <Edge
                type={drawingEdge.type}
                noselect
                x1={selectedNode.value.x}
                y1={selectedNode.value.y}
                x2={drawingEdge.x}
                y2={drawingEdge.y}
              />
            )}

            {selectable.selecting && (
              <rect
                x={Math.min(selectable.x1, selectable.x2)}
                y={Math.min(selectable.y1, selectable.y2)}
                width={Math.abs(selectable.x1 - selectable.x2)}
                height={Math.abs(selectable.y1 - selectable.y2)}
                rx='1'
                ry='1'
                stroke-width='1'
                fill='#0048b61a'
                stroke='#2669cf'
                pointer-events='none'
              />
            )}
          </g>
        )}

        {menu.shown && (
          <g transform={`translate(${menu.x - centerX} ${menu.y - centerY})`}>
            <g class={style.menu}>
              {(selectedNode.value && !drawingEdge.drawing) || selectable.nodes.size
                ? getEdgeOptions(DefaultEdgeTypes).map(({ type, x1, y1, x2, y2, textX, textY, edgeX1, edgeY1, edgeX2, edgeY2 }, index) => (
                    <g key={type} onMouseUp={e => menuOptionClick(e, type)}>
                      <path d={`M ${x1} ${y1} A 70 70 0 0 1 ${x2} ${y2}`} stroke-width='90' />
                      <text x={textX} y={textY} stroke-width='90'>
                        {index + 1}
                      </text>
                      <Edge x1={edgeX1} y1={edgeY1} x2={edgeX2} y2={edgeY2} type={type} noselect />
                    </g>
                  ))
                : getNodeOptions(DefaultNodeTypes).map(({ type, x1, y1, x2, y2, textX, textY, nodeX, nodeY }, index) => (
                    <g key={type} onMouseUp={e => menuOptionClick(e, type)}>
                      <path d={`M ${x1} ${y1} A 70 70 0 0 1 ${x2} ${y2}`} stroke-width='90' />
                      <text x={textX} y={textY} stroke-width='90'>
                        {index + 1}
                      </text>
                      <Node x={nodeX} y={nodeY} type={type} noring />
                    </g>
                  ))}
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}
