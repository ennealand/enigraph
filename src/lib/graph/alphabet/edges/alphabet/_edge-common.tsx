import type { EdgeProps } from '$lib/types'
import styles from '../edge.module.css'

export const EdgeCommon = ({ x1, y1, x2, y2 }: EdgeProps) => {
  return (
    <g class={styles.edge}>
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke-width='8' class={styles.stroke} />
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke-width='5' class={styles.fill} />
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke-width='2' class={styles.stroke} stroke-dasharray='14 14' />
    </g>
  )
}
