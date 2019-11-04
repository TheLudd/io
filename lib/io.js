import { of, map, ap, chain } from 'fantasy-land'

function runIO1 (a, io) {
  return io.f(a)
}

function runIO (io) {
  return io.f()
}

class IO {
  static [of] (v) {
    return new IO(() => v)
  }

  constructor (f) {
    this.f = f
  }

  [map] (f) {
    return this[chain]((v) => IO[of](f(v)))
  }

  [ap] (b) {
    return b[chain]((f) => this[map](f))
  }

  [chain] (f) {
    return new IO((a) => {
      const thisResult = runIO1(a, this)
      return runIO1(a, f(thisResult))
    })
  }
}

export { IO, runIO, runIO1 }
