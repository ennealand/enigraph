import { DeepSignal } from 'deepsignal'
import { useCallback, useEffect, useMemo } from 'preact/hooks'
import { EdgeType, NodeType, type Elements, type IEdge, type INode } from '../types'
import { useBaseGraph } from './base-graph'
import { useCreation } from './plugins/creation/creation'
import { useDisk, type DiskClickCallback } from './plugins/disk'
import { useMovable } from './plugins/movable/movable'
import { useSelection } from './plugins/selection/selection'

export interface Props {
  elements: DeepSignal<Elements>
  addNode(node: DeepSignal<INode>): void
  addEdge(edge: IEdge): void
  width: number
  height: number
  nodeTypes?: NodeType[]
  edgeTypes?: EdgeType[]
  padding?: number
}

export const Graph = ({ elements, width, height, padding, addEdge, addNode, edgeTypes, nodeTypes }: Props) =>
  useMemo(() => {
    /// ----------------------------------------- ///
    /// ----------------- Core ------------------ ///
    /// ----------------------------------------- ///

    const { BaseGraph, getInnerPoint } = useBaseGraph(width, height)

    /// ----------------------------------------- ///
    /// ---------------- Plugins ---------------- ///
    /// ----------------------------------------- ///

    const creation = useCreation({ addNode, addEdge, nodes: elements.nodes })
    const { transform, localize, onwheel, weakLocalize } = useMovable({ width, height })

    const { AreaSelection, selection, startSelection, updateSelection, isSelecting } = useSelection({
      nodes: elements.nodes,
      getInnerPoint,
      weakLocalize,
      inversion: true,
      padding,
    })

    useMovable({ width, height })

    const onDiskClick: DiskClickCallback = (type, x, y, _e, value) => {
      if (type === 'node') creation.createNode(...localize(x, y), value)
      else creation.startDrawingEdge(x, y, value)
    }

    const { Disk } = useDisk(onDiskClick, { nodeTypes, edgeTypes })

    /// ----------------------------------------- ///
    /// ------------- Global events ------------- ///
    /// ----------------------------------------- ///

    const mousemove = useCallback(
      (e: MouseEvent) => {
        updateSelection(e, { deselection: e.altKey, selection: e.ctrlKey || e.metaKey })
      },
      [updateSelection]
    )

    useEffect(() => {
      document.addEventListener('mousemove', mousemove, true)
      return () => document.removeEventListener('mousemove', mousemove, true)
    }, [mousemove])
    useEffect(() => () => document.removeEventListener('mousemove', mousemove, true), [])

    /// ------------ Render component ----------- ///
    return (
      <BaseGraph
        width={width}
        height={height}
        centerX={width / 2}
        centerY={height / 2}
        elements={elements}
        padding={padding ?? 15}
        transform={transform}
        highlight={selection}
        noselect={isSelecting}
        onWheel={e => {
          onwheel(e)
        }}
        onMouseDown={e => {
          startSelection(e, {
            deselection: e.altKey,
            selection: e.ctrlKey || e.metaKey,
            clear: !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey,
          })
        }}
      >
        <Disk />
        <AreaSelection />
      </BaseGraph>
    )
  }, [elements, width, height, padding, addEdge, addNode, edgeTypes, nodeTypes])
