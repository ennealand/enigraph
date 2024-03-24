import type { EdgeProps } from '$lib/types'
import styles from '../edge.module.css'

export const ArcConstPermFuzAccess = ({ x1, y1, x2, y2 }: EdgeProps) => {
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
        stroke-dasharray='0, 20, 2, 6'
        stroke-width='5px'
        d={`M ${x1} ${y1 - 5} L ${x2 + 5} ${y2}`}
      />
      <path
        class={styles.stroke}
        stroke-dashoffset='14'
        stroke-dasharray='0, 20, 2, 6'
        stroke-width='5px'
        d={`M ${x1 - 5} ${y1} L ${x2} ${y2 + 5}`}
      />
    </g>
  )
}
