import type { EdgeProps } from '$lib/types'
import styles from '../edge.module.css'

export const ArcConst = ({ x1, y1, x2, y2 }: EdgeProps) => {
  const rad = Math.atan2(y2 - y1, x2 - x1)
  x2 -= Math.cos(rad) * 10
  y2 -= Math.sin(rad) * 10
  return (
    <g class={styles.edge}>
      <path stroke-width='7.5' d={`M ${x1} ${y1} L ${x2} ${y2}`} class={styles.stroke} />
      <path
        stroke-width='5'
        class={styles.fill}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        marker-end='url("#end-arrow-common")'
      />
    </g>
  )
}
