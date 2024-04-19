import { INode } from '$lib/types'
import { useSignal } from '@preact/signals'
import { DeepSignal } from 'deepsignal'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import style from './renaming.module.css'

type Props = {
  submit?: (element: INode, newValue: string) => void
}

export const withRenaming = (props: Props) => {
  const isRenaming = useSignal(null as { node: DeepSignal<INode> } | null)
  const startRenaming = (node: DeepSignal<INode>) => {
    isRenaming.value = { node }
  }

  const stopRenaming = () => {
    isRenaming.value = null
  }

  const component = useCallback(
    () =>
      isRenaming.value && (
        <RenamingArea
          x={Math.round(isRenaming.value.node.x) || 0}
          y={Math.round(isRenaming.value.node.y) || 0}
          value={isRenaming.value.node.label ?? ''}
          submit={value => isRenaming.value && (props.submit?.(isRenaming.value.node, value), stopRenaming())}
        />
      ),
    [isRenaming]
  )

  return { RenamingArea: component, startRenaming, stopRenaming, isRenaming }
}

export const RenamingArea = (props: { x: number; y: number; value: string; submit: (newValue: string) => void }) => {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => ref.current?.focus(), [])

  const onKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') props.submit(e.currentTarget.value)
  }

  return (
    <div class={style.component} style={{ transform: `translate(${props.x + 19 - 5.8 - 3.5}px, ${props.y - 11 - 5.8}px)` }}>
      <input
        ref={ref}
        class={style.input}
        type='text'
        value={props.value}
        onKeyDown={onKeyDown}
        onBlur={e => props.submit(e.currentTarget.value)}
      />
    </div>
  )
}
