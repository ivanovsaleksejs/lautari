import Element from 'element'

class Popup extends Element
{
  name = "popup"

  constructor(msg)
  {
    super()
    this.children.msg.props = { innerHTML: msg }
  }

  children = {
    msg: {},
    closeButton: {
      listeners: {
        click: _ => {
          this.remove()
        }
      }
    }
  }

  remove = _ =>
  {
    this.node.remove()
    delete this
  }
}

export default Popup
