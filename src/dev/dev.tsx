import { signal } from '@preact/signals'
import { render } from 'preact'
import { DemoComponentProps, EnigraphDemo } from './graph-demo'
import './style.css'

const nodes = signal<DemoComponentProps<'node'>>([
  { id: 5, type: signal('const-tuple'), x: signal(0), y: signal(-80), label: signal('bye') },
  { id: 1, type: signal('var-norole'), x: signal(70), y: signal(-50), label: signal('cool') },
  { id: 2, type: signal('const-tuple'), x: signal(0), y: signal(0), label: signal('hello') },
])

const App = () => {
  return (
    <div class='playground'>
      <div class='header'>
        <h2>Playground</h2>
        <button>Clear</button>
      </div>
      <EnigraphDemo nodes={nodes}  />
    </div>
  )
}

render(<App />, document.getElementById('app')!)
