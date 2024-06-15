export type AreaSelectionProps = { x1: number; y1: number; x2: number; y2: number }

export const AreaSelection = (props: AreaSelectionProps) => {
  return (
    <rect
      x={Math.min(props.x1, props.x2)}
      y={Math.min(props.y1, props.y2)}
      width={Math.abs(props.x1 - props.x2)}
      height={Math.abs(props.y1 - props.y2)}
      rx='1'
      ry='1'
      stroke-width='1'
      fill='#0048b61a'
      stroke='#2669cf'
      pointer-events='none'
    />
  )
}
