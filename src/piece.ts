import type { PieceStateTape } from './sheets'
import type { Mutable } from './lib'

export type Position = readonly [number, number]

export default class Piece {

  private stateIndex = 0

  constructor (
    private readonly stateTape: PieceStateTape,
    public readonly color: string,
    private coordinates: Position
  ) {}

  get currentState() {
    return this.stateTape[this.stateIndex]
  }

  get previousState() {
    if (this.stateIndex <= 0) {
      return this.stateTape[this.stateTape.length - 1]
    }
    return this.stateTape[this.stateIndex - 1]
  }

  get nextState() {
    if (this.stateIndex >= this.stateTape.length - 1) {
      return this.stateTape[0]
    }
    return this.stateTape[this.stateIndex + 1]
  }

  get position() {
    return this.coordinates
  }

  private set position(value: Position) {
    this.coordinates = value
  }

  // here I want to allow in-place mutation

  moveRight() {
    (this.position as Mutable<Position>)[1]++
  }

  moveLeft() {
    (this.position as Mutable<Position>)[1]--
  }

  moveDown() {
    (this.position as Mutable<Position>)[0]++
  }

  //

  rotateRight() {
    this.stateIndex = 
      this.stateIndex >= this.stateTape.length - 1
        ? 0
        : this.stateIndex + 1
  }

  rotateLeft() {
    this.stateIndex = 
      this.stateIndex <= 0
        ? this.stateTape.length - 1
        : this.stateIndex - 1
  }

}