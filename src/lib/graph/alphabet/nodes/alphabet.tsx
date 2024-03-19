export const Alphabet = () => (
  <defs>
    <circle id='scgg.node.const.outer' cx='0' cy='0' r='10' />
    <rect id='scgg.node.var.outer' width='20' height='20' x='-10' y='-10' />

    {/* <!-- define constant nodes --> */}
    <g id='scgg.node.unknown'>
      <circle cx='0' cy='0' r='2.5' stroke-width='5' />
    </g>

    <g id='scgg.node.const'>
      <use xlinkHref='#scgg.node.const.outer' />
    </g>

    <g id='scgg.node.const.tuple'>
      <use xlinkHref='#scgg.node.const.outer' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' />
    </g>

    <g id='scgg.node.const.struct'>
      <use xlinkHref='#scgg.node.const.outer' />
      <circle cx='0' cy='0' r='1.5' stroke-width='3' />
    </g>

    <g id='scgg.node.const.role'>
      <use xlinkHref='#scgg.node.const.outer' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' />
      <line x1='0' x2='0' y1='-10' y2='10' stroke-width='3px' />
    </g>

    <g id='scgg.node.const.norole'>
      <use xlinkHref='#scgg.node.const.outer' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' transform='rotate(45, 0, 0)' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' transform='rotate(-45, 0, 0)' />
    </g>

    <g id='scgg.node.const.class'>
      <use xlinkHref='#scgg.node.const.outer' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' transform='rotate(45, 0, 0)' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' transform='rotate(-45, 0, 0)' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' />
    </g>

    <g id='scgg.node.const.abstract'>
      <use xlinkHref='#scgg.node.const.outer' />
      <g stroke-width='1px '>
        <line x1='-10' x2='10' y1='-6' y2='-6' />
        <line x1='-10' x2='10' y1='-3' y2='-3' />
        <line x1='-10' x2='10' y1='0' y2='0' />
        <line x1='-10' x2='10' y1='3' y2='3' />
        <line x1='-10' x2='10' y1='6' y2='6' />
      </g>
    </g>

    <g id='scgg.node.const.material'>
      <use xlinkHref='#scgg.node.const.outer' />
      <g stroke-width='1px' transform='rotate(-45, 0, 0)'>
        <line x1='-10' x2='10' y1='-6' y2='-6' />
        <line x1='-10' x2='10' y1='-3' y2='-3' />
        <line x1='-10' x2='10' y1='0' y2='0' />
        <line x1='-10' x2='10' y1='3' y2='3' />
        <line x1='-10' x2='10' y1='6' y2='6' />
      </g>
    </g>

    {/* <!-- define variable nodes --> */}
    <g id='scgg.node.var'>
      <use xlinkHref='#scgg.node.var.outer' />
    </g>

    <g id='scgg.node.var.tuple'>
      <use xlinkHref='#scgg.node.var.outer' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' />
    </g>

    <g id='scgg.node.var.struct'>
      <use xlinkHref='#scgg.node.var.outer' />
      <circle cx='0' cy='0' r='1.5' stroke-width='3' />
    </g>

    <g id='scgg.node.var.role'>
      <use xlinkHref='#scgg.node.var.outer' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' />
      <line x1='0' x2='0' y1='-10' y2='10' stroke-width='3px' />
    </g>

    <g id='scgg.node.var.norole'>
      <use xlinkHref='#scgg.node.var.outer' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' transform='rotate(45, 0, 0)' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' transform='rotate(-45, 0, 0)' />
    </g>

    <g id='scgg.node.var.class'>
      <use xlinkHref='#scgg.node.var.outer' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' transform='rotate(45, 0, 0)' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' transform='rotate(-45, 0, 0)' />
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='3px' />
    </g>

    <g id='scgg.node.var.abstract'>
      <use xlinkHref='#scgg.node.var.outer' />
      <g stroke-width='1px'>
        <line x1='-10' x2='10' y1='-6' y2='-6' />
        <line x1='-10' x2='10' y1='-3' y2='-3' />
        <line x1='-10' x2='10' y1='0' y2='0' />
        <line x1='-10' x2='10' y1='3' y2='3' />
        <line x1='-10' x2='10' y1='6' y2='6' />
      </g>
    </g>

    <g id='scgg.node.var.material'>
      <use xlinkHref='#scgg.node.var.outer' />
      <g stroke-width='1px' transform='rotate(-45, 0, 0)'>
        <line x1='-10' x2='10' y1='-6' y2='-6' />
        <line x1='-10' x2='10' y1='-3' y2='-3' />
        <line x1='-10' x2='10' y1='0' y2='0' />
        <line x1='-10' x2='10' y1='3' y2='3' />
        <line x1='-10' x2='10' y1='6' y2='6' />
      </g>
    </g>

    {/* <!-- arcs --> */}
    <marker id='scgg.target.arrow' viewBox='0 -5 10 10' refX='8' markerWidth='7' markerHeight='10' orient='auto'>
      <path d='M0,-4L10,0L0,4' fill='#000' />
    </marker>

    <marker id='end-arrow-access' viewBox='0 -5 10 10' refX='0' markerWidth='5' markerHeight='10' orient='auto'>
      <path d='M0,-4L10,0L0,4' />
    </marker>

    <marker id='end-arrow-common' viewBox='0 -5 10 10' refX='0' markerWidth='2' markerHeight='6' orient='auto'>
      <path d='M0,-4L10,0L0,4' />
    </marker>
  </defs>
)
