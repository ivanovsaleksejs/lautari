import Element from 'element'
import state from '../state.js'
import config from '../config.json'
import PieceElement from '../elements/piece.js'
import ButtonPopup from './buttonpopup.js'
import { charFile, ordFile } from '../functions.js'

class Piece extends Element
{
  name = "piece"

  elementClass = PieceElement

  constructor(n, state)
  {
    super()
    this.color = ~~(n > 14)
    this._role = "pawn"
    this.taken = false
    this.owner = this.color
    this.props.className = this.color ? "white" : "black"
    this._position = config.files.slice(3, -3)[n%5] + (n > 14 ? 3 - ~~((n-15)/5) : 14 - ~~(n/5))
    this.updatePosition(this._position)
  }

  bindings = {
    active: {
      set: val =>
      {
        this._active = val
        if (val) {
          this.node.classList.add('active')
        } else {
          this.node.classList.remove('active')
        }
      },
      get: _ => this._active ?? false
    },
    position: {
      set: val =>
      {
        this._position = val
        this.node.setAttribute("position", val)
      },
      get: _ => this._position ?? null
    },
    role: {
      set: val =>
      {
        this._role = val
        this.node.classList.remove(...Object.keys(config.promotions))
        this.node.innerText = ""
        if (val) {
          this.node.classList.add(val)
          if (config.promotions[val].title) {
            this.node.innerText = config.promotions[val].title
          }
        }
      },
      get: _ => this._role
    }
  }

  postRender = {
    attr: piece =>
    {
      setTimeout(_ => piece.node.setAttribute("position", piece.position), 1)
    }
  }

  updatePosition = (position = false) => state.cellsData[position ?? this.position].piece = this

  canMove = _ =>
  {
    return this.allowedCells(this.position).length > 0
  }

  allowedCells = (position, step) =>
  {
    let ret = []
    let finalStep = step >= config.promotions[this.role].steps
    let canJump = config.promotions[this.role].canJump
    if (!step || !finalStep) {
      let neighbours = state.game.getNeighbourCells(position)
      neighbours = neighbours
        .filter(s => canJump && !finalStep
                      ? this.existingCell(s)
                      : (finalStep
                        ? this.allowedCell(s)
                        : this.existingCell(s)
                      )
        )
      ret = neighbours
      for (let neighbour of (canJump && !finalStep ? neighbours : neighbours.filter(s => !this.occupiedCell(s)))) {
        ret = [...new Set([...ret, ...this.allowedCells(neighbour, (step ?? 0) + 1)])]
      }
    }
    return ret.filter(this.allowedCell)
  }

  existingCell = cell => typeof state.cellsData[cell] !== "undefined"

  occupiedCell = cell => !(state.cellsData[cell].piece == null)

  hasOwnPiece = cell => state.cellsData[cell].piece.owner == this.owner

  isRevived = cell => state.cellsData[cell].piece.revived

  allowedCell = cell => this.existingCell(cell) && (!this.occupiedCell(cell) || (!this.hasOwnPiece(cell) && !this.isRevived(cell)))

  isLegalMove = cell =>
  {
    let allowed = this.allowedCells(this.position)
    return !state.cellsData[cell].piece && allowed.indexOf(cell) !== -1
  }

  showAllowed = _ =>
  {
    let allowed = this.allowedCells(this.position)
    for (let cell in allowed) {
      state.cellsData[allowed[cell]].cell.node.classList.add('allowed')
    }
  }

  checkPromotion = _ =>
  {
    if (this.position == config.promotions.ranger.position) {
      this.role = "ranger"
    }
    if (this.position == config.promotions.sentinel.position && !state.sentinels[["black", "white"][this.owner]]) {
      this.role = "sentinel"
      state.sentinels[["black", "white"][this.owner]] = true
    }
  }

  changePosition = (position, taken = false) =>
  {
    state.cellsData[this.position].piece = null
    state.cellsData[position].piece = this

    let data = {}
    if (taken) {
      data.taken = true
    }

    let oldRole = this.role
    let oldPosition =this.position
    this.position = position
    this.checkPromotion()
  
    if (oldRole != this.role) {
      data.promotion = {old: oldRole, new: this.role}
    }
    
    state.gameInfo.logMove([oldPosition, position], "move", data)
    this.active = false

    state.game.changePlayer()
  }

  movePiece = position =>
  {
    if (state.game.buttonPopup) {
      state.game.buttonPopup.remove()
    }
    if (state.activePiece.isLegalMove(position)) {
      this.changePosition(position)
    }
    else if (state.cellsData[position].piece != null) {
      if (state.cellsData[position].piece.owner == state.activePlayer) {
        this.active = false
        state.activePiece = state.cellsData[position].piece
      }
      else {
        if (!state.cellsData[position].piece.revived) {
          let taken = state.cellsData[position].piece
          taken.taken = true

          if (taken.role == "sentinel") {
            state.sentinels[["black", "white"][taken.owner]] = false
          }
          
          taken.role = "pawn"
          taken.previousPosition = position
          taken.position = "X" + (+state.taken[['black', 'white'][taken.owner]].length + 1)
          state.taken[['black', 'white'][taken.owner]].push(taken)
          
          if (+position.slice(1) == 7 || +position.slice(1) == 8) {
            state.gameInfo.centerBackup[taken.owner ? "white" : "black"] = state.gameInfo.center[taken.owner ? "white" : "black"]
          }

          this.changePosition(position, true)
        }
      }
    }
  }

  checkPieceOwner = position =>
    typeof state.cellsData[position] !== "undefined"
      && state.cellsData[position].piece !== null
      && state.cellsData[position].piece.owner == this.owner

  showPopupButton = (func, text) =>
  {
    if (state.game.buttonPopup) {
      state.game.buttonPopup.remove()
    }
    state.game.buttonPopup = new ButtonPopup(this, func, text)
    state.game.buttonPopup.appendTo(this.node.parentNode)
  }

  checkHorsemanPromotion = _ =>
  {
    if (this.role != "pawn") {
      return false
    }

    let [file, rank] = (s => [s.slice(0,1), s.slice(1)])(this.position)
    if (file != "A" && (rank < 4 && this.owner || rank > 11)) {
      return false
    }

    if (file == "A") {
      let neighbours = state.game.getNeighbourCells(this.position)
      for (let neighbour of neighbours) {
        let [nFile, nRank] = (s => [s.slice(0,1), s.slice(1)])(neighbour)
        let opposite = charFile(config.files.length - ordFile(nFile, config.files) - 1, config.files) + (15 - nRank)
        if (this.checkPieceOwner(neighbour) && this.checkPieceOwner(opposite)) {
          return true
        }
      }
      return false
    } else {
      let [left, right, top, bottom] = state.game.getNeighbourCells(this.position)
      return (this.checkPieceOwner(left) && this.checkPieceOwner(right)) || (this.checkPieceOwner(top) && this.checkPieceOwner(bottom))
    }
  }

  checkLastMoveTaken = _ =>
  {
    let lastMove = state.gameInfo.log[state.gameInfo.log.length - 1]
    let neighbours = state.game.getNeighbourCells(this.position)
    return lastMove.data && lastMove.data.taken && neighbours.indexOf(lastMove.move[1]) !== -1
  }

  promoteHorseman = _ =>
  {
    state.game.buttonPopup.remove()
    let oldRole = this.role
    this.role = "horseman"
    this.active = false
    let data = { promotion: { old: oldRole, new: this.role } }

    state.gameInfo.logMove([this.position], "promote", data)
    state.game.changePlayer()
  }

  revive = _ =>
  {
    state.game.buttonPopup.remove()
    let lastMove = state.gameInfo.log[state.gameInfo.log.length - 1]
    let taker = state.cellsData[lastMove.move[1]].piece
    let taken = state.taken[["black", "white"][~~!taker.owner]].pop()

    taker.position = lastMove.move[0]
    taken.position = lastMove.move[1]
    state.cellsData[lastMove.move[0]].piece = taker
    state.cellsData[lastMove.move[1]].piece = taken
    
    taken.taken = false
    taken.revived = true
    state.revived = taken
    this.active = false
    
    state.gameInfo.logMove([this.position], "revive", {taker: lastMove.move[0], taken: lastMove.move[1]})
    state.gameInfo.center[taken.owner ? "white" : "black"] = state.gameInfo.centerBackup[taken.owner ? "white" : "black"]
    state.gameInfo.centerBackup[taken.owner ? "white" : "black"] = 0
    state.game.changePlayer()
  }

  makeActive = _ =>
  {
    this.showAllowed()
    if (this.checkHorsemanPromotion()) {
      this.showPopupButton(this.promoteHorseman, "Promote")
    }
    if (this.role == "sentinel" && this.checkLastMoveTaken()) {
      this.showPopupButton(this.revive, "Revive")
    }
    state.activePiece = this
    this.active = true
  }

  processClick = _ =>
  {
    if (state.game.buttonPopup) {
      state.game.buttonPopup.remove()
    }

    if (!state.activePiece) {
      state.game.clearAllowed()
      if (state.activePlayer == this.owner && this.canMove()) {
        this.makeActive()
      }
    } else {
      if (this.active && state.activePlayer == this.owner) {
        state.game.clearAllowed()
        this.active = false
        state.activePiece = null
      } else {
        if (state.activePlayer == this.owner && this.canMove()) {
          state.game.clearAllowed()
          for (let cell in state.cellsData) {
            if (state.cellsData[cell].piece) {
              state.cellsData[cell].piece.active = false
            }
          }
          this.makeActive()
        }
      }
    }
  }

  listeners = {
    click: this.processClick
  }
}

export default Piece
