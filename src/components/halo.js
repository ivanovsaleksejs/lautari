import Element from 'element'
import Segment from './segment.js'
import Cell from './cell.js'
import state from '../state.js'
import config from '../config.json'

class Ari extends Cell
{
  name = "halo"

  props = {
    className: "small",
  }

  position = config.centerFile

  postRender = {
    attr: _ => {
      this.node.setAttribute("position", this.position)
      state.cellsData[this.position].cell = this
    }
  }
}

class Halo extends Element
{
  name = "halo"

  constructor(n)
  {
    super()

    this.props.className = n == 2 ? "outer" : (n ? "" : "inner")

    this.children = {
      outer: {
        children: {
          div: {
            children: {
              inner: {
                children: Object.fromEntries([
                  ...Object.entries(Array(20).fill().map((_,i) => new Segment(i, n))),
                  ...[["halo", n ? new Halo(n-1) : new Ari]]
                ])
              }
            }
          }
        }
      }
    }
  }
}

export default Halo
