import { Alphabet } from '$lib/components/scg/alphabet'
import { BasicEdgeProps, Edge } from '$lib/components/scg/edge'
import { BasicNodeProps, Node } from '$lib/components/scg/node'
import { ComponentNames, ComponentProps, EnigraphFactory } from '$lib/graph/factory'
import { withAutohide } from '$lib/plugins/autohide'
import { withAutosize } from '$lib/plugins/autosize'
import { createDiskComponent, getEdgeProps, getNodeProps, withDisk } from '$lib/plugins/disk'
import { withDraggable } from '$lib/plugins/draggable'
import { withMovable } from '$lib/plugins/movable'
import { RenamingArea, withRenaming } from '$lib/plugins/renaming'
import { AreaSelection, withSelection } from '$lib/plugins/selection'
import { signal, useComputed } from '@preact/signals'

const nodeSize = signal(10)

const factory = new EnigraphFactory()
  .add('edge', (props: BasicEdgeProps) => <Edge {...props} />)
  .add('node', (props: BasicNodeProps) => <Node {...props} />)
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
    const diskComponents = {
      nodes: createDiskComponent({
        component: Node,
        types: ['var-norole', 'var-norole'],
        factory: getNodeProps,
      }),
      edges: createDiskComponent({
        component: Edge,
        types: ['var-norole', 'var-norole'],
        factory: getEdgeProps,
      }),
    }
    return { changeNodePosition, changeNodeLabel, diskComponents }
  })
  .plug(withDraggable)
  .plug(withAutohide)
  .plug(withRenaming)
  .plug(withDisk)
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
  .on('edge:sharedProps', (ctx, { sourceId, targetId }) => ({
    selected: useComputed(() => ctx.selection.value.has(sourceId) || ctx.selection.value.has(targetId)),
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
    staticBefore: [() => <Alphabet size={nodeSize} />],
    staticAfter: [() => <AreaSelection {...ctx.areaSelection.value} shown={ctx.isSelecting} />],
    htmlAfter: [() => <RenamingArea data={ctx.renamingProps} />],
  }))

export const EnigraphDemo = factory.create()
export type DemoComponentProps<Name extends ComponentNames<typeof factory>> = ComponentProps<typeof factory, Name>[]
