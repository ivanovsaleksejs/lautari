import Element from 'element'
import state from '../state.js'
import config from '../config.json'
import Halo from './halo.js'
import Segment from './segment.js'
import PlayerSide from './playerside.js'
import Piece from './piece.js'
import Cell from './cell.js'
import Popup from './popup.js'
import { charFile, ordFile, capitalize } from '../functions.js'

class PromoCell extends Cell
{
  constructor(c, name, position)
  {
    super()
    this.name = name
    this.position = position
    this.props.innerText = c
    state.cellsData[position].cell = this
  }
}

class Game extends Element
{
  name = "game"

  children = {
    blackside: {
      children: {
        black: new PlayerSide(0),
      }
    },
    mainarea: {
      children: {
        ranger: new PromoCell(config.promotions.ranger.title, "ranger", config.promotions.ranger.position),
        gamearea: {
          children: {
            board: {
              children: Object.fromEntries([
                ["center", {
                  children: {
                    inner: new Halo(2)
                  }
                }],
                ...Object.entries(Array(10).fill().map((_,i) => new Segment((i > 4 ? i + 5 : i)+2, 3)))
              ])
            },
          }
        },
        sentinel: new PromoCell(config.promotions.sentinel.title, "sentinel", config.promotions.sentinel.position)
      }
    },
    whiteside: {
      children: {
        white: new PlayerSide(1)
      }
    },
    ...Object.fromEntries(Object.entries(Array(30).fill().map((_,i) => new Piece(i, state))))
  }

  clearAllowed = _ =>
  {
    for (let cell in state.cellsData) {
      state.cellsData[cell].cell.node.classList.remove('allowed')
    }
  }

  getNeighbourCells = position =>
  {
    let [file, rank] = (s => [s.slice(0,1), s.slice(1)])(position)

    if (file == config.centerFile) {
      return config.files.slice(0, -1)
        .split('')
        .map(s => s + 7)
        .concat(config.files.slice(1)
          .split('')
          .map(s => s + 8)
        )
    }

    let ord = ordFile(file, config.files)
    let [left, right] =
      [
        charFile(ord ? (ord-1) : 1, config.files),
        charFile(ord < 10 ? (ord+1) : 9, config.files)
      ]

    left += file == config.files[0] || file == config.files.slice(-1) || (file == config.files[1] && rank >= 8) || (file == config.files.slice(-1) && rank <= 7)
              ? (15 - rank)
              : rank

    right += file == config.files.slice(-2, -1) && rank <= 7 ? (15 - rank) : rank

    let [top, bottom] =
      [
        rank == 7 ? config.centerFile : (file + (+rank + 1)),
        rank == 8 ? config.centerFile : (file + (+rank - 1))
      ]
    return [left, right, top, bottom]
  }

  checkWinningPosition = _ =>
  {
    let centerPiece = state.cellsData[config.centerFile].piece

    if (centerPiece && centerPiece.role != "pawn") {
      let winningPosition = false
      let centerOwner = centerPiece.owner
      let neighbours = this.getNeighbourCells(config.centerFile)

      for (let neighbour of neighbours) {
        if (state.cellsData[neighbour].piece && state.cellsData[neighbour].piece.owner == centerOwner) {
          let [file, rank] = (s => [s.slice(0,1), s.slice(1)])(neighbour)

          let oppositeFile = charFile(config.files.length - 1 - ordFile(file, config.files), config.files)
          let oppositeRank = 15 - rank
          let opposite = oppositeFile + oppositeRank

          if (state.cellsData[opposite].piece && state.cellsData[opposite].piece.owner == centerOwner) {
            winningPosition = true
            break
          }
        }
      }

      if (winningPosition) {
        if (centerOwner !== null) {
          let color = centerOwner ? "white" : "black"
          let turns = state.gameInfo.center[color] + 1

          state.gameInfo.center[color] = turns
          state.gameInfo.infoTable.generalInfo.status.node.innerText = `${capitalize(color)} holds center for ${turns} turn${turns > 1 ? "s" : ""}`

          if (state.gameInfo.center[color] == 3) {
            return {winner: centerOwner}
          }
        }
      } else {
        state.gameInfo.center["white"] = 0
        state.gameInfo.center["white"] = 0
        state.gameInfo.infoTable.generalInfo.status.node.innerText = ""
      }
    }
    return null
  }

  checkDraw = _ =>
  {
    return state.taken["white"].length > 12 || state.taken["black"].length > 12
  }

  changePlayer = _ =>
  {
    this.clearAllowed()
    state.activePiece = null
    if (state.revived && state.revived.owner != state.activePlayer) {
      state.revived.revived = false
      state.revived = null
    }
    state.activePlayer = ~~!state.activePlayer
    if (state.activePlayer) {
      let result = this.checkWinningPosition()
      if (result && typeof result.winner !== "undefined") {
        this.showPopup(`The winner is ${result.winner ? "White" : "Black"}!`)
        this.endGame()
      }
      if (this.checkDraw()) {
        this.showPopup(`It's a draw!`)
        this.endGame()
      }
      state.gameInfo.turn = state.gameInfo.turn + 1
    }
  }

  endGame = _ =>
  {
    state.active = false
  }

  showPopup = msg =>
  {
    (new Popup(msg)).appendTo(state.root)
  }
}

export default Game
