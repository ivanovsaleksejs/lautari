import Root from './components/root.js'
import Game from './components/game.js'
import GameInfo from './components/gameinfo.js'
import state from './state.js'
import config from './config.json'
import Bot from './bot.js'
import WebSocketClient from './ws.js'

const initFile = (n, file, lastFile, longFile, horiz) =>
  [
    file + (n + (
      longFile
        ? 1
        : (horiz
          ? (file == lastFile ? 8 : 4)
          : 5
        )
    )), { cell : null, piece : null }
  ]

const initCells = _ =>
  Object.fromEntries([[config.centerFile, {cell : null, piece : null}]]
    .concat(
      ...(config.files.split("").map(
        file => {
          let [firstFile, lastFile] = [config.files[0], config.files.slice(-1)]

          let longFile = file >= config.firstHomeFile && file <= config.lastHomeFile
          let horiz = file == firstFile || file == lastFile

          return Array(longFile ? 14 : (horiz ? 4 : 6))
            .fill()
            .map((_, n) => initFile(n, file, lastFile, longFile, horiz))
        }
      ))
    )
  )

const initGame = hash =>
{

  if (!state.ws) {
    //state.ws = new WebSocketClient(config.serverUrl)
  }

  state.bot = new Bot

  let gameData = null
  if (hash) {
    gameData = state.bot.decodePosition(hash)
  }

  state.cellsData = initCells()
  state.taken = {
    black: [],
    white: []
  }
  state.sentinels = {
    black: false,
    white: false
  }
  state.homeRowsMoved = {
    [0]: {
      [12]: Array(5).fill(false),
      [13]: Array(5).fill(false),
      [14]: Array(5).fill(false),
    },
    [1]: {
      [3]: Array(5).fill(false),
      [2]: Array(5).fill(false),
      [1]: Array(5).fill(false),
    }
  }

  state.activePiece = null
  state.activePlayer = 1
  state.revived = null
  state.active = true

  if (state.game) {
    state.game.node.remove()
    state.gameInfo.node.remove()

    delete state.game
    delete state.gameInfo
  }

  state.game = new Game(gameData)

  state.gameInfo = new GameInfo

  if (!state.root) {
    state.root = new Root
  }
  state.root.children.content.children.game = state.game
  state.root.children.content.children.rightSide.children.info = state.gameInfo
  state.root.appendTo(state.document)

  state.gameInfo.turn = 1
  //state.bot.encodePosition(state.cellsData, state.activePlayer)
}

export default initGame
