// million-ignore
export const Alphabet = () => (
  <defs>
    <circle id='scg.node.const.outer' cx='0' cy='0' r='10'></circle>
    <rect id='scg.node.var.outer' x='-10' y='-10' width='20' height='20'></rect>
    <clipPath id='scg.node.const.clip'>
      <use xlinkHref='#scg.node.const.clip'></use>
    </clipPath>
    <clipPath id='scg.node.var.clip'>
      <use xlinkHref='#scg.node.var.clip'></use>
    </clipPath>

    {/* <!-- define constant nodes --> */}

    <g id='scg.node.unknown'>
    <circle cx='0' cy='0' r='2.5' stroke-width='5' />
      <text x='7' y='15' class='SCgText'></text>
    </g>

    <g id='scg.node.const'>
      <use xlinkHref='#scg.node.const.outer'></use>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.const.tuple'>
      <use xlinkHref='#scg.node.const.outer'></use>
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='1.3'></line>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.const.struct'>
      <use xlinkHref='#scg.node.const.outer'></use>
      <circle cx='0' cy='0' r='1' stroke-width='2' />
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.const.role'>
      <use xlinkHref='#scg.node.const.outer'></use>
      <line x1='0' x2='0' y1='-10' y2='10' stroke-width='1.3'></line>
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='1.3'></line>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.const.norole'>
      <use xlinkHref='#scg.node.const.outer'></use>
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='1.3' transform='rotate(45, 0, 0)'></line>
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='1.3' transform='rotate(-45, 0, 0)'></line>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.const.class'>
      <use xlinkHref='#scg.node.const.outer'></use>
      <line x1='-10' x2='10' y1='-3' y2='-3' stroke-width='1.3'></line>
      <line x1='-10' x2='10' y1='3' y2='3' stroke-width='1.3'></line>
      <line x1='-3' x2='-3' y1='-10' y2='10' stroke-width='1.3'></line>
      <line x1='3' x2='3' y1='-10' y2='10' stroke-width='1.3'></line>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.const.abstract'>
      <use xlinkHref='#scg.node.const.outer'></use>
      <g stroke-width='1.3'>
        <line x1='-10' x2='10' y1='-6' y2='-6'></line>
        <line x1='-10' x2='10' y1='-3' y2='-3'></line>
        <line x1='-10' x2='10' y1='0' y2='0'></line>
        <line x1='-10' x2='10' y1='3' y2='3'></line>
        <line x1='-10' x2='10' y1='6' y2='6'></line>
      </g>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.const.material'>
      <use xlinkHref='#scg.node.const.outer'></use>
      <g stroke-width='1.3' transform='rotate(-45, 0, 0)'>
        <line x1='-9' x2='9' y1='-6' y2='-6'></line>
        <line x1='-10' x2='10' y1='-3' y2='-3'></line>
        <line x1='-10' x2='10' y1='0' y2='0'></line>
        <line x1='-10' x2='10' y1='3' y2='3'></line>
        <line x1='-9' x2='9' y1='6' y2='6'></line>
      </g>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    {/* <!-- define variable nodes --> */}
    <g id='scg.node.var'>
      <use xlinkHref='#scg.node.var.outer'></use>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.var.tuple'>
      <use xlinkHref='#scg.node.var.outer'></use>
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='1.3'></line>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.var.struct'>
      <use xlinkHref='#scg.node.var.outer'></use>
      <circle cx='0' cy='0' r='1' stroke-width='2' />
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.var.role'>
      <use xlinkHref='#scg.node.var.outer'></use>
      <line x1='0' x2='0' y1='-10' y2='10' stroke-width='1.3'></line>
      <line x1='-10' x2='10' y1='0' y2='0' stroke-width='1.3'></line>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.var.norole'>
      <use xlinkHref='#scg.node.var.outer'></use>
      <line x1='-12' x2='12' y1='0' y2='0' stroke-width='1.3' transform='rotate(45, 0, 0)'></line>
      <line x1='-12' x2='12' y1='0' y2='0' stroke-width='1.3' transform='rotate(-45, 0, 0)'></line>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.var.class'>
      <use xlinkHref='#scg.node.var.outer'></use>
      <line x1='-10' x2='10' y1='-3' y2='-3' stroke-width='1.3'></line>
      <line x1='-10' x2='10' y1='3' y2='3' stroke-width='1.3'></line>
      <line x1='-3' x2='-3' y1='-10' y2='10' stroke-width='1.3'></line>
      <line x1='3' x2='3' y1='-10' y2='10' stroke-width='1.3'></line>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.var.abstract'>
      <use xlinkHref='#scg.node.var.outer'></use>
      <g stroke-width='1.3'>
        <line x1='-10' x2='10' y1='-6' y2='-6'></line>
        <line x1='-10' x2='10' y1='-3' y2='-3'></line>
        <line x1='-10' x2='10' y1='0' y2='0'></line>
        <line x1='-10' x2='10' y1='3' y2='3'></line>
        <line x1='-10' x2='10' y1='6' y2='6'></line>
      </g>
      <text x='17' y='21' class='SCgText'></text>
    </g>

    <g id='scg.node.var.material'>
      <use xlinkHref='#scg.node.var.outer'></use>
      <g stroke-width='1.3' transform='rotate(-45, 0, 0)'>
        <line x1='-9' x2='9' y1='-6' y2='-6'></line>
        <line x1='-11' x2='11' y1='-3' y2='-3'></line>
        <line x1='-13' x2='13' y1='0' y2='0'></line>
        <line x1='-11' x2='11' y1='3' y2='3'></line>
        <line x1='-9' x2='9' y1='6' y2='6'></line>
      </g>
      <text x='17' y='21' class='SCgText'></text>
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
      <path d='M0,-4L10,0L0,4' fill='var(--scgEdgeMarkerColor, var(--scgEdgeColor, #000))'></path>
    </marker>
    <marker
      id='end-arrow-common'
      viewBox='0 -5 10 10'
      refX='0'
      markerWidth='10'
      markerHeight='16'
      orient='auto'
      markerUnits='userSpaceOnUse'
    >
      <path d='M0,-4L10,0L0,4' fill='var(--scgEdgeMarkerColor, var(--scgEdgeColor, #000))'></path>
    </marker>
  </defs>
)
