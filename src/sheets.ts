const PIECE_I = `
  ....|..0.|....|.0..
  0000|..0.|....|.0..
  ....|..0.|0000|.0..
  ....|..0.|....|.0..
`

const PIECE_J = `
  0..|.00|...|.0.
  000|.0.|000|.0.
  ...|.0.|..0|00.
`

const PIECE_L = `
  ..0|.0.|...|00.
  000|.0.|000|.0.
  ...|.00|0..|.0.
`

const PIECE_O = `
  00
  00
`

const PIECE_S = `
  .00|.0.|...|0..
  00.|.00|.00|00.
  ...|..0|00.|.0.
`

const PIECE_T = `
  .0.|.0.|...|.0.
  000|.00|000|00.
  ...|.0.|.0.|.0.
`

const PIECE_Z = `
  00.|..0|...|.0.
  .00|.00|00.|00.
  ...|.0.|.00|0..
`

const ALL_PIECES = [
  PIECE_I, PIECE_J,
  PIECE_L, PIECE_O,
  PIECE_S, PIECE_T,
  PIECE_Z
]

export type PieceState = readonly boolean[][]
export type PieceStateTape = Array<PieceState>

function sheetToStateTape(sheet: string) {
  const lines = sheet
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.split('|'))
  // lines.length       --> state height
  // lines[0].length    --> amount of states
  // lines[0][0].length --> state width
  const tape: PieceStateTape = new Array(lines[0].length)
  for (let stateIndex = 0; stateIndex < lines[0].length; stateIndex++) {
    const state: PieceState = lines
      .map(line => [...line[stateIndex]]
        .map(character => character === '0'))
    tape[stateIndex] = state
  }
  return tape
}

export default ALL_PIECES.map(sheetToStateTape)