import state from './state.js'

class Bot
{
  cellOrder = [
    "A", "B5", "B6", "B7", "B8", "B9", "B10", "D5", "D6", "D7", "D8", "D9", "D10",
    "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12", "E13", "E14",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14",
    "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12", "G13", "G14",
    "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12", "H13", "H14",
    "I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I9", "I10", "I11", "I12", "I13", "I14",
    "K5", "K6", "K7", "K8", "K9", "K10", "L5", "L6", "L7", "L8", "L9", "L10",
    "R4", "R5", "R6", "R7", "S8", "S9", "S10", "S11"
  ]

  pieceCodes = {
    "white pawn": "A",
    "black pawn": "B",
    "white infantry": "C",
    "black infantry": "D",
    "white rider": "E",
    "black rider": "F",
    "white sentinel": "G",
    "black sentinel": "H"
  }

  roleWeights = {
    "pawn": 0,
    "infantry": 2,
    "rider": 4,
    "sentinel": 6
  }

  upgradeProximityWeights = {
    "R5": 3,
    "R6": 2, "B5": 2, "B10": 2,
    "R7": 1, "B6": 1, "B9": 1, "D5": 1, "D10": 1,
    "S10": 4,
    "S9": 3, "L5": 3, "L10": 3,
    "S8": 2, "L6": 2, "L9": 2, "K5": 2, "K10": 2,
    "A": 1, "L7": 1, "L8": 1, "K6": 1, "K9": 1, "I5": 1, "I10": 1
  }

  constructor()
  {
    this.reversePieceCodes = Object.fromEntries(
      Object.entries(this.pieceCodes).map(([k, v]) => [v, k])
    )
  }

  parsePosition = pieces => Object.entries(pieces)
        .filter(([_, value]) => value.piece !== null)
        .map(([cell, v]) => (
          {
            cell: cell,
            color: ["black", "white"][v.piece.color],
            role: v.piece.role
          }
        ))
        .sort((a, b) => this.cellOrder.indexOf(a.cell) - this.cellOrder.indexOf(b.cell))

  encodePosition = (pieces, currentPlayer) =>
  {
    pieces = this.parsePosition(pieces)

    let hash = ""
    let prevIndex = 0
    let notFirst = 0

    for (const piece of pieces) {
      const index = this.cellOrder.indexOf(piece.cell)
      const steps = index - prevIndex - notFirst
      notFirst = 1
      prevIndex = index

      hash += (steps > 0 ? steps.toString() : "") + this.pieceCodes[`${piece.color} ${piece.role}`]
    }

    return currentPlayer + hash
  }

  decodePosition = hash =>
  {
    let pieces = []
    let i = 0, currentIndex = 0, player = +hash.slice(0, 1)
    hash = hash.slice(1)

    while (i < hash.length) {
      let steps = 0

      while (i < hash.length && !this.reversePieceCodes[hash[i]]) {
        steps = steps * 10 + parseInt(hash[i])
        i++
      }

      currentIndex += steps

      const cell = this.cellOrder[currentIndex++]
      const pieceCode = hash[i++]
      const [color, role] = this.reversePieceCodes[pieceCode].split(" ")

      pieces.push({ color, role, cell })
    }

    return [player, pieces]
  }

  checkUpgradeProximity

  calculatePiece = (role, position, color, cellData) =>
  {
    let weight = 0
    let [file, line] = [position.slice(0, 1), +position.slice(1)]
    let lineWeight = file == "A"
      ? this.roleWeights[role] * 2
      : line > 7 ? (14 - line) : line - 1
    weight += lineWeight

    let roleWeight = this.roleWeights[role]

    if (role == "pawn" && state.cellsData[position].piece.checkInfantryPromotion()) {
      roleWeight += 1
    }

    if (role != "rider" && role != "sentinel" && this.upgradeProximityWeights[position]) {
      roleWeight += this.upgradeProximityWeights[position]
    }

    weight += roleWeight

    return color == "white" ? weight : -weight
  }

  calculatePosition = pieces =>
  {
    let position = 0
    let playersWeights = [0, 0]
    pieces = this.parsePosition(pieces)
    for (let piece of pieces) {
      let color = ~~(piece.color == "white")
      let weight = this.calculatePiece(piece.role, piece.cell, piece.color, pieces)
      position += weight
      playersWeights[color] += (color * 2 - 1) * weight
    }

    return [position, playersWeights]
  }
}

export default Bot
