import { simulate } from './simulation'

self.onmessage = async e => {
  console.log('start')
  simulate(e.data, { animate: false })
  console.log('finish')

  postMessage(e.data)
}
