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
      if (state.cellsData[position].piece && state.cellsData[position].piece.owner == state.activePlayer && (!state.activePiece || state.activePiece.position !== position)) {
        state.game.clearAllowed()
        if (state.activePiece) {
          state.activePiece.active = false
        }
        state.activePiece = null
        state.cellsData[position].piece.makeActive()
      }
      else if (state.activePiece && state.activePiece.canMove(position)) {
        state.activePiece.movePiece(position)
      }
    }
  }
}

export default Cell
