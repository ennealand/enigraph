import { useSignal } from '@preact/signals'

export const withModifiers = () => {
  const altKey = useSignal(false)
  const cmdKey = useSignal(false)
  const shiftKey = useSignal(false)

  const modifiers = { cmdKey, altKey, shiftKey }
  return { modifiers }
}
