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