import { Alphabet } from '$lib/components/scg/alphabet'
import { BasicNodeProps, Node } from '$lib/components/scg/node'
import { ComponentProps, EnigraphFactory } from '$lib/graph/factory'
import { withAutohide } from '$lib/plugins/autohide'
import { withDraggable } from '$lib/plugins/draggable'
import { withMovable } from '$lib/plugins/movable'
import { AreaSelection, withSelection } from '$lib/plugins/selection'
import { signal, useComputed } from '@preact/signals'
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
        inversion: true,
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
  .on('node:sharedProps', (ctx, id) => ({
    selected: useComputed(() => ctx.selection.value.has(id)),
  }))
  .on('global:mouseMove', (ctx, e) => {
    ctx.updateSelection(e, { inversion: true, deselection: e.altKey, selection: e.ctrlKey || e.metaKey })
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

const App = () => {
  return (
    <div class='app'>
      <Enigraph width={signal(400)} height={signal(400)} nodes={nodes} />
      <div class='controls'>
        <button class='button' onClick={() => (style.value = 'background:skyblue')}>
          Skyblue
        </button>
        <button class='button' onClick={() => (style.value = 'background:lightblue')}>
          Lightblue
        </button>
        <button class='button' onClick={() => (style.value = 'background:blue')}>
          Blue
        </button>
        <button class='button' onClick={() => (style.value = 'background:green')}>
          Green
        </button>
        <button class='button' onClick={() => (style.value = 'background:red')}>
          Red
        </button>
      </div>
    </div>
  )
}

render(<App />, document.getElementById('app')!)
