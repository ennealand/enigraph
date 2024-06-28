import { IGroup, INode } from '$lib/types'
import { ReadonlySignal, effect, useComputed, useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { BaseGroup } from './base-group'
import { getGroupPosition } from './group-position'
import style from './grouping.module.css'

type Props = {
  nodes: INode[]
  groups: IGroup[]
  selection: ReadonlySignal<Set<number>>
}

export const useGrouping = (props: Props) => {
  const opened = useSignal(new Set<number>())
  const selected = useSignal<number | null>(null)

  useEffect(() => {
    return effect(() => {
      for (const group of props.groups) {
        // NOTE: Might worth a partial update instead? (any reason to though?)
        const newPosition = getGroupPosition(props.nodes, group.values)
        for (const [key, value] of Object.entries(newPosition)) {
          if (group.position[key as keyof typeof newPosition] !== value)
            group.position[key as keyof typeof newPosition] = value
        }
      }
    })
  }, [props.nodes, props.groups])

  const openGroup = (id: number) => {
    opened.value.add(id)
    opened.value = new Set(opened.value)
    if (id === selected.value) selected.value = null
  }

  const closeGroup = (id: number) => {
    opened.value.delete(id)
    opened.value = new Set(opened.value)
  }

  const closeAllGroups = () => {
    opened.value = new Set()
  }

  const selectGroup = (id: number) => (selected.value = id)
  const deselectGroup = () => (selected.value = null)
  const selectedGroup = useComputed(
    () => selected.value && props.groups.find(({ id }) => id === selected.value)?.values
  )

  const groupingProps = { opened: opened.value, selected: selected.value, groups: props.groups }

  return {
    groupingProps,
    openGroup,
    closeGroup,
    closeAllGroups,
    selectGroup,
    deselectGroup,
    selectedGroup,
    selectedGroupId: selected,
  }
}

export const Groups = (props: {
  groups: IGroup[]
  opened: Set<number>
  selected: number | null

  placeholder?: true
  nohighlight?: boolean
  customSelection?: Set<number>
  customIndicators?: Map<number, string>
  onMouseDown?: (e: MouseEvent, id: number) => void
}) => {
  return (
    <g class={props.placeholder && style.placeholder}>
      {props.groups.map(group => (
        <BaseGroup
          key={group.id}
          id={group.id}
          {...group.position}
          onMouseDown={props.onMouseDown}
          opened={!props.nohighlight && props.opened.has(group.id)}
          selected={
            props.customSelection
              ? props.customSelection.has(group.id)
              : !props.nohighlight && props.selected === group.id
          }
          indicator={props.customIndicators?.get(group.id)}
        />
      ))}
    </g>
  )
}
