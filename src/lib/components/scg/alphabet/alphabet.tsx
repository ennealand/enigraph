import { ReadonlySignal, useComputed } from '@preact/signals'

// million-ignore
export const Alphabet = ({
  size = useComputed(() => 10) as unknown as ReadonlySignal<number>,
}: {
  size?: ReadonlySignal<number>
}) => {
  const start = useComputed(() => -size.value)
  const dblsize = useComputed(() => 2 * size.value)
  const halfsize = useComputed(() => 0.5 * size.value)
  const dblhalfsize = useComputed(() => 0.25 * size.value)
  return (
    <defs>
      <circle id='scg-node-const-outer' cx='0' cy='0' r={size} />
      <rect id='scg-node-var-outer' x={start} y={start} width={dblsize} height={dblsize} />
      <clipPath id='scg-node-const-clip'>
        <use xlinkHref='#scg-node-const-clip' />
      </clipPath>
      <clipPath id='scg-node-var-clip'>
        <use xlinkHref='#scg-node-var-clip' />
      </clipPath>

      {/* <!-- define constant nodes --> */}

      <g id='scg-node-unknown'>
        <circle cx='0' cy='0' r={dblhalfsize} stroke-width={halfsize} />
      </g>

      <g id='scg-node-const'>
        <use xlinkHref='#scg-node-const-outer' />
      </g>

      <g id='scg-node-const-tuple'>
        <use xlinkHref='#scg-node-const-outer' />
        <line x1={start} x2={size} y1='0' y2='0' stroke-width='var(--scg-node-line, 1.8)' />
      </g>

      <g id='scg-node-const-struct'>
        <use xlinkHref='#scg-node-const-outer' />
        <circle cx='0' cy='0' r='1' stroke-width='2' />
      </g>

      <g id='scg-node-const-role'>
        <use xlinkHref='#scg-node-const-outer' />
        <line x1='0' x2='0' y1={start} y2={size} stroke-width='var(--scg-node-line, 1.8)' />
        <line x1={start} x2={size} y1='0' y2='0' stroke-width='var(--scg-node-line, 1.8)' />
      </g>

      <g id='scg-node-const-norole'>
        <use xlinkHref='#scg-node-const-outer' />
        <line
          x1={start}
          x2={size}
          y1='0'
          y2='0'
          stroke-width='var(--scg-node-line, 1.8)'
          transform='rotate(45, 0, 0)'
        />
        <line
          x1={start}
          x2={size}
          y1='0'
          y2='0'
          stroke-width='var(--scg-node-line, 1.8)'
          transform='rotate(-45, 0, 0)'
        />
      </g>

      <g id='scg-node-const-class'>
        <use xlinkHref='#scg-node-const-outer' />
        <line x1={start} x2={size} y1='-3' y2='-3' stroke-width='var(--scg-node-line, 1.8)' />
        <line x1={start} x2={size} y1='3' y2='3' stroke-width='var(--scg-node-line, 1.8)' />
        <line x1='-3' x2='-3' y1={start} y2={size} stroke-width='var(--scg-node-line, 1.8)' />
        <line x1='3' x2='3' y1={start} y2={size} stroke-width='var(--scg-node-line, 1.8)' />
      </g>

      <g id='scg-node-const-abstract'>
        <use xlinkHref='#scg-node-const-outer' />
        <g class='linescg-'>
          <line x1={start} x2={size} y1='-6' y2='-6' />
          <line x1={start} x2={size} y1='-3' y2='-3' />
          <line x1={start} x2={size} y1='0' y2='0' />
          <line x1={start} x2={size} y1='3' y2='3' />
          <line x1={start} x2={size} y1='6' y2='6' />
        </g>
      </g>

      <g id='scg-node-const-material'>
        <use xlinkHref='#scg-node-const-outer' />
        <g stroke-width='var(--scg-node-line, 1.8)' transform='rotate(-45, 0, 0)'>
          <line x1='-9' x2='9' y1='-6' y2='-6' />
          <line x1={start} x2={size} y1='-3' y2='-3' />
          <line x1={start} x2={size} y1='0' y2='0' />
          <line x1={start} x2={size} y1='3' y2='3' />
          <line x1='-9' x2='9' y1='6' y2='6' />
        </g>
      </g>

      {/* <!-- define variable nodes --> */}
      <g id='scg-node-var'>
        <use xlinkHref='#scg-node-var-outer' />
      </g>

      <g id='scg-node-var-tuple'>
        <use xlinkHref='#scg-node-var-outer' />
        <line x1={start} x2={size} y1='0' y2='0' stroke-width='var(--scg-node-line, 1.8)' />
      </g>

      <g id='scg-node-var-struct'>
        <use xlinkHref='#scg-node-var-outer' />
        <circle cx='0' cy='0' r='1' stroke-width='2' />
      </g>

      <g id='scg-node-var-role'>
        <use xlinkHref='#scg-node-var-outer' />
        <line x1='0' x2='0' y1={start} y2={size} stroke-width='var(--scg-node-line, 1.8)' />
        <line x1={start} x2={size} y1='0' y2='0' stroke-width='var(--scg-node-line, 1.8)' />
      </g>

      <g id='scg-node-var-norole'>
        <use xlinkHref='#scg-node-var-outer' />
        <line x1='-12' x2='12' y1='0' y2='0' stroke-width='var(--scg-node-line, 1.8)' transform='rotate(45, 0, 0)' />
        <line x1='-12' x2='12' y1='0' y2='0' stroke-width='var(--scg-node-line, 1.8)' transform='rotate(-45, 0, 0)' />
      </g>

      <g id='scg-node-var-class'>
        <use xlinkHref='#scg-node-var-outer' />
        <line x1={start} x2={size} y1='-3' y2='-3' stroke-width='var(--scg-node-line, 1.8)' />
        <line x1={start} x2={size} y1='3' y2='3' stroke-width='var(--scg-node-line, 1.8)' />
        <line x1='-3' x2='-3' y1={start} y2={size} stroke-width='var(--scg-node-line, 1.8)' />
        <line x1='3' x2='3' y1={start} y2={size} stroke-width='var(--scg-node-line, 1.8)' />
      </g>

      <g id='scg-node-var-abstract'>
        <use xlinkHref='#scg-node-var-outer' />
        <g class='linescg-'>
          <line x1={start} x2={size} y1='-6' y2='-6' />
          <line x1={start} x2={size} y1='-3' y2='-3' />
          <line x1={start} x2={size} y1='0' y2='0' />
          <line x1={start} x2={size} y1='3' y2='3' />
          <line x1={start} x2={size} y1='6' y2='6' />
        </g>
      </g>

      <g id='scg-node-var-material'>
        <use xlinkHref='#scg-node-var-outer' />
        <g stroke-width='var(--scg-node-line, 1.8)' transform='rotate(-45, 0, 0)'>
          <line x1='-9' x2='9' y1='-6' y2='-6' />
          <line x1='-11' x2='11' y1='-3' y2='-3' />
          <line x1='-13' x2='13' y1='0' y2='0' />
          <line x1='-11' x2='11' y1='3' y2='3' />
          <line x1='-9' x2='9' y1='6' y2='6' />
        </g>
      </g>

      {/* <!-- arcs --> */}
      <marker
        id='end-arrow-access'
        viewBox='0 -5 10 10'
        refX='0'
        markerWidth='8'
        markerHeight='14'
        orient='auto'
        markerUnits='userSpaceOnUse'
      >
        <path d='M0,-4L10,0L0,4' fill='var(--scg-arrow-color, var(--scg-edge-color, #000))' />
      </marker>
      <marker
        id='end-arrow-common'
        viewBox='0 -5 10 10'
        refX='0'
        markerWidth={size}
        markerHeight='16'
        orient='auto'
        markerUnits='userSpaceOnUse'
      >
        <path d='M0,-4L10,0L0,4' fill='var(--scg-arrow-color, var(--scg-edge-color, #000))' />
      </marker>
    </defs>
  )
}
