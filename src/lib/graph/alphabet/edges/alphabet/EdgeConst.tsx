import type { EdgeProps } from '$lib/types'
import styles from '../edge.module.css'

export const EdgeConst = ({ x1, y1, x2, y2 }: EdgeProps) => {
  return (
    <g class={styles.edge}>
      <path stroke-width='8' d={`M ${x1} ${y1} L ${x2} ${y2}`} class={styles.stroke} />
      <path stroke-width='5' class={styles.fill} d={`M ${x1} ${y1} L ${x2} ${y2}`} />
    </g>
  )
}
