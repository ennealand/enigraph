import { JSX } from 'preact/jsx-runtime'
import style from './menu.module.css'

export type MenuButton = { content: JSX.Element; action: (e: MouseEvent, x: number, y: number) => void }

type Props = { x: number; y: number; buttons: MenuButton[]; leave: () => void; shown: boolean; padding: number }
export const BaseMenu = (props: Props) => {
  if (!props.buttons.length) return null
  return (
    <div
      class={`${style.menu} ${props.shown ? '' : style.hidden}`}
      style={{ transform: `translate(${props.x}px, ${props.y}px) translate(-50%, 18px)` }}
      onMouseLeave={props.leave}
    >
      {props.buttons.map((button, index) => (
        <div key={index} class={style.button} onClick={e => button.action(e, props.x, props.y)}>
          {button.content}
        </div>
      ))}
    </div>
  )
}
