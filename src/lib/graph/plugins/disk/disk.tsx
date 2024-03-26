import { EdgeType, NodeType } from '$lib/types'
import { useDeepSignal } from 'deepsignal'
import { useCallback, useEffect, useMemo } from 'preact/hooks'
import { BaseDisk } from './base-disk'
import { DefaultEdgeTypes, DefaultNodeTypes, getEdgeOptions, getNodeOptions } from './options'

type DiskOptions = {
  nodeTypes?: NodeType[]
  edgeTypes?: EdgeType[]
}
export type OptionType = 'node' | 'edge'
export type DiskClickCallback = (
  ...args:
    | [type: 'node', x: number, y: number, e: MouseEvent, value: NodeType]
    | [type: 'edge', x: number, y: number, e: MouseEvent, value: EdgeType]
) => void

export const withDisk = (click: DiskClickCallback, options?: DiskOptions) => {
  const nodeOptions = useMemo(() => getNodeOptions(options?.nodeTypes ?? DefaultNodeTypes), [options?.nodeTypes])
  const edgeOptions = useMemo(() => getEdgeOptions(options?.edgeTypes ?? DefaultEdgeTypes), [options?.edgeTypes])
  const menu = useDeepSignal({ x: 0, y: 0, type: 'node' as OptionType, shown: false })

  const mouseup = useCallback(() => {
    menu.shown = false
    cleanup()
  }, [])

  const keydown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Escape') menu.shown = false
    cleanup()
  }, [])

  const cleanup = () => {
    document.removeEventListener('keydown', keydown)
    document.removeEventListener('mouseup', mouseup)
  }

  // Clean up safely on unmount.
  useEffect(() => cleanup, [])

  const showDisk = (type: OptionType, x: number, y: number) => {
    menu.type = type
    menu.x = x
    menu.y = y
    menu.shown = true

    document.addEventListener('mouseup', mouseup, { once: true })
    document.addEventListener('keydown', keydown, { once: true })
  }

  const Disk = () =>
    menu.shown ? (
      <BaseDisk
        x={menu.x}
        y={menu.y}
        type={menu.type}
        click={click}
        nodeOptions={nodeOptions}
        edgeOptions={edgeOptions}
      />
    ) : null
    return { Disk, showDisk, isDiskOpened: menu.$shown! }
  }
