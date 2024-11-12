import state from '../state.js'
import config from '../config.json'
import { charFile, ordFile } from '../functions.js'

class PieceElement extends HTMLElement {
  observableAttributes = {
    position: this.renderPosition.bind(this)
  }
  constructor() {
    super()
  }
  connectedCallback() {
    const targetElement = this

    const observer = new MutationObserver(
      (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          let name = mutation.attributeName
          if (mutation.type === "attributes" && this.observableAttributes[name]) {
            this.observableAttributes[name]()
          }
        }
      }
    )

    observer.observe(targetElement, { attributes: true })
  }
  renderPosition ()
  {
    let x = 0
    let y = 0
    if (this.component.taken) {
      let rank = this.getAttribute("position").slice(1)
      x = rank > 6 ? 559 : 5
      y = this.component.owner ? (((rank - 1) % 6) * 40 + 5) : (975 - ((rank - 1) % 6) * 40)
    }
    else {
      let [file, rank] = (s => [s.slice(0,1), s.slice(1)])(this.getAttribute("position"))
      let isStart = (file >= config.firstHomeFile && file <= config.lastHomeFile) && (rank <= 3 || rank >= 12)

      x = (ordFile(file, config.files) - ordFile(config.firstHomeFile, config.files)) * 100 + 82
      y = rank > 4 ? ((14 - rank) * 70 + 15) : (1020 - rank * 70 + 20)

      if (!isStart) {
        let xShift = ordFile(file, config.files) - ordFile(config.firstHomeFile, config.files) - 2
        let yShift = (rank - 8 + (rank > 7))
        let c = [269, 204, 143, 99][4-Math.abs(yShift)]

        let angle = Math.abs(xShift) * Math.PI / 10
        let pieceOffset = (file == config.files[0] && rank == 4 ? 25 : (file == config.files.slice(-1) && rank == 11 ? 11 : 18))

        let xOffset = c * Math.sin(angle) * (xShift >= 0 ? 1 : (-1)) - pieceOffset
        let yOffset = c * Math.cos(angle) * (yShift >= 0 ? 1 : (-1)) + 18

        x = 300 + (xOffset || -17)
        y = 510 - (yOffset || 17)
      }
    }
    this.style.left = x + "px"
    this.style.top = y + "px"
  }
}

export default PieceElement
