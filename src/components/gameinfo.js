import Element from 'element'
import state from '../state.js'
import config from '../config.json'
import Tutorial from './tutorial.js'
import initGame from '../game.js'

class LogMove extends Element
{
  name = "log-move"

  constructor(move)
  {
    super()
    this.props.innerText = move
  }
}

class LogSeparator extends Element
{
  name = "log-separator"

  props = { innerText: " - " }
}

class LogEntry extends Element
{
  name = "log-entry"

  constructor(move)
  {
    super()
    this.children = {
      [0]: new LogMove(move)
    }
  }
}

class GameInfo extends Element
{
  name = "game-info"

  constructor()
  {
    super()
    this._turn = 1
    this._hash = ""
    this.currentLog = null
    this.log = []
  }

  bindings = {
    turn: {
      set: val => {
        this.infoTable.generalInfo.turnNumber.node.innerText = val
        this._turn = val
      },
      get: _ => { return this._turn }
    },
    hash: {
      set: val => {
        this.infoTable.generalInfo.hash.node.value = val
        this._hash = val
      },
      get: _ => { return this._hash }
    }
  }

  moveInfo = (move, type, data) => move.join(" ")
      + (data.taken
        ? (type == "revive" ? ("+" + data.taker + "," + data.taken) : "x")
        : ""
      )
      + (data.promotion ? ("^" + data.promotion.new[0].toUpperCase()) : "")

  logMove = (move, type, data) =>
  {
    let moveInfo = this.moveInfo(move, type, data)
    this.log.push({
      turn: this.turn,
      player: state.activePlayer,
      move: move,
      type: type,
      data: data
    })
    if (this.currentLog) {
      (new LogSeparator()).appendTo(this.currentLog),
      (new LogMove(moveInfo)).appendTo(this.currentLog)
      this.currentLog = null
    }
    else {
      this.currentLog = new LogEntry(moveInfo)
      this.currentLog.appendTo(this.infoTable.turnLog)
    }
    this.hash = state.bot.encodePosition(state.cellsData, ~~!state.activePlayer)
    let evaluation = state.bot.calculatePosition(state.cellsData)
    let blacksEvaluation = evaluation[1][0] * 1020/(evaluation[1][0] + evaluation[1][1])
    state.gameInfo.evaluation.blacks.node.style.height = blacksEvaluation + "px"
    //console.log(this.hash)
    //console.log(state.bot.decodePosition(this.hash))
  }

  showTutorial = _ =>
  {
    (new Tutorial).appendTo(state.root)
  }

  children = {
    evaluation: {
      children: {
        blacks: {}
      }
    },
    infoTable: {
      children: {
        options: {
          children: {
            help: {
              listeners: {
                click: _ => { this.showTutorial() }
              }
            }
          }
        },
        generalInfo: {
          children: {
            hash: {
              name: "input",
              listeners: {
                change: e => {
                  setTimeout(_ => {initGame(e.target.value)}, 10)
                }
              }
            },
            turnNumber: { props: { innerText: 1 } },
          }
        },
        turnLog: {}
      }
    }
  }
}

export default GameInfo
