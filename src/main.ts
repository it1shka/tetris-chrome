import { AsyncLoop, Keyboard } from './lib'

export default new class TetrisGame {

  private readonly BOARD_WIDTH = 10
  private readonly BOARD_HEIGHT = 20

  private readonly updateLoop: AsyncLoop
  private readonly boardElements: HTMLDivElement[][]
  private readonly scoreElement: HTMLHeadingElement

  // initialization

  constructor() {
    this.boardElements = this.mountBoard()
    this.scoreElement = this.mountScore()
    this.bindKeys()
    this.updateLoop = new AsyncLoop(this.updateGame, 1000)
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
    Keyboard.subscribe(this.rotatePieceRight, 'd', 'D', 'ArrowRight')
    Keyboard.subscribe(this.rotatePieceLeft, 'a', 'A', 'ArrowLeft')
  }

  // methods

  private startGame = () => {

  }

  private updateGame = () => {

  }

  private movePieceDown = () => {

  }

  private rotatePieceRight = () => {

  }

  private rotatePieceLeft = () => {

  }
}