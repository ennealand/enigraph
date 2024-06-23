import { Alphabet } from '$lib/components/scg/alphabet'
import { BasicNodeProps, Node } from '$lib/components/scg/node'
import { ComponentProps, EnigraphFactory } from '$lib/graph/factory'
import { withAutohide } from '$lib/plugins/autohide'
import { withDraggable } from '$lib/plugins/draggable'
import { withMovable } from '$lib/plugins/movable'
import { AreaSelection, withSelection } from '$lib/plugins/selection'
import { signal } from '@preact/signals'
import { render } from 'preact'

const style = signal('background:skyblue')

const nodePadding = signal(10)
const nodeSize = signal(10)

const factory = new EnigraphFactory()
  .add('node', (props: BasicNodeProps) => <Node {...props} padding={nodePadding} />)
  .plug(withMovable)
  .plug(withSelection)
  .plug(() => {
    const changeNodePosition = (node: BasicNodeProps, x: number, y: number) => {
      node.x.value = x
      node.y.value = y
    }
    return { changeNodePosition }
  })
  .plug(withDraggable)
  .plug(withAutohide)
  .on('graph:wheel', (ctx, e) => ctx.onwheel(e))
  .on('graph:mouseDown', (ctx, e) => {
    if (e.buttons === 1) {
      ctx.startSelection(e, {
        deselection: e.altKey,
        selection: e.ctrlKey || e.metaKey,
        clear: !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey,
      })
      return
    }
  })
  .on('node:mouseDown', (ctx, e) => {
    if (e.buttons === 1) {
      if (e.shiftKey) return

      if (e.ctrlKey || e.metaKey || e.altKey) {
        e.stopPropagation()
        return
      }
      ctx.startDragginig(e)
      return
    }
  })
  .on('global:mouseMove', (ctx, e) => {
    ctx.updateSelection(e, { deselection: e.altKey, selection: e.ctrlKey || e.metaKey })
    ctx.updateDragging(e)
  })
  .on('global:mouseUp', (ctx, _e) => {
    ctx.stopSelection()
    ctx.stopDragging()
  })
  .configure(ctx => ({
    svgProps: { style },
    staticBefore: [() => <Alphabet size={nodeSize} />],
    staticAfter: [() => <AreaSelection {...ctx.areaSelection.value} shown={ctx.isSelecting} />],
  }))

const Enigraph = factory.create()
const nodes = signal<ComponentProps<typeof factory, 'node'>[]>([
  { id: 5, type: signal('const-tuple'), x: signal(0), y: signal(-80), label: signal('bye') },
  { id: 1, type: signal('const-tuple'), x: signal(70), y: signal(-50), label: signal('cool') },
  { id: 2, type: signal('const-tuple'), x: signal(0), y: signal(0), label: signal('hello') },
])

const result = <Enigraph width={signal(400)} height={signal(400)} nodes={nodes} />

render(result, document.getElementById('app')!)
