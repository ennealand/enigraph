import { computed, useSignal } from '@preact/signals'
import { DeepSignal, shallow, useDeepSignal } from 'deepsignal'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'preact/hooks'
import { EdgeType, NodeType, type Elements, type IEdge, type INode } from '../types'
import { Edge } from './alphabet/edges/edge'
import { Alphabet } from './alphabet/nodes/alphabet'
import { Node } from './alphabet/nodes/node'
import style from './graph.module.css'
import { getEdgeOptions, getNodeOptions } from './plugins/disk/options'
import { BaseGraph } from './base-graph'
import { Disk } from './plugins/disk/disk'

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

  const transform = useDeepSignal({ x: 0, y: 0, zoom: 1, moving: false })
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

  useLayoutEffect(() => {
    document.addEventListener('mousemove', mousemove, true)
    return () => {
      document.removeEventListener('mousemove', mousemove, true)
    }
  }, [elements])

  const showMenu = (e: MouseEvent) => {
    if (selectedNode.value && !drawingEdge.drawing) {
      menu.x = selectedNode.value.x * transform.zoom + centerX + transform.x
      menu.y = selectedNode.value.y * transform.zoom + centerY + transform.y
    } else {
      menu.x = e.offsetX
      menu.y = e.offsetY
    }
    menu.shown = true

    if (digitKeyHeld.current !== -1) {
      const options =
        (selectedNode.value && !drawingEdge.drawing) || selectable.nodes.size ? getEdgeOptions : getNodeOptions
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
          transform.moving = true
        } else {
          selectable.x1 = (e.offsetX - centerX - transform.x) / transform.zoom
          selectable.y1 = (e.offsetY - centerY - transform.y) / transform.zoom
          selectable.x2 = selectable.x1
          selectable.y2 = selectable.y1
          selectable.selecting = true
        }
      }
      moveStart.current.x = e.clientX - transform.x
      moveStart.current.y = e.clientY - transform.y
    }
  }

  function mousemove(e: MouseEvent) {
    if (menu.shown) return

    if (!selectable.selecting && selectable.nodes.size) {
      if (selectable.dragging) {
        for (const index of selectable.nodes) {
          elements.nodes[index].x += (e.clientX - dragStart.current.x) / transform.zoom
          elements.nodes[index].y += (e.clientY - dragStart.current.y) / transform.zoom
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
        drawingEdge.x = (e.offsetX - centerX - transform.x) / transform.zoom
        drawingEdge.y = (e.offsetY - centerY - transform.y) / transform.zoom
      } else {
        selectedNode.value.x += (e.clientX - dragStart.current.x) / transform.zoom
        selectedNode.value.y += (e.clientY - dragStart.current.y) / transform.zoom
      }
      dragStart.current.x = e.clientX
      dragStart.current.y = e.clientY
    }

    if (selectedNode.value && !drawingEdge.drawing) return
    if (!transform.moving && !selectable.selecting) return

    if (e.buttons === 1) {
      const newMovableX = e.clientX - moveStart.current.x
      const newMovableY = e.clientY - moveStart.current.y
      if (selectable.selecting) {
        selectable.x2 = (e.offsetX - centerX - transform.x) / transform.zoom
        selectable.y2 = (e.offsetY - centerY - transform.y) / transform.zoom
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
          drawingEdge.x += (transform.x - newMovableX) / transform.zoom
          drawingEdge.y += (transform.y - newMovableY) / transform.zoom
        }
        transform.x = newMovableX
        transform.y = newMovableY
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
      transform.moving = false
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
      if (transform.zoom - deltaZoom < 0.1) deltaZoom = transform.zoom - 0.1
      else if (transform.zoom - deltaZoom > 5) deltaZoom = transform.zoom - 5

      transform.x += (deltaZoom / transform.zoom) * (e.offsetX - centerX - transform.x)
      transform.y += (deltaZoom / transform.zoom) * (e.offsetY - centerY - transform.y)
      transform.zoom -= deltaZoom
    } else {
      transform.x -= e.deltaX
      transform.y -= e.deltaY
      if (drawingEdge.drawing) {
        drawingEdge.x += e.deltaX / transform.zoom
        drawingEdge.y += e.deltaY / transform.zoom
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
            (selectedNode.value && !drawingEdge.drawing) || selectable.nodes.size ? getEdgeOptions : nodeOptions
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
      drawingEdge.x = e ? (e.offsetX - centerX - transform.x) / transform.zoom : selectedNode.value!.x
      drawingEdge.y = e ? (e.offsetY - centerY - transform.y) / transform.zoom : selectedNode.value!.y
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
      x: (menu.x - centerX - transform.x) / transform.zoom,
      y: (menu.y - centerY - transform.y) / transform.zoom,
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
    <BaseGraph elements={elements} width={width} height={height}>
      <Disk />
    </BaseGraph>
  )
}
