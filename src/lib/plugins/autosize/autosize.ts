import { Signal } from '@preact/signals'
import { Ref, useLayoutEffect } from 'preact/hooks'

type Props = {
  ref: Ref<HTMLDivElement>
  width: Signal<number>
  height: Signal<number>
}

type AutosizeContext = {
  width: Signal<number>
  height: Signal<number>
}

export const withAutosize = (props: Props): AutosizeContext => {
  const resize = () => {
    if (!props.ref.current) return
    const rect = props.ref.current.getBoundingClientRect()
    if (!rect.width && !rect.height) return
    props.width.value = rect.width
    props.height.value = rect.height
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', resize)
    resize()
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return { width: props.width, height: props.height }
}
