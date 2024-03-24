// import { INode } from '$lib/types'
// import { DeepSignal, useDeepSignal } from 'deepsignal'
// import { useCallback, useEffect } from 'preact/hooks'


// type Props = {
//   nodes: DeepSignal<INode[]>
//   getInnerPoint: (x: number, y: number) => readonly [number, number]
// }

// export const useDraggable = (props: Props) => {
//   const draggable = useDeepSignal({ shift: null as { x: number, y: number } | null })

//   const startDragging = (e: MouseEvent) => {
//     const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
//     selection.area = { x1: x, y1: y, x2: x, y2: y }
//     document.addEventListener('mouseup', stopSelection, { once: true })
//   }

//   const updateSelection = (e: MouseEvent) => {
//     if (!selection.area) return
//     const [x, y] = props.getInnerPoint(e.clientX, e.clientY)
//     selection.area.x2 = x
//     selection.area.y2 = y
//   }

//   const stopSelection = useCallback(() => {
//     selection.area = null
//   }, [selection])

//   useEffect(() => () => document.removeEventListener('mouseup', stopSelection), [selection])

//   return {
//     /** Area selection rectangle */
//     AreaSelection: () => selection.area && <AreaSelection {...selection.area} />,
//     selection: selection.values,
//     updateSelection,
//     startSelection,
//   }
// }
