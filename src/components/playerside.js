import Element from 'element'
import Cell from './cell.js'

class Row extends Element
{
  name = "row"

  constructor(row)
  {
    super()
    this.children = {
      [0]: new Cell("E" + row),
      [1]: new Cell("F" + row),
      [2]: new Cell("G" + row),
      [3]: new Cell("H" + row),
      [4]: new Cell("I" + row)
    }
  }
}

class PlayerSide extends Element
{
  constructor(player)
  {
    super()
    this.player = player

    this.children = {
      [0] : new Row((1 - player) * 11 + 3),
      [1] : new Row((1 - player) * 11 + 2),
      [2] : new Row((1 - player) * 11 + 1),
    }
  }
}

export default PlayerSide
