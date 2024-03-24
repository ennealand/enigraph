import { EdgeType, NodeType } from '$lib/types'
import { useDeepSignal } from 'deepsignal'
import { useEffect, useMemo } from 'preact/hooks'
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

export const useDisk = (click: DiskClickCallback, options?: DiskOptions) =>
  useMemo(() => {
    const nodeOptions = useMemo(() => getNodeOptions(options?.nodeTypes ?? DefaultNodeTypes), [options?.nodeTypes])
    const edgeOptions = useMemo(() => getEdgeOptions(options?.edgeTypes ?? DefaultEdgeTypes), [options?.edgeTypes])
    const menu = useDeepSignal({ x: 0, y: 0, type: 'node' as OptionType, shown: false })

    const mouseup = () => {
      menu.shown = false
      cleanup()
    }

    const keydown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') menu.shown = false
      cleanup()
    }

    const cleanup = () => {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('mouseup', mouseup)
    }

    // TODO: make sure cleaning is done safely. Otherwise wrap fns into ref.
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
      ) : (
        <></>
      )
    return { Disk, showDisk, isDiskOpened: menu.shown }
  }, [click, options?.nodeTypes, options?.edgeTypes])
