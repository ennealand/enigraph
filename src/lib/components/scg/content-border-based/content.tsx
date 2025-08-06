import { cl } from '$lib/utils'
import { ReadonlySignal, useComputed } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import './content.css'
import { BaseContentProps } from './types'

export type BasicContentProps = BaseContentProps<number, 'mutable'> & {
  onMouseDown?: (e: { e: JSX.TargetedMouseEvent<HTMLDivElement>; id: number }) => void
  onSharedProps?: (id: number) => SharedProps
}

export type SharedProps = {
  selected: ReadonlySignal<boolean>
}

export const Content = ({ id, x, y, dx, dy, type, value, onMouseDown, onSharedProps }: BasicContentProps) => {
  console.log('content render')
  const sharedProps = onSharedProps?.(id)
  const className = useComputed(() => cl('content-container', sharedProps?.selected.value && 'selected'))
  const style = useComputed(() => `transform:translate(${x}px,${y}px);width:${dx}px;height:${dy}px`)
  const Component = { image: ImageContent, text: TextContent }[type as unknown as string] ?? null
  return (
    <div class={className} onMouseDown={e => onMouseDown?.({ e, id })} style={style}>
      {Component && <Component {...{ value, dx, dy }} />}
    </div>
  )
}

const ImageContent = ({ value, dx, dy }: { [K in 'value' | 'dx' | 'dy']: BasicContentProps[K] }) => {
  const ref = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (!ref.current) return
    dx.value = ref.current.width
    dy.value = ref.current.height
  }, [value.value])
  return (
    <div class='content image-container' onMouseDown={e => e.stopPropagation()}>
      <img ref={ref} src={value} />
    </div>
  )
}

const TextContent = ({ value }: { value: ReadonlySignal<string> }) => {
  return (
    <div class='content text-container' onMouseDown={e => e.stopPropagation()}>
      {value}
    </div>
  )
}
