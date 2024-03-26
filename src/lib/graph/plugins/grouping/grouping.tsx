import { IGroup, INode } from '$lib/types'
import { ReadonlySignal, batch, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { DeepSignal } from 'deepsignal'
import { BaseGroups } from './base-grouping'
import { useCallback } from 'preact/hooks'

type Props = {
  nodes: DeepSignal<INode[]>
  groups: DeepSignal<IGroup[]>
  selection: ReadonlySignal<Set<string>>
}

export const withGrouping = (props: Props) => {
  const groups = useSignal(new Map<string, Array<{ x: number; y: number }>>())
  const opened = useSignal(new Set<string>())
  const selected = useSignal<string | null>(null)

  // TODO: Unable to track props.nodes and props.groups for updates. wth
  // Dummy fix: track selection
  useSignalEffect(() => {
    props.selection.value
    const newGroups = new Map<string, Array<{ x: number; y: number }>>()
    for (const node of props.nodes) {
      for (const group of props.groups) {
        if (!group.values.has(node.id)) continue
        let newGroup = newGroups.get(group.id)
        if (!newGroup) newGroups.set(group.id, (newGroup = []))
        newGroup.push({ x: node.x, y: node.y })
      }
    }

    // Iterate through `new` groups and change them to old, unless:
    // - they do not persist in the `old` groups (new)
    // - group sizes are different (updates)
    // - at least one element from A does not has its alternative in B (updates)
    let anyupdate = false
    for (const [id, group] of newGroups) {
      const oldGroup = groups.peek().get(id)
      if (
        !oldGroup ||
        oldGroup.length !== group.length ||
        !group.every((node, i) => node.x === oldGroup[i].x && node.y === oldGroup[i].y)
      ) {
        anyupdate = true
        continue
      }
      newGroups.set(id, oldGroup)
    }
    if (!anyupdate) return
    batch(() => {
      groups.value = newGroups
    })
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
  const selectedGroup = useComputed(() => selected.value && props.groups.find(({id}) => id === selected.value)?.values)

  const Group = useCallback(
    (props: { placeholder?: true; onMouseDown?: (e: MouseEvent, id: string) => void }) => (
      <BaseGroups value={groups.value} opened={opened.value} {...props} selected={selected.value} />
    ),
    []
  )

  return { Group, openGroup, closeGroup, closeAllGroups, selectGroup, deselectGroup, selectedGroup }
}
