import { AsyncLoop, Keyboard, array2D, randomElement, removeElement } from './lib'
import Piece, { Position } from './piece'
import tapes from './sheets'

export default new class TetrisGame {

  private readonly BOARD_WIDTH = 10
  private readonly BOARD_HEIGHT = 20
  private readonly PIECE_COLORS = [ 
    '#eb4438', '#d18d28', 
    '#a7c91c', '#16a83d', 
    '#1658a8', '#4c16a8', 
    '#a81681' 
  ]
  private readonly EMPTY_CELL_COLOR = '#ededed'
  private readonly SPAWN_OFFSET = 2

  private readonly updateLoop: AsyncLoop
  private readonly boardElements: HTMLDivElement[][]
  private readonly scoreElement: HTMLHeadingElement

  private piece: Piece | null = null
  private readonly walls = array2D<string | null>(this.BOARD_HEIGHT, this.BOARD_WIDTH)

  private points = 0
  private set score(value: number) {
    this.points = value
    this.scoreElement.textContent = `Score: ${value}`
  }
  private get score() {
    return this.points
  }

  // initialization

  constructor() {
    this.boardElements = this.mountBoard()
    this.scoreElement = this.mountScore()
    this.updateLoop = new AsyncLoop(this.updateGame, 450)
    this.bindKeys()
    this.startGame()
  }

  private mountBoard = () => {
    const root = document.createElement('main')
    root.classList.add('board-root')
    document.body.appendChild(root)
    const boardElements = new Array<HTMLDivElement[]>(this.BOARD_HEIGHT)
    for (let row = 0; row < this.BOARD_HEIGHT; row++) {
      const boardElementsRow = new Array(this.BOARD_WIDTH)
      for (let col = 0; col < this.BOARD_WIDTH; col++) {
        const element = document.createElement('div')
        element.classList.add('board-cell')
        root.appendChild(element)
        boardElementsRow[col] = element
      }
      boardElements[row] = boardElementsRow
    }
    return boardElements
  }

  private mountScore = () => {
    const scoreElement = document.createElement('h2')
    scoreElement.classList.add('score')
    scoreElement.textContent = 'Score: 0'
    document.body.appendChild(scoreElement)
    return scoreElement
  }

  private bindKeys = () => {
    Keyboard.subscribe(this.startGame, 'r', 'R')

    Keyboard.subscribe(this.movePieceDown, 's', 'S', 'ArrowDown')
    Keyboard.subscribe(this.movePieceRight, 'ArrowRight')
    Keyboard.subscribe(this.movePieceLeft, 'ArrowLeft')

    Keyboard.subscribe(this.rotatePieceRight, 'd', 'D')
    Keyboard.subscribe(this.rotatePieceLeft, 'a', 'A')
  }

  // methods

  private startGame = () => {
    this.walls.forEach(row => row.fill(null))
    this.score = 0
    this.instantiatePiece()
    this.updateDisplay()
    this.updateLoop.restart()
  }

  private updateGame = () => {
    if (Keyboard.isPressed('s', 'S', 'ArrowDown')) return
    this.movePieceDown()
  }

  private instantiatePiece = () => {
    const tape = randomElement(tapes)
    const color = randomElement(this.PIECE_COLORS)
    const position: Position = [-2, ~~(this.BOARD_WIDTH / 2) - this.SPAWN_OFFSET]
    this.piece = new Piece(tape, color, position)
  }

  private updateDisplay = () => {
    for (let row = 0; row < this.BOARD_HEIGHT; row++) {
      for (let col = 0; col < this.BOARD_WIDTH; col++) {
        const maybeColor = this.walls[row][col]
        const element = this.boardElements[row][col]
        element.style.backgroundColor = maybeColor ?? this.EMPTY_CELL_COLOR
      }
    }
    if (!this.piece) return
    for (const [row, col] of this.piece.tiles) {
      if (row < 0 || col < 0 || row >= this.BOARD_HEIGHT || col >= this.BOARD_WIDTH) {
        continue
      }
      const element = this.boardElements[row][col]
      const color = this.piece.color
      element.style.backgroundColor = color
    }
  }

  private isPieceColliding = () => {
    if (!this.piece) return false
    for (const [row, col] of this.piece.tiles) {
      if (col < 0 || row >= this.BOARD_HEIGHT || col >= this.BOARD_WIDTH) {
        return true
      }
      if (row >= 0 && this.walls[row][col]) {
        return true
      }
    }
    return false
  }

  private movePieceDown = () => {
    if (!this.piece) return
    this.piece.moveDown()
    if (!this.isPieceColliding()) {
      this.updateDisplay()
      return
    }

    this.piece.moveUp()

    for (const [row, col] of this.piece.tiles) {
      if (row < 0 || col < 0 || row >= this.BOARD_HEIGHT || col >= this.BOARD_WIDTH) {
        continue
      }
      this.walls[row][col] = this.piece.color
    }

    this.updateDisplay()

    if (this.isExceedingUpperBound()) {
      alert('You lost!')
      this.piece = null
      return
    }

    this.instantiatePiece()
    this.boardCleanup()
  }

  private boardCleanup = () => {
    const completedRows = this.walls.filter(row => {
      for (const each of row) {
        if (!each) return false
      }
      return true
    })
    this.score += completedRows.length * this.BOARD_WIDTH
    for (const row of completedRows) {
      removeElement(this.walls, row)
    }
    for (let i = 0; i < completedRows.length; i++) {
      const emptyRow = new Array(this.BOARD_WIDTH).fill(null)
      this.walls.unshift(emptyRow)
    }
  }

  private movePieceRight = () => {
    if (!this.piece) return
    this.piece.moveRight()
    if (this.isPieceColliding()) {
      this.piece.moveLeft()
    }
    this.updateDisplay()
  }

  private movePieceLeft = () => {
    if (!this.piece) return
    this.piece.moveLeft()
    if (this.isPieceColliding()) {
      this.piece.moveRight()
    }
    this.updateDisplay()
  }

  private rotatePieceRight = () => {
    if (!this.piece) return
    this.piece.rotateRight()
    if (this.isPieceColliding() && !this.tryToKick()) {
      this.piece.rotateLeft()
    }
    this.updateDisplay()
  }

  private rotatePieceLeft = () => {
    if (!this.piece) return
    this.piece.rotateLeft()
    if (this.isPieceColliding() && !this.tryToKick()) {
      this.piece.rotateRight()
    }
    this.updateDisplay()
  }

  private tryToKick = () => {
    if (!this.piece) return false

    this.piece.moveRight()
    if (!this.isPieceColliding()) return true
    this.piece.moveLeft()

    this.piece.moveLeft()
    if (!this.isPieceColliding()) return true
    this.piece.moveRight()

    this.piece.moveUp()
    if (!this.isPieceColliding()) return true
    this.piece.moveDown()

    return false
  }

  private isExceedingUpperBound = () => {
    if (!this.piece) return
    for (const [row, _] of this.piece.tiles) {
      if (row < 0) return true
    }
    return false
  }

}