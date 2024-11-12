import Cell from './cell.js'
import state from '../state.js'
import config from '../config.json'

class Segment extends Cell
{
  name = "segment"

  constructor(n, halo = 0)
  {
    super()
    this.rotation = n
    this.skew = 72,
    this.offset = 18
    this.props.className = "field" + ((halo + n) % 2 ? " dark" : "")

    this.position = (n == 9
                      ? config.files[0]
                      : (n == 19
                        ? config.files.slice(-1)
                        : config.files.slice(1, -1)[8 - (n < 9 ? n : 18 - n)]
                      )
                    ) + (n < 10 ? (7 - halo) : (8 + halo))

    state.cellsData[this.position].cell = this

  }

  postRender = {
    attr: segment => {
      ['offset', 'rotation', 'skew', 'position'].map(a => segment.node.setAttribute(a, segment[a]))
      segment.node.style.transform = `rotate(${(this.offset * this.rotation + this.offset/2).toFixed(2)}deg) skew(${this.skew.toFixed(2)}deg)`
    }
  }
}

export default Segment
