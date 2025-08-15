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

  constructor(n, state, position = null, role = "pawn", color = null)
  {
    super()
    this.color = color !== null
      ? color
      // For initial position, first 15 pieces are black
      : ~~(n > 14)
    this._role = role
    this.taken = false
    this.owner = this.color
    this.props.className = this.color ? "white" : "black"
    this._position = position
      ? position
      // Place piece in home area
      : config.files.slice(3, -3)[n%5] + (n > 14 ? 3 - ~~((n-15)/5) : 14 - ~~(n/5))
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
      setTimeout(_ => {
        piece.role = piece._role
        piece.node.setAttribute("position", piece.position)
      }, 1)
    }
  }

  updatePosition = (position = false) => state.cellsData[position ?? this.position].piece = this

  canMove = _ =>
  {
    return this.allowedCells(this.position).length > 0
  }

  allowedCells = (position, step, isRevive = false) =>
  {
    let ret = []
    let finalStep = step >= (isRevive ? config.promotions[this.role].reviveSteps : config.promotions[this.role].steps)
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
        ret = [...new Set([...ret, ...this.allowedCells(neighbour, (step ?? 0) + 1, isRevive)])]
      }
    }
    return ret.filter(this.allowedCell)
  }

  existingCell = cell => typeof state.cellsData[cell] !== "undefined"

  occupiedCell = cell => !(state.cellsData[cell].piece == null)

  hasOwnPiece = cell => state.cellsData[cell].piece.owner == this.owner

  isRevived = cell => state.cellsData[cell].piece.revived

  hasImmunity = cell => config.promotions[state.cellsData[cell].piece.role].centerImmunity

  allowedCell = cell => this.existingCell(cell)
    && (
      !this.occupiedCell(cell)
      || (
        !this.hasOwnPiece(cell)
        && (
          !this.isRevived(cell)
          && (cell !== config.centerFile || (!this.hasImmunity(cell) || config.promotions[this.role].ignoreImmunity || state.revived))
        )
      )
    )

  isLegalMove = cell =>
  {
    let allowed = this.allowedCells(this.position)
    return !state.cellsData[cell].piece && allowed.indexOf(cell) !== -1
  }

  isLegalTake = cell =>
  {
    let allowed = this.allowedCells(this.position)
    return allowed.indexOf(cell) !== -1 && state.cellsData[cell].piece && state.cellsData[cell].piece.owner != this.owner
  }

  showAllowed = _ =>
  {
    let allowed = this.allowedCells(this.position)
    for (let cell in allowed) {
      state.cellsData[allowed[cell]].cell.node.classList.add('allowed')
    }
    if (this.role == "sentinel") {
      let reviveAllowed = this.allowedCells(this.position, 0, true)
      for (let cell in reviveAllowed) {
        state.cellsData[reviveAllowed[cell]].cell.node.classList.add('revive-allowed')
      }
    }
  }

  checkPromotion = _ =>
  {
    if (this.position == config.promotions.rider.position) {
      if (this.role == "sentinel") {
        state.sentinels[["black", "white"][this.owner]] = false
      }
      this.role = "rider"
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
    let [file, rank] = (s => [s.slice(0,1), s.slice(1)])(this.position)
    if (state.homeRowsMoved[this.owner][rank] && config.files.slice(3,8).indexOf(file) != -1) {
      state.homeRowsMoved[this.owner][rank][config.files.slice(3,8).indexOf(file)] = true
    }

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

    state.gameInfo.logMove([oldPosition.toLowerCase(), position.toLowerCase()], "move", data)
    this.active = false

    state.game.changePlayer()
  }

  movePiece = position =>
  {
    if (state.game.buttonPopup) {
      state.game.buttonPopup.remove()
    }
    if (this.isLegalMove(position)) {
      this.changePosition(position)
    }
    else if (state.cellsData[position].piece != null) {
      if (state.cellsData[position].piece.owner == state.activePlayer) {
        this.active = false
        state.activePiece = state.cellsData[position].piece
      }
      else {
        if (this.isLegalTake(position) && !state.cellsData[position].piece.revived) {
          let taken = state.cellsData[position].piece
          taken.taken = true

          if (taken.role == "sentinel") {
            state.sentinels[["black", "white"][taken.owner]] = false
          }

          taken.role = "pawn"
          taken.previousPosition = position
          taken.position = "X" + (+state.taken[['black', 'white'][taken.owner]].length + 1)
          state.taken[['black', 'white'][taken.owner]].push(taken)

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

  checkInfantryPromotion = _ =>
  {
    if (this.role != "pawn") {
      return false
    }

    let [file, rank] = (s => [s.slice(0,1), s.slice(1)])(this.position)
    if (file != "A" && (state.homeRowsMoved[this.owner][rank] && !state.homeRowsMoved[this.owner][rank].every(Boolean))) {
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

  canRevive = _ =>
  {
    let lastMove = state.gameInfo.log[state.gameInfo.log.length - 1]
    let neighbours = this.allowedCells(this.position, 0, true)
    return lastMove.data && lastMove.data.taken && lastMove.type !== "revive" && neighbours.indexOf(lastMove.move[1].toUpperCase()) !== -1
  }

  promoteInfantry = _ =>
  {
    state.game.buttonPopup.remove()
    let oldRole = this.role
    this.role = "infantry"
    this.active = false
    let data = { promotion: { old: oldRole, new: this.role } }

    state.gameInfo.logMove([this.position.toLowerCase()], "promote", data)
    state.game.changePlayer()
  }

  revive = _ =>
  {
    state.game.buttonPopup.remove()
    let lastMove = state.gameInfo.log[state.gameInfo.log.length - 1]
    let taker = state.cellsData[lastMove.move[1].toUpperCase()].piece
    let taken = state.taken[["black", "white"][~~!taker.owner]].pop()

    taker.position = lastMove.move[0].toUpperCase()
    taken.position = lastMove.move[1].toUpperCase()
    state.cellsData[lastMove.move[0].toUpperCase()].piece = taker
    state.cellsData[lastMove.move[1].toUpperCase()].piece = taken
    if (lastMove.data.promotion && lastMove.data.promotion.old) {
      taker.role = lastMove.data.promotion.old
    }

    taken.taken = false
    taken.revived = true
    state.revived = taken
    this.active = false

    state.gameInfo.logMove([this.position.toLowerCase()], "revive", {taker: lastMove.move[0], taken: lastMove.move[1]})
    state.game.changePlayer()
  }

  makeActive = _ =>
  {
    this.showAllowed()
    if (this.checkInfantryPromotion()) {
      this.showPopupButton(this.promoteInfantry, "Promote")
    }
    if (this.role == "sentinel" && this.canRevive()) {
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
      if (state.activePlayer == this.owner && (this.canMove() || this.checkInfantryPromotion())) {
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
        else if (state.activePlayer != this.owner && state.activePiece) {
          state.activePiece.movePiece(this.position)
        }
      }
    }
  }

  listeners = {
    click: this.processClick
  }
}

export default Piece
