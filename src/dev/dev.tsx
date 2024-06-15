import { EnigraphFactory } from '$lib/graph/factory'
import { signal } from '@preact/signals'
import { render } from 'preact'

const Enigraph = new EnigraphFactory()
  .add('node', (props: { id: number; xyz: string }) => <text>{props.xyz}</text>)
  .create()

const result = <Enigraph width={signal(400)} height={signal(400)} nodes={signal([{ id: 0, xyz: 'hello' }])} />

render(result, document.getElementById('app')!)
