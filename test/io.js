import { assert } from 'chai'
import { chain, map, of } from '@theludd/fantasy-functions'
import { IO, runIO, runIO1 } from '../lib/io'

const { deepEqual, equal } = assert

const state = {
  foo: 'the string foo',
  bar: 'the string bar',
}

const getStateIO = new IO((key) => state[key])

const nowIO = new IO(() => new Date())

function getFullYear (d) {
  return d.getFullYear()
}

describe('io', () => {
  const ioOf = of(IO)
  const addIntoIO = (x) => ioOf(x + 1)

  it('should chain', () => {
    const result = runIO(chain(addIntoIO, ioOf(1)))
    equal(result, 2)
  })

  it('should run with one', () => {
    const result = runIO1('foo', getStateIO)
    equal(result, 'the string foo')
  })

  it('should chain properly', () => {
    const runs = []
    function addToArray (v) {
      return new IO((arr) => {
        arr.push(v)
        return arr
      })
    }
    const testIO = chain(addToArray, map(getFullYear, nowIO))
    runIO1(runs, testIO)
    deepEqual(runs, [ new Date().getFullYear() ])
  })
})
