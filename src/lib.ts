export type Mutable<T> = { -readonly [K in keyof T]: T[K] }

export const Keyboard = new class {
  private readonly actions: {[key: string]: Array<() => any>} = {}
  constructor() {
    window.addEventListener('keydown', (event) => {
      const bucket = this.actions[event.key]
      if (!bucket) return
      event.preventDefault()
      bucket.forEach(action => action())
    })
  }

  // so far I need only subscription function

  subscribe = (action: () => any, ...keys: string[]) => {
    for (const key of keys) {
      if (!this.actions[key]) this.actions[key] = []
      this.actions[key].push(action)
    }
  }

  //
}

export class AsyncLoop {

  private interval: number | undefined = undefined
  private running = false

  constructor (
    private readonly action: () => any, 
    private readonly period: number
  ) {}

  start = () => {
    if (this.running) return
    this.interval = setInterval (
      this.action,
      this.period
    )
    this.running = true
  }

  stop = () => {
    if (!this.running) return
    clearInterval(this.interval)
    this.running = false
  }

  restart = () => {
    this.stop()
    this.start()
  }
}