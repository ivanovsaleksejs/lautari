import Element from 'element'
import state from '../state.js'
import config from '../config.json'
import Tutorial from './tutorial.js'

class LogMove extends Element
{
  name = "log-move"

  constructor(move)
  {
    super()
    this.props.innerText = move
  }
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
    this.center = {
      white: 0,
      black: 0
    }
    this.centerBackup = {
      white: 0,
      black: 0
    }
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
    }
  }

  moveInfo = (move, type, data) =>
    move + (
      data.taken
        ? (type == "revive" ? `*${data.taker}, ${data.taken}` : "x")
        : (data.promotion ? `^${data.promotion.new[0]}` : "")
    )

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
      (new LogMove(moveInfo)).appendTo(this.currentLog)
      this.currentLog = null
    }
    else {
      this.currentLog = new LogEntry(moveInfo)
      this.currentLog.appendTo(this.infoTable.turnLog)
    }
  }

  showTutorial = _ =>
  {
    (new Tutorial).appendTo(state.root)
  }

  children = {
    options: {
      children: {
        help: {
          listeners: {
            click: _ => { this.showTutorial() }
          }
        }
      }
    },
    infoTable: {
      children: {
        generalInfo: {
          children: {
            turnNumber: { props: { innerText: 1 } },
            status: {},
          }
        },
        turnLog: {}
      }
    }
  }
}

export default GameInfo
