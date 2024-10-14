import { ReadonlySignal, useComputed } from '@preact/signals'
import { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

export type RenamingAreaData = ReadonlySignal<{
  x: ReadonlySignal<number>
  y: ReadonlySignal<number>
  value: ReadonlySignal<string> | undefined
  changeNodeLabel: (value: string) => void
} | null>

export const RenamingArea = (props: { data: RenamingAreaData }) => {
  return props.data.value ? <RenamingAreaComponent data={props.data} /> : null
}

export const RenamingAreaComponent = (props: { data: RenamingAreaData }) => {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => ref.current?.focus(), [])

  const onKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') props.data.value?.changeNodeLabel(e.currentTarget.value)
  }

  return props.data.value ? (
    <div
      class='renaming-component'
      style={useComputed(() =>
        props.data.value
          ? `transform:translate(${props.data.value.x.value + 9.5}px, ${props.data.value.y.value - 16}px)`
          : undefined
      )}
    >
      <input
        ref={ref}
        class='renaming-input'
        type='text'
        value={props.data.value.value}
        onKeyDown={onKeyDown}
        onBlur={e => props.data.value?.changeNodeLabel(e.currentTarget.value)}
      />
    </div>
  ) : null
}
