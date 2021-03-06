// prettier-ignore
import { chunk, shuffle, range, take, transpose, reverse } from './utils'

import { Number } from './types'

/**
 *
 * @param maxNumber
 * @param numOfNumbersOnCard
 */
function generateNumbers() {
  return transpose([
    take(shuffle(range(15, 1)), 5),
    take(shuffle(range(15, 16)), 5),
    take(shuffle(range(15, 31)), 5),
    take(shuffle(range(15, 46)), 5),
    take(shuffle(range(15, 61)), 5),
  ]).flat()
}

/**
 *
 * @param numbers
 */
function toCardNumbers(numbers: (number | string)[]) {
  const list = numbers.map((n) => ({
    open: false,
    number: String(n),
    reach: false,
    bingo: false,
    center: false,
  }))

  // 中央のマスは数字なしかつオープン
  list[Math.floor(list.length / 2)] = {
    open: true,
    number: '',
    reach: false,
    bingo: false,
    center: true,
  }

  return list
}

/**
 *
 * @param numbers
 */
function checkBingo(numbers: Number[]) {
  const chunked = [...chunk(numbers, 5)]
  const horizontal = _checkHorizontal(chunked)
  const vertical = transpose(_checkHorizontal([...transpose(chunked)]))

  const pos = range(chunked.length)
  const diagonalL = _checkDiagonal(chunked, pos)
  const diagonalR = _checkDiagonal(chunked, reverse(pos))

  const result = horizontal.map((rows, i) =>
    rows.map((_, j) => {
      const r = horizontal[i][j]
      const v = vertical[i][j]
      const dl = diagonalL[i][j]
      const dr = diagonalR[i][j]

      return {
        ...r,
        bingo: [r, v, dl, dr].some((i) => i.bingo),
        reach: [r, v, dl, dr].some((i) => i.reach),
      }
    })
  )

  return result.flat()
}

/**
 * 横のラインでビンゴになっているかチェックする
 * @param array
 */
function _checkHorizontal(array: Number[][]) {
  return array.map((arr) => {
    const opened = arr.filter((n) => n.open)
    if (opened.length === arr.length) {
      arr = arr.map((a) => ({ ...a, reach: true, bingo: true }))
    }
    if (opened.length === arr.length - 1) {
      arr = arr.map((a) => ({ ...a, reach: true, bingo: false }))
    }
    if (opened.length < arr.length - 1) {
      arr = arr.map((a) => ({ ...a, reach: false, bingo: false }))
    }
    return arr
  })
}

/**
 * 斜めのラインでビンゴになっているかチェックする
 * @param param0
 * @param position
 */
function _checkDiagonal([...chunked]: Number[][], position: number[]) {
  const array = chunked.map((arr) =>
    arr.map((a) => ({ ...a, reach: false, bingo: false }))
  )

  const opened = position.filter((p, i) => array[i][p].open)
  if (opened.length === array.length) {
    position.forEach((p, i) => {
      array[i][p] = { ...array[i][p], reach: true, bingo: true }
    })
  }
  if (opened.length === array.length - 1) {
    position.forEach((p, i) => {
      array[i][p] = { ...array[i][p], reach: true, bingo: false }
    })
  }
  if (opened.length < array.length - 1) {
    position.forEach((p, i) => {
      array[i][p] = { ...array[i][p], reach: false, bingo: false }
    })
  }

  return array
}

function countBingo(numbers: Number[]) {
  function count(type: 'bingo' | 'reach') {
    const chunked = [...chunk(numbers, 5)]
    return [
      ...chunked.map((arr) => arr.every((n) => n[type])),
      ...transpose(chunked).map((arr) => arr.every((n) => n[type])),
      range(chunked.length).every((i) => chunked[i][i][type]),
      reverse(range(chunked.length)).every((n, i) => chunked[n][i][type]),
    ].filter((n) => n).length
  }

  return { bingo: count('bingo'), reach: count('reach') }
}

export {
  generateNumbers,
  toCardNumbers,
  countBingo,
  checkBingo,
  _checkHorizontal,
  _checkDiagonal,
}
