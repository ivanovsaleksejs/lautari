import Element from 'element'
import state from '../state.js'

class Cell extends Element
{
  name = "cell"

  constructor(position = false)
  {
    super()
    if (position !== false) {
      this.position = position
      state.cellsData[position].cell = this
    }
  }

  listeners = {
    click: _ =>
    {
      let position = this.position
      if (state.activePiece) {
        state.activePiece.movePiece(position)
      }
    }
  }
}

export default Cell
