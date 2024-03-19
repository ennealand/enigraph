import './style.css';import { options as G, Fragment as ce, render as ie } from "preact";
import { useSignal as N } from "@preact/signals";
import { useDeepSignal as _, shallow as Z } from "deepsignal";
import { useMemo as q, useRef as P, useLayoutEffect as ae } from "preact/hooks";
var k = /* @__PURE__ */ ((o) => (o.Unknown = "unknown", o.Const = "const", o.ConstTuple = "const.tuple", o.ConstStruct = "const.struct", o.ConstRole = "const.role", o.ConstNorole = "const.norole", o.ConstClass = "const.class", o.ConstAbstract = "const.abstract", o.ConstMaterial = "const.material", o.Var = "var", o.VarTuple = "var.tuple", o.VarStruct = "var.struct", o.VarRole = "var.role", o.VarNorole = "var.norole", o.VarClass = "var.class", o.VarAbstract = "var.abstract", o.VarMaterial = "var.material", o))(k || {}), u = /* @__PURE__ */ ((o) => (o.UCommon = "UCommon", o.DCommon = "DCommon", o.UCommonConst = "UCommonConst", o.DCommonConst = "DCommonConst", o.UCommonVar = "UCommonVar", o.DCommonVar = "DCommonVar", o.Access = "Access", o.AccessConstPosPerm = "AccessConstPosPerm", o.AccessConstNegPerm = "AccessConstNegPerm", o.AccessConstFuzPerm = "AccessConstFuzPerm", o.AccessConstPosTemp = "AccessConstPosTemp", o.AccessConstNegTemp = "AccessConstNegTemp", o.AccessConstFuzTemp = "AccessConstFuzTemp", o.AccessVarPosPerm = "AccessVarPosPerm", o.AccessVarNegPerm = "AccessVarNegPerm", o.AccessVarFuzPerm = "AccessVarFuzPerm", o.AccessVarPosTemp = "AccessVarPosTemp", o.AccessVarNegTemp = "AccessVarNegTemp", o.AccessVarFuzTemp = "AccessVarFuzTemp", o))(u || {});
const le = "_7bu2", ue = "nvzv", de = "d84p", ge = "yjnd", me = "_4193", z = {
  container: le,
  edge: ue,
  fill: de,
  stroke: ge,
  noselect: me
};
var xe = 0;
function e(o, r, d, c, w, f) {
  var g, n, v = {};
  for (n in r)
    n == "ref" ? g = r[n] : v[n] = r[n];
  var y = { type: o, props: v, key: d, ref: g, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --xe, __i: -1, __u: 0, __source: w, __self: f };
  if (typeof o == "function" && (g = o.defaultProps))
    for (n in g)
      v[n] === void 0 && (v[n] = g[n]);
  return G.vnode && G.vnode(y), y;
}
const m = ({
  x1: o,
  y1: r,
  x2: d,
  y2: c
}) => e("g", {
  class: z.edge,
  children: [e("path", {
    d: `M ${o} ${r} L ${d} ${c}`,
    "stroke-width": "8",
    class: z.stroke
  }), e("path", {
    d: `M ${o} ${r} L ${d} ${c}`,
    "stroke-width": "5",
    class: z.fill
  }), e("path", {
    d: `M ${o} ${r} L ${d} ${c}`,
    "stroke-width": "2",
    class: z.stroke,
    "stroke-dasharray": "14 14"
  })]
}), he = {
  [u.UCommon]: m,
  [u.DCommon]: m,
  [u.UCommonConst]: m,
  [u.DCommonConst]: m,
  [u.UCommonVar]: m,
  [u.DCommonVar]: m,
  [u.Access]: m,
  [u.AccessConstPosPerm]: m,
  [u.AccessConstNegPerm]: m,
  [u.AccessConstFuzPerm]: m,
  [u.AccessConstPosTemp]: m,
  [u.AccessConstNegTemp]: m,
  [u.AccessConstFuzTemp]: m,
  [u.AccessVarPosPerm]: m,
  [u.AccessVarNegPerm]: m,
  [u.AccessVarFuzPerm]: m,
  [u.AccessVarPosTemp]: m,
  [u.AccessVarNegTemp]: m,
  [u.AccessVarFuzTemp]: m
}, S = ({
  type: o,
  noselect: r = !1,
  x1: d = 0,
  y1: c = 0,
  x2: w = 0,
  y2: f = 0,
  mousedown: g,
  mouseup: n
}) => {
  const v = he[o];
  return e("g", {
    class: `${z.container} ${r ? z.noselect : ""}`,
    onMouseDown: g,
    onMouseUp: n,
    children: [e("path", {
      d: `M ${d} ${c} L ${w} ${f}`,
      "stroke-width": "35",
      stroke: "transparent"
    }), e(v, {
      x1: d,
      y1: c,
      x2: w,
      y2: f,
      noselect: r
    })]
  });
}, fe = () => e("defs", {
  children: [e("circle", {
    id: "scgg.node.const.outer",
    cx: "0",
    cy: "0",
    r: "10"
  }), e("rect", {
    id: "scgg.node.var.outer",
    width: "20",
    height: "20",
    x: "-10",
    y: "-10"
  }), e("g", {
    id: "scgg.node.unknown",
    children: e("circle", {
      cx: "0",
      cy: "0",
      r: "2.5",
      "stroke-width": "5"
    })
  }), e("g", {
    id: "scgg.node.const",
    children: e("use", {
      xlinkHref: "#scgg.node.const.outer"
    })
  }), e("g", {
    id: "scgg.node.const.tuple",
    children: [e("use", {
      xlinkHref: "#scgg.node.const.outer"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px"
    })]
  }), e("g", {
    id: "scgg.node.const.struct",
    children: [e("use", {
      xlinkHref: "#scgg.node.const.outer"
    }), e("circle", {
      cx: "0",
      cy: "0",
      r: "1.5",
      "stroke-width": "3"
    })]
  }), e("g", {
    id: "scgg.node.const.role",
    children: [e("use", {
      xlinkHref: "#scgg.node.const.outer"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px"
    }), e("line", {
      x1: "0",
      x2: "0",
      y1: "-10",
      y2: "10",
      "stroke-width": "3px"
    })]
  }), e("g", {
    id: "scgg.node.const.norole",
    children: [e("use", {
      xlinkHref: "#scgg.node.const.outer"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px",
      transform: "rotate(45, 0, 0)"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px",
      transform: "rotate(-45, 0, 0)"
    })]
  }), e("g", {
    id: "scgg.node.const.class",
    children: [e("use", {
      xlinkHref: "#scgg.node.const.outer"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px",
      transform: "rotate(45, 0, 0)"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px",
      transform: "rotate(-45, 0, 0)"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px"
    })]
  }), e("g", {
    id: "scgg.node.const.abstract",
    children: [e("use", {
      xlinkHref: "#scgg.node.const.outer"
    }), e("g", {
      "stroke-width": "1px ",
      children: [e("line", {
        x1: "-10",
        x2: "10",
        y1: "-6",
        y2: "-6"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "-3",
        y2: "-3"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "0",
        y2: "0"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "3",
        y2: "3"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "6",
        y2: "6"
      })]
    })]
  }), e("g", {
    id: "scgg.node.const.material",
    children: [e("use", {
      xlinkHref: "#scgg.node.const.outer"
    }), e("g", {
      "stroke-width": "1px",
      transform: "rotate(-45, 0, 0)",
      children: [e("line", {
        x1: "-10",
        x2: "10",
        y1: "-6",
        y2: "-6"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "-3",
        y2: "-3"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "0",
        y2: "0"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "3",
        y2: "3"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "6",
        y2: "6"
      })]
    })]
  }), e("g", {
    id: "scgg.node.var",
    children: e("use", {
      xlinkHref: "#scgg.node.var.outer"
    })
  }), e("g", {
    id: "scgg.node.var.tuple",
    children: [e("use", {
      xlinkHref: "#scgg.node.var.outer"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px"
    })]
  }), e("g", {
    id: "scgg.node.var.struct",
    children: [e("use", {
      xlinkHref: "#scgg.node.var.outer"
    }), e("circle", {
      cx: "0",
      cy: "0",
      r: "1.5",
      "stroke-width": "3"
    })]
  }), e("g", {
    id: "scgg.node.var.role",
    children: [e("use", {
      xlinkHref: "#scgg.node.var.outer"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px"
    }), e("line", {
      x1: "0",
      x2: "0",
      y1: "-10",
      y2: "10",
      "stroke-width": "3px"
    })]
  }), e("g", {
    id: "scgg.node.var.norole",
    children: [e("use", {
      xlinkHref: "#scgg.node.var.outer"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px",
      transform: "rotate(45, 0, 0)"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px",
      transform: "rotate(-45, 0, 0)"
    })]
  }), e("g", {
    id: "scgg.node.var.class",
    children: [e("use", {
      xlinkHref: "#scgg.node.var.outer"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px",
      transform: "rotate(45, 0, 0)"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px",
      transform: "rotate(-45, 0, 0)"
    }), e("line", {
      x1: "-10",
      x2: "10",
      y1: "0",
      y2: "0",
      "stroke-width": "3px"
    })]
  }), e("g", {
    id: "scgg.node.var.abstract",
    children: [e("use", {
      xlinkHref: "#scgg.node.var.outer"
    }), e("g", {
      "stroke-width": "1px",
      children: [e("line", {
        x1: "-10",
        x2: "10",
        y1: "-6",
        y2: "-6"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "-3",
        y2: "-3"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "0",
        y2: "0"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "3",
        y2: "3"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "6",
        y2: "6"
      })]
    })]
  }), e("g", {
    id: "scgg.node.var.material",
    children: [e("use", {
      xlinkHref: "#scgg.node.var.outer"
    }), e("g", {
      "stroke-width": "1px",
      transform: "rotate(-45, 0, 0)",
      children: [e("line", {
        x1: "-10",
        x2: "10",
        y1: "-6",
        y2: "-6"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "-3",
        y2: "-3"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "0",
        y2: "0"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "3",
        y2: "3"
      }), e("line", {
        x1: "-10",
        x2: "10",
        y1: "6",
        y2: "6"
      })]
    })]
  }), e("marker", {
    id: "scgg.target.arrow",
    viewBox: "0 -5 10 10",
    refX: "8",
    markerWidth: "7",
    markerHeight: "10",
    orient: "auto",
    children: e("path", {
      d: "M0,-4L10,0L0,4",
      fill: "#000"
    })
  }), e("marker", {
    id: "end-arrow-access",
    viewBox: "0 -5 10 10",
    refX: "0",
    markerWidth: "5",
    markerHeight: "10",
    orient: "auto",
    children: e("path", {
      d: "M0,-4L10,0L0,4"
    })
  }), e("marker", {
    id: "end-arrow-common",
    viewBox: "0 -5 10 10",
    refX: "0",
    markerWidth: "2",
    markerHeight: "6",
    orient: "auto",
    children: e("path", {
      d: "M0,-4L10,0L0,4"
    })
  })]
}), ye = "_9vkj", ve = "e43s", we = "a3s2", pe = "x4jx", X = {
  container: ye,
  highlight: ve,
  node: we,
  text: pe
}, J = ({
  type: o,
  x: r,
  y: d,
  label: c,
  noring: w,
  mousedown: f,
  mouseup: g,
  textDoubleClick: n,
  highlight: v
}) => e(ce, {
  children: [e("g", {
    class: `${X.container} ${v ? X.highlight : ""}`,
    onMouseDown: f,
    onMouseUp: g,
    children: [!w && e("circle", {
      cx: r,
      cy: d,
      r: "35",
      fill: "transparent"
    }), e("use", {
      class: X.node,
      xlinkHref: `#scgg.node.${o}`,
      x: r,
      y: d
    })]
  }), c && e("text", {
    x: r + 17,
    y: d + 21,
    class: X.text,
    onDblClick: n,
    children: c
  })]
}), ke = "_9ga9", Me = "hpmv", Ce = "p9e4", Q = {
  graph: ke,
  menu: Me,
  show: Ce
}, ze = [k.Const, k.ConstClass, k.ConstStruct, k.ConstTuple, k.Unknown, k.VarTuple, k.VarStruct, k.VarClass, k.Var], Ae = [u.AccessConstPosPerm, u.UCommon, u.DCommon, u.DCommonVar, u.UCommonVar, u.AccessVarPosPerm], F = ze.map((o, r, d) => {
  const c = 2 * Math.PI / d.length;
  return {
    type: o,
    x1: Math.round(700 * Math.sin(c * r)) / 10,
    y1: Math.round(700 * -Math.cos(c * r)) / 10,
    x2: Math.round(700 * Math.sin(c * (r + 1))) / 10,
    y2: Math.round(700 * -Math.cos(c * (r + 1))) / 10,
    textX: Math.round(990 * Math.sin(0.12 + c * r)) / 10 - 4,
    textY: Math.round(990 * -Math.cos(0.12 + c * r)) / 10 + 6,
    nodeX: Math.round(740 * Math.sin(0.35 + c * r)) / 10,
    nodeY: Math.round(740 * -Math.cos(0.35 + c * r)) / 10
  };
}), B = Ae.map((o, r, d) => {
  const c = 2 * Math.PI / d.length;
  return {
    type: o,
    x1: Math.round(700 * Math.sin(c * r)) / 10,
    y1: Math.round(700 * -Math.cos(c * r)) / 10,
    x2: Math.round(700 * Math.sin(c * (r + 1))) / 10,
    y2: Math.round(700 * -Math.cos(c * (r + 1))) / 10,
    textX: Math.round(990 * Math.sin(0.12 + c * r)) / 10 - 4,
    textY: Math.round(990 * -Math.cos(0.12 + c * r)) / 10 + 6,
    edgeX1: Math.round(900 * Math.sin(0.52 + c * r)) / 10,
    edgeY1: Math.round(900 * -Math.cos(0.52 + c * r)) / 10,
    edgeX2: Math.round(450 * Math.sin(0.52 + c * r)) / 10,
    edgeY2: Math.round(450 * -Math.cos(0.52 + c * r)) / 10
  };
}), $e = ({
  elements: o,
  addNode: r,
  addEdge: d,
  width: c,
  height: w
}) => {
  const f = q(() => c / 2, [c]), g = q(() => w / 2, [w]), n = _({
    x: 0,
    y: 0,
    zoom: 1,
    moving: !1
  }), v = P({
    x: 0,
    y: 0
  }), y = P({
    x: 0,
    y: 0
  }), l = N(void 0), i = _({
    x: 0,
    y: 0,
    type: u.Access,
    drawing: !1
  }), s = _({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    selecting: !1,
    dragging: !1,
    nodes: Z(/* @__PURE__ */ new Set())
  }), Y = N(!1), A = P(-1);
  function E(t, a, h) {
    if (l.value && i.drawing) {
      d({
        id: String(o.edges.length + 10),
        type: i.type,
        source: l.value,
        target: t
      }), l.value = void 0, i.drawing = !1, h.stopPropagation();
      return;
    }
    if (y.current.x = h.clientX, y.current.y = h.clientY, s.nodes.size)
      if (s.nodes.has(a)) {
        s.dragging = !0;
        return;
      } else
        s.nodes.clear();
    l.value = t;
  }
  function T(t, a) {
  }
  const D = P(0), M = P(void 0), x = _({
    x: 0,
    y: 0,
    shown: !1
  });
  ae(() => (document.addEventListener("mousemove", W, !0), () => {
    document.removeEventListener("mousemove", W, !0);
  }), [o]);
  const I = (t) => {
    if (l.value && !i.drawing ? (x.x = l.value.x * n.zoom + f + n.x, x.y = l.value.y * n.zoom + g + n.y) : (x.x = t.offsetX, x.y = t.offsetY), x.shown = !0, A.current !== -1) {
      const a = l.value && !i.drawing || s.nodes.size ? B : F;
      V(t, a[A.current].type);
    }
  }, ee = (t) => {
    if (t.preventDefault(), s.nodes.size && !s.dragging && s.nodes.clear(), M.current ? (M.current = void 0, I(t)) : (M.current = {
      x: t.clientX,
      y: t.clientY
    }, D.current = self.setTimeout(() => M.current = void 0, 280)), document.addEventListener("mouseup", j, !1), !x.shown && !t.shiftKey && !t.altKey && (t.metaKey || t.ctrlKey)) {
      I(t);
      return;
    }
    l.value && !i.drawing || s.dragging || t.buttons === 1 && (t.shiftKey && !t.altKey && !t.ctrlKey && !t.metaKey ? (s.x1 = (t.offsetX - f - n.x) / n.zoom, s.y1 = (t.offsetY - g - n.y) / n.zoom, s.x2 = s.x1, s.y2 = s.y1, s.selecting = !0) : n.moving = !0, v.current.x = t.clientX - n.x, v.current.y = t.clientY - n.y);
  };
  function W(t) {
    if (!x.shown) {
      if (!s.selecting && s.nodes.size) {
        if (s.dragging) {
          for (const a of s.nodes)
            o.nodes[a].x += (t.clientX - y.current.x) / n.zoom, o.nodes[a].y += (t.clientY - y.current.y) / n.zoom;
          y.current.x = t.clientX, y.current.y = t.clientY;
        }
        return;
      }
      if (M.current && (Math.abs(t.clientX - M.current.x) > 50 || Math.abs(t.clientY - M.current.y) > 50 || l.value) && (self.clearTimeout(D.current), M.current = void 0), l.value && (i.drawing ? (i.x = (t.offsetX - f - n.x) / n.zoom, i.y = (t.offsetY - g - n.y) / n.zoom) : (l.value.x += (t.clientX - y.current.x) / n.zoom, l.value.y += (t.clientY - y.current.y) / n.zoom), y.current.x = t.clientX, y.current.y = t.clientY), !(l.value && !i.drawing) && !(!n.moving && !s.selecting) && t.buttons === 1) {
        const a = t.clientX - v.current.x, h = t.clientY - v.current.y;
        s.selecting ? (s.x2 = (t.offsetX - f - n.x) / n.zoom, s.y2 = (t.offsetY - g - n.y) / n.zoom, s.nodes = Z(o.nodes.reduce((p, C, $) => (C.x >= Math.min(s.x1, s.x2) && C.x <= Math.max(s.x1, s.x2) && C.y >= Math.min(s.y1, s.y2) && C.y <= Math.max(s.y1, s.y2) && p.add($), p), /* @__PURE__ */ new Set()))) : (i.drawing && (i.x += (n.x - a) / n.zoom, i.y += (n.y - h) / n.zoom), n.x = a, n.y = h);
      }
    }
  }
  function j(t) {
    if (M.current || clearTimeout(D.current), x.shown && (x.shown = !1), s.selecting ? (s.selecting = !1, s.x1 = 0, s.y1 = 0, s.x2 = 0, s.y2 = 0) : s.nodes.size && (s.dragging ? s.dragging = !1 : s.nodes.clear()), l.value) {
      i.drawing || (l.value = void 0);
      return;
    }
    n.moving = !1, document.removeEventListener("mouseup", j, !1);
  }
  function te(t) {
    if (t.preventDefault(), !(l.value && !i.drawing))
      if (t.ctrlKey) {
        let a = t.deltaY * 0.01;
        n.zoom - a < 0.1 ? a = n.zoom - 0.1 : n.zoom - a > 5 && (a = n.zoom - 5), n.x += a / n.zoom * (t.offsetX - f - n.x), n.y += a / n.zoom * (t.offsetY - g - n.y), n.zoom -= a;
      } else
        n.x -= t.deltaX, n.y -= t.deltaY, i.drawing && (i.x += t.deltaX / n.zoom, i.y += t.deltaY / n.zoom);
  }
  function O(t) {
    if (t.key === "Shift") {
      Y.value = !0;
      return;
    }
    if (/^[1-9]$/.test(t.key)) {
      const h = +t.key - 1;
      if ((t.metaKey || t.ctrlKey) && t.preventDefault(), x.shown) {
        const p = l.value && !i.drawing || s.nodes.size ? B : F;
        p[h] && V(void 0, p[h].type);
      } else
        A.current !== h && (A.current = h);
    }
  }
  function R(t) {
    if (t.key === "Shift") {
      Y.value = !1;
      return;
    }
    (/^[1-9]$/.test(t.key) || t.key === "Meta") && (A.current = -1);
  }
  function ne(t) {
    document.addEventListener("keydown", O, !1), document.addEventListener("keyup", R, !1);
  }
  function oe(t) {
    document.removeEventListener("keydown", O, !1), document.removeEventListener("keyup", R, !1);
  }
  function V(t, a) {
    if (t?.stopPropagation(), !x.shown)
      return;
    if (((p) => !i.drawing && !!l.value)()) {
      i.x = t ? (t.offsetX - f - n.x) / n.zoom : l.value.x, i.y = t ? (t.offsetY - g - n.y) / n.zoom : l.value.y, i.type = a, i.drawing = !0, y.current.x = t ? t.clientX : -1, y.current.y = t ? t.clientY : -1, x.shown = !1;
      return;
    }
    const h = {
      id: String(o.nodes.length + 10),
      type: a,
      x: (x.x - f - n.x) / n.zoom,
      y: (x.y - g - n.y) / n.zoom
    };
    r(h), l.value && i.drawing && (d({
      id: String(o.nodes.length + 10),
      type: i.type,
      source: l.value,
      target: h
    }), l.value = void 0, i.drawing = !1), x.shown = !1;
  }
  return e("div", {
    class: Q.graph,
    "data-moving": n.moving ? "" : void 0,
    "data-dragging": l.value || s.nodes.size ? "" : void 0,
    "data-selecting": s.selecting || Y.value ? "" : void 0,
    children: e("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      xmlnsXlink: "http://www.w3.org/1999/xlink",
      viewBox: `-${f} -${g} ${c} ${w}`,
      width: `${c}px`,
      height: `${w}px`,
      onContextMenu: (t) => {
        t.preventDefault();
      },
      onMouseDown: ee,
      onWheel: te,
      onMouseEnter: ne,
      onMouseLeave: oe,
      children: [e(fe, {}), o && e("g", {
        transform: `translate(${n.x} ${n.y}) scale(${n.zoom})`,
        children: [o.edges.map((t) => e(S, {
          type: t.type,
          x1: t.source.x,
          y1: t.source.y,
          x2: t.target.x,
          y2: t.target.y
        }, t.id)), o.nodes.map((t, a) => e(J, {
          type: t.type,
          x: t.x,
          y: t.y,
          label: t.label,
          mousedown: E.bind(null, t, a),
          mouseup: T.bind(null, t),
          highlight: s.nodes.has(a)
        }, t.id)), l.value && i.drawing && e(S, {
          type: i.type,
          noselect: !0,
          x1: l.value.x,
          y1: l.value.y,
          x2: i.x,
          y2: i.y
        }), s.selecting && e("rect", {
          x: Math.min(s.x1, s.x2),
          y: Math.min(s.y1, s.y2),
          width: Math.abs(s.x1 - s.x2),
          height: Math.abs(s.y1 - s.y2),
          rx: "1",
          ry: "1",
          "stroke-width": "1",
          fill: "#0048b61a",
          stroke: "#2669cf",
          "pointer-events": "none"
        })]
      }), x.shown && e("g", {
        transform: `translate(${x.x - f} ${x.y - g})`,
        children: e("g", {
          class: Q.menu,
          children: l.value && !i.drawing || s.nodes.size ? B.map(({
            type: t,
            x1: a,
            y1: h,
            x2: p,
            y2: C,
            textX: $,
            textY: b,
            edgeX1: H,
            edgeY1: L,
            edgeX2: U,
            edgeY2: K
          }, se) => e("g", {
            onMouseUp: (re) => V(re, t),
            children: [e("path", {
              d: `M ${a} ${h} A 70 70 0 0 1 ${p} ${C}`,
              "stroke-width": "90"
            }), e("text", {
              x: $,
              y: b,
              "stroke-width": "90",
              children: se + 1
            }), e(S, {
              x1: H,
              y1: L,
              x2: U,
              y2: K,
              type: t,
              noselect: !0
            })]
          }, t)) : F.map(({
            type: t,
            x1: a,
            y1: h,
            x2: p,
            y2: C,
            textX: $,
            textY: b,
            nodeX: H,
            nodeY: L
          }, U) => e("g", {
            onMouseUp: (K) => V(K, t),
            children: [e("path", {
              d: `M ${a} ${h} A 70 70 0 0 1 ${p} ${C}`,
              "stroke-width": "90"
            }), e("text", {
              x: $,
              y: b,
              "stroke-width": "90",
              children: U + 1
            }), e(J, {
              x: H,
              y: L,
              type: t,
              noring: !0
            })]
          }, t))
        })
      })]
    })
  });
}, Ye = (o, r) => ie(e($e, {
  ...r
}), document.getElementById(o));
export {
  u as EdgeType,
  $e as Graph,
  k as NodeType,
  Ye as default
};
//# sourceMappingURL=index.js.map
