import Element from 'element'
import state from '../state.js'

class ButtonPopup extends Element
{
  name = "button-popup"

  constructor(piece, func, text)
  {
    super()
    this.piece = piece
    this.func = func
    this.title = text

    this.children = {
      button: {
        props: { innerText: this.title },
        listeners: {
          click: _ => {
            this.func()
          }
        }
      }
    }
  }

  remove = _ => {
    this.node.remove()
    delete this
  }

  postRender = {
    move: _ => {
      this.node.style = `top: ${parseInt(this.piece.node.style.top) - 18}px; left: ${parseInt(this.piece.node.style.left) + 18}px`
    }
  }
}

export default ButtonPopup
