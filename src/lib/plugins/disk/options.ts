import { useComputed } from '@preact/signals'

export const getOptions = <T, Props>(types: T[], componentPropsFactory: (type: T, deg: number, index: number) => Props) =>
  types.map((type, index, a) => {
    const deg = (2 * Math.PI) / a.length
    return {
      type,
      x1: Math.round(700 * Math.sin(deg * index)) / 10,
      y1: Math.round(700 * -Math.cos(deg * index)) / 10,
      x2: Math.round(700 * Math.sin(deg * (index + 1))) / 10,
      y2: Math.round(700 * -Math.cos(deg * (index + 1))) / 10,
      textX: Math.round(990 * Math.sin(0.12 + deg * index)) / 10 - 4,
      textY: Math.round(990 * -Math.cos(0.12 + deg * index)) / 10 + 6,
      componentProps: componentPropsFactory(type, deg, index),
    }
  })

export type DiskOptions<T, Props> = ReturnType<typeof getOptions<T, Props>>

export const getNodeProps = <T>(type: T, deg: number, index: number) => ({
  type: useComputed(() => type),
  x: useComputed(() => Math.round(740 * Math.sin(0.35 + deg * index)) / 10),
  y: useComputed(() => Math.round(740 * -Math.cos(0.35 + deg * index)) / 10),
  id: index,
})

export const getEdgeProps = <T>(type: T, deg: number, index: number) => ({
  type: useComputed(() => type),
  x1: useComputed(() => Math.round(450 * Math.sin(deg * (index + 0.5))) / 10),
  y1: useComputed(() => Math.round(450 * -Math.cos(deg * (index + 0.5))) / 10),
  x2: useComputed(() => Math.round(900 * Math.sin(deg * (index + 0.5))) / 10),
  y2: useComputed(() => Math.round(900 * -Math.cos(deg * (index + 0.5))) / 10),
  id: index,
  sourceId: 0,
  targetId: 0,
})
