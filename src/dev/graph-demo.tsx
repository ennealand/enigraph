import { Alphabet } from '$lib/components/scg/alphabet'
import { BasicNodeProps, Node } from '$lib/components/scg/node'
import { ComponentNames, ComponentProps, EnigraphFactory } from '$lib/graph/factory'
import { withAutohide } from '$lib/plugins/autohide'
import { withAutosize } from '$lib/plugins/autosize'
import { withDraggable } from '$lib/plugins/draggable'
import { withMovable } from '$lib/plugins/movable'
import { RenamingArea, withRenaming } from '$lib/plugins/renaming'
import { AreaSelection, withSelection } from '$lib/plugins/selection'
import { signal, useComputed } from '@preact/signals'

export const demoSVGStyle = signal('background:skyblue')
const nodePadding = signal(10)
const nodeSize = signal(10)

const factory = new EnigraphFactory()
  .add('node', (props: BasicNodeProps) => <Node {...props} padding={nodePadding} />)
  .plug(withAutosize)
  .plug(withMovable)
  .plug(withSelection)
  .plug(() => {
    const changeNodePosition = (node: BasicNodeProps, x: number, y: number) => {
      node.x.value = x
      node.y.value = y
    }
    const changeNodeLabel = (node: BasicNodeProps, label: string) => {
      node.label!.value = label
    }
    return { changeNodePosition, changeNodeLabel }
  })
  .plug(withDraggable)
  .plug(withAutohide)
  .plug(withRenaming)
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
  .on('node:textDoubleClick', (ctx, { id }) => {
    ctx.startRenaming(ctx.nodes.value.find(n => n.id === id)!)
  })
  .on('node:sharedProps', (ctx, id) => ({
    selected: useComputed(() => ctx.selection.value.has(id)),
    renaming: useComputed(() => ctx.renamingNode.value?.id === id),
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
    svgProps: { style: demoSVGStyle },
    staticBefore: [() => <Alphabet size={nodeSize} />],
    staticAfter: [() => <AreaSelection {...ctx.areaSelection.value} shown={ctx.isSelecting} />],
    htmlAfter: [() => <RenamingArea data={ctx.renamingProps} />],
  }))

export const EnigraphDemo = factory.create()
export type DemoComponentProps<Name extends ComponentNames<typeof factory>> = ComponentProps<typeof factory, Name>[]
