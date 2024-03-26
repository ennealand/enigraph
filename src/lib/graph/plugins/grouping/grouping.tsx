import { IGroup, INode } from '$lib/types'
import { ReadonlySignal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { DeepSignal } from 'deepsignal'
import { useCallback } from 'preact/hooks'
import { BaseGroup } from './base-group'
import { getGroupPosition } from './group-position'
import style from './grouping.module.css'

type Props = {
  nodes: DeepSignal<INode[]>
  groups: DeepSignal<IGroup[]>
  selection: ReadonlySignal<Set<string>>
}

export const withGrouping = (props: Props) => {
  const opened = useSignal(new Set<string>())
  const selected = useSignal<string | null>(null)

  // TODO: Unable to track props.nodes and props.groups for updates. wth
  // Dummy fix: track selection
  useSignalEffect(() => {
    props.selection.value
    for (const group of props.groups) {
      // NOTE: Might worth a partial update instead? (any reason to though?)
      const newPosition = getGroupPosition(props.nodes, group.values)
      for (const [key, value] of Object.entries(newPosition)) {
        if (group.position[key as keyof typeof newPosition] !== value)
          group.position[key as keyof typeof newPosition] = value
      }
    }
  })

  const openGroup = (id: string) => {
    opened.value.add(id)
    opened.value = new Set(opened.value)
    if (id === selected.value) selected.value = null
  }

  const closeGroup = (id: string) => {
    opened.value.delete(id)
    opened.value = new Set(opened.value)
  }

  const closeAllGroups = () => {
    opened.value = new Set()
  }

  const selectGroup = (id: string) => (selected.value = id)
  const deselectGroup = () => (selected.value = null)
  const selectedGroup = useComputed(
    () => selected.value && props.groups.find(({ id }) => id === selected.value)?.values
  )

  const Group = useCallback(
    (args: { placeholder?: true; onMouseDown?: (e: MouseEvent, id: string) => void }) => {
      return (
        <g class={args.placeholder && style.placeholder}>
          {props.groups.map(group => (
            <BaseGroup
              key={group.id}
              id={group.id}
              {...group.position}
              onMouseDown={args.onMouseDown}
              opened={opened.value.has(group.id)}
              selected={selected.value === group.id}
            />
          ))}
        </g>
      )
    },
    [props.groups]
  )

  return { Group, openGroup, closeGroup, closeAllGroups, selectGroup, deselectGroup, selectedGroup }
}
