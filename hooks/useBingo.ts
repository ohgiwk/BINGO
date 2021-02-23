// prettier-ignore
import { chunk, shuffle, range, take, transpose, reverse } from '../common/utils'

import { Number } from '../common/types'
export default function useBingo() {
  function generateNumbers(maxNumber: number, numOfNumbersOnCard: number) {
    return toCardNumbers(
      take(shuffle(range(maxNumber, 1)), numOfNumbersOnCard).map((i) =>
        String(i)
      )
    )
  }

  function toCardNumbers(numbers: string[]) {
    const list = numbers.map((n) => ({
      open: false,
      number: String(n),
      reach: false,
      bingo: false,
      center: false,
    }))

    list[Math.floor(list.length / 2)] = {
      open: true,
      number: '',
      reach: false,
      bingo: false,
      center: true,
    }

    return list
  }

  function checkBingo(numbers: Number[]) {
    const chunked = [...chunk(numbers, 5)]
    const horizontal = _checkLine(chunked)
    const vertical = transpose(_checkLine([...transpose(chunked)]))
    const pos = range(chunked.length)

    const diagonalL = _checkDiagonal(chunked, transpose([pos, pos]))
    const diagonalR = _checkDiagonal(chunked, transpose([pos, reverse(pos)]))

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

    function _checkLine(array: Number[][]) {
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

    function _checkDiagonal([...chunked]: Number[][], position: number[][]) {
      const array = chunked.map((arr) =>
        arr.map((a) => ({ ...a, reach: false, bingo: false }))
      )

      const opened = position.filter(([i, j]) => array[i][j].open)
      if (opened.length === array.length) {
        position.forEach(([i, j]) => {
          array[i][j] = { ...array[i][j], reach: true, bingo: true }
        })
      }
      if (opened.length === array.length - 1) {
        position.forEach(([i, j]) => {
          array[i][j] = { ...array[i][j], reach: true, bingo: false }
        })
      }
      if (opened.length < array.length - 1) {
        position.forEach(([i, j]) => {
          array[i][j] = { ...array[i][j], reach: false, bingo: false }
        })
      }

      return array
    }

    return result.flat()
  }

  return { generateNumbers, toCardNumbers, checkBingo }
}
