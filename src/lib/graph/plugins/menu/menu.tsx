import { INode } from '$lib/types'
import { ReadonlySignal, useComputed, useSignal } from '@preact/signals'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import { BaseMenu, MenuButton } from './base-menu'
import { DeepSignal } from 'deepsignal'

type Props = {
  nodes: DeepSignal<INode[]>
  selection: ReadonlySignal<Set<number>>
  visible: ReadonlySignal<boolean>
  buttons: ReadonlySignal<MenuButton[]>
  padding?: number
}

export const withMenu = (props: Props) => {
  const shown = useSignal(false)
  const timer = useRef(0)

  // TODO: Do not produce a new set in the selection plugin.
  // This will eliminate the excessive amount of re-rendering.
  const position = useComputed(() => {
    if (!props.selection.value.size || !props.visible.value) return null
    const current = { x: -Infinity, y: -Infinity }
    for (const node of props.nodes) {
      if (!props.selection.value.has(node.id)) continue
      if (node.y < current.y) continue
      current.x = node.x
      current.y = node.y
    }
    return current
  })

  useEffect(() => {
    if (props.selection.value?.size && props.visible.value) {
      shown.value = false
      self.clearTimeout(timer.current)
      timer.current = self.setTimeout(() => {
        shown.value = true
        document.addEventListener('mousedown', hideMenu, { once: true, capture: true })
      }, 600)
    }
  }, [position.value])

  const hideMenu = useCallback(() => {
    shown.value = false
  }, [])

  useEffect(() => document.removeEventListener('mousedown', hideMenu, { capture: true }), [])

  const menuProps = position.value && {
    ...position.value,
    buttons: props.buttons.value,
    leave: hideMenu,
    shown: shown.value,
    padding: props.padding ?? 0,
  }

  return { menuProps, hideMenu, menuNodePosition: position }
}

export { type MenuButton }
export const Menu = BaseMenu
