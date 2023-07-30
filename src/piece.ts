import type { PieceStateTape } from './sheets'
import type { Mutable } from './lib'

export type Position = readonly [number, number]

export default class Piece {

  private stateIndex = 0

  constructor (
    private readonly stateTape: PieceStateTape,
    public readonly color: string,
    private position: Position
  ) {}

  // returns global positions of tiles
  get tiles() {
    const state = this.stateTape[this.stateIndex]
    const tilePositions = new Array<Position>()
    const [globalRow, globalColumn] = this.position
    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state[row].length; col++) {
        if (!state[row][col]) continue
        tilePositions.push([ row + globalRow, col + globalColumn ])
      }
    }
    return tilePositions
  }

  // here I want to allow in-place mutation

  moveRight = () => {
    (this.position as Mutable<Position>)[1]++
  }

  moveLeft = () => {
    (this.position as Mutable<Position>)[1]--
  }

  moveDown = () => {
    (this.position as Mutable<Position>)[0]++
  }

  moveUp = () => {
    (this.position as Mutable<Position>)[0]--
  }

  //

  rotateRight = () => {
    this.stateIndex = 
      this.stateIndex >= this.stateTape.length - 1
        ? 0
        : this.stateIndex + 1
  }

  rotateLeft = () => {
    this.stateIndex = 
      this.stateIndex <= 0
        ? this.stateTape.length - 1
        : this.stateIndex - 1
  }

}