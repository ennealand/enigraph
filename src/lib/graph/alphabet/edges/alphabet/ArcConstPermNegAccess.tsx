import type { EdgeProps } from '$lib/types'
import styles from '../edge.module.css'

export const ArcConstPermNegAccess = ({ x1, y1, x2, y2 }: EdgeProps) => {
  const rad = Math.atan2(y2 - y1, x2 - x1)
  x2 -= Math.cos(rad) * 10
  y2 -= Math.sin(rad) * 10
  return (
    <g class={styles.edge}>
      <path
        class={styles.stroke}
        stroke-width='1.5'
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        marker-end='url("#end-arrow-access")'
      />
      <path
        class={styles.stroke}
        stroke-dasharray='0, 2, 2, 6'
        stroke-width='10px'
        d={`M ${x1} ${y1} L ${x2 + 4} ${y2 - 4}`}
      />
    </g>
  )
}
