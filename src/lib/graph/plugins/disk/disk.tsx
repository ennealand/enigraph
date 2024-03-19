import { EdgeType, NodeType } from '$lib/types'
import { useDeepSignal } from 'deepsignal'
import { useMemo } from 'preact/hooks'
import { BaseDisk } from './base-disk'
import { DefaultEdgeTypes, DefaultNodeTypes, getEdgeOptions, getNodeOptions } from './options'

type DiskProps = {
  click: (e: MouseEvent, type: NodeType | EdgeType) => void
  nodeTypes?: NodeType[]
  edgeTypes?: EdgeType[]
}
type OptionType = 'node' | 'edge'

export const useDisk = (props: DiskProps) =>
  useMemo(() => {
    const nodeOptions = getNodeOptions(props.nodeTypes ?? DefaultNodeTypes)
    const edgeOptions = getEdgeOptions(props.edgeTypes ?? DefaultEdgeTypes)
    const menu = useDeepSignal({ x: 0, y: 0, type: 'node' as OptionType, shown: false })

    const showDisk = (e: MouseEvent, type: OptionType) => {
      if (type === 'edge') {
        menu.x = selectedNode.value.x * transform.zoom + centerX + transform.x
        menu.y = selectedNode.value.y * transform.zoom + centerY + transform.y
      } else {
        menu.x = e.offsetX
        menu.y = e.offsetY
      }
      menu.shown = true
    }

    const Disk = () => (
      <BaseDisk
        x={menu.x}
        y={menu.y}
        type={'edge'}
        click={props.click}
        nodeOptions={nodeOptions}
        edgeOptions={edgeOptions}
      />
    )
    return { Disk, showDisk, isDiskOpened: menu.$shown! }
  }, [props.click, props.nodeTypes, props.edgeTypes])
