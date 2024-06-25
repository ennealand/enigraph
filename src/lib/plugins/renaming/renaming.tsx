import { BaseNodeProps } from '$lib/components/scg/node/types'
import { ReadonlySignal, useComputed, useSignal } from '@preact/signals'
import { type RenamingAreaData } from './renaming-area'
import './renaming.css'

type Props<NodeProps extends BaseNodeProps> = {
  changeNodeLabel: (node: NodeProps, label: string) => void
}

type RenamingContext<NodeProps extends BaseNodeProps> = {
  startRenaming: (node: NodeProps) => void
  stopRenaming: () => void
  isRenaming: ReadonlySignal<boolean>
  renamingNode: ReadonlySignal<NodeProps | null>
  renamingProps: ReadonlySignal<{
    x: ReadonlySignal<number>
    y: ReadonlySignal<number>
    value: ReadonlySignal<string> | undefined
    changeNodeLabel: (value: string) => void
  } | null>
}

export const withRenaming = <NodeProps extends BaseNodeProps>(props: Props<NodeProps>): RenamingContext<NodeProps> => {
  const renamingNode = useSignal<NodeProps | null>(null)
  const isRenaming = useComputed(() => !!renamingNode.value)
  const startRenaming = (node: NodeProps) => {
    renamingNode.value = node
  }

  const stopRenaming = () => {
    renamingNode.value = null
  }

  const renamingProps: RenamingAreaData = useComputed(
    () =>
      renamingNode.value && {
        x: renamingNode.value.x,
        y: renamingNode.value.y,
        value: renamingNode.value.label,
        changeNodeLabel: (value: string) =>
          renamingNode.value && (props.changeNodeLabel?.(renamingNode.value, value), stopRenaming()),
      }
  )

  return { startRenaming, stopRenaming, isRenaming, renamingNode, renamingProps }
}
