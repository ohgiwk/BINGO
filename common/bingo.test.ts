import {
  generateNumbers,
  toCardNumbers,
  _checkHorizontal,
  _checkDiagonal,
} from './bingo'
import { unique, max } from './utils'
import { MAX_BINGO_NUMBER } from 'common/constants'

describe('Test bingo.ts', () => {
  test('Test generateNumbers', () => {
    const maxNum = MAX_BINGO_NUMBER
    const count = 25
    const result = generateNumbers()

    // 指定長か
    expect(result).toHaveLength(count)
    // 最大値が指定数か
    expect(max(result)).toBeLessThanOrEqual(maxNum)
    // ユニークか
    expect(unique(result)).toHaveLength(count)
  })

  test('Test toCardNumbers', () => {
    const result = toCardNumbers([1, 2, 3])

    expect(result).toHaveLength(3)

    expect(result[1].open).toBeTruthy()
  })

  test('Test _checkHorizontal', () => {
    const result = _checkHorizontal([
      [
        { number: '1', open: false, bingo: false, reach: false, center: false },
        { number: '2', open: false, bingo: false, reach: false, center: false },
        { number: '3', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false },
        { number: '5', open: false, bingo: false, reach: false, center: false },
        { number: '6', open: false, bingo: false, reach: false, center: false },
      ],
    ])

    expect(result[0].every((r) => r.reach)).toBeFalsy()
    expect(result[0].every((r) => r.bingo)).toBeFalsy()
    // 他の列に影響がないか
    expect(result[1].every((r) => r.reach)).toBeFalsy()
    expect(result[1].every((r) => r.bingo)).toBeFalsy()

    const result2 = _checkHorizontal([
      [
        { number: '1', open: true, bingo: false, reach: false, center: false },
        { number: '2', open: true, bingo: false, reach: false, center: false },
        { number: '3', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false },
        { number: '5', open: false, bingo: false, reach: false, center: false },
        { number: '6', open: false, bingo: false, reach: false, center: false },
      ],
    ])

    expect(result2[0].every((r) => r.reach)).toBeTruthy()
    expect(result2[0].every((r) => r.bingo)).toBeFalsy()
    // 他の列に影響がないか
    expect(result2[1].every((r) => r.reach)).toBeFalsy()
    expect(result2[1].every((r) => r.bingo)).toBeFalsy()

    const result3 = _checkHorizontal([
      [
        { number: '1', open: true, bingo: false, reach: false, center: false },
        { number: '2', open: true, bingo: false, reach: false, center: false },
        { number: '3', open: true, bingo: false, reach: false, center: false },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false },
        { number: '5', open: false, bingo: false, reach: false, center: false },
        { number: '6', open: false, bingo: false, reach: false, center: false },
      ],
    ])

    expect(result3[0].every((r) => r.reach)).toBeTruthy()
    expect(result3[0].every((r) => r.bingo)).toBeTruthy()
    expect(result3[1].every((r) => r.reach)).toBeFalsy()
    expect(result3[1].every((r) => r.bingo)).toBeFalsy()
  })

  test('Test _checkDiagonal', () => {
    // prettier-ignore
    const data = [
      [
        { number: '1', open: false, bingo: false, reach: false, center: false },
        { number: '2', open: false, bingo: false, reach: false, center: false },
        { number: '3', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false },
        { number: '5', open: false, bingo: false, reach: false, center: false },
        { number: '6', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '7', open: false, bingo: false, reach: false, center: false },
        { number: '8', open: false, bingo: false, reach: false, center: false },
        { number: '9', open: false, bingo: false, reach: false, center: false },
      ],
    ]
    // prettier-ignore
    const expected = [
      [
        { number: '1', open: false, bingo: false, reach: false, center: false },
        { number: '2', open: false, bingo: false, reach: false, center: false },
        { number: '3', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false },
        { number: '5', open: false, bingo: false, reach: false, center: false },
        { number: '6', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '7', open: false, bingo: false, reach: false, center: false },
        { number: '8', open: false, bingo: false, reach: false, center: false },
        { number: '9', open: false, bingo: false, reach: false, center: false },
      ],
    ]

    const result = _checkDiagonal(data, [0, 1, 2])

    // 別のオブジェクトか
    expect(result).not.toBe(data)
    // 正常に判定できているか
    expect(result).toEqual(expected)

    // prettier-ignore
    const result2 = _checkDiagonal([
      [
        { number: '1', open: true, bingo: false, reach: false, center: false, },
        { number: '2', open: false, bingo: false, reach: false, center: false, },
        { number: '3', open: false, bingo: false, reach: false, center: false, },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false, },
        { number: '5', open: true, bingo: false, reach: false, center: false, },
        { number: '6', open: false, bingo: false, reach: false, center: false, },
      ],
      [
        { number: '7', open: false, bingo: false, reach: false, center: false, },
        { number: '8', open: false, bingo: false, reach: false, center: false, },
        { number: '9', open: false, bingo: false, reach: false, center: false, },
      ],
    ], [0, 1, 2])
    // prettier-ignore
    const expected2 = [
      [
        { number: '1', open: true, bingo: false, reach: true, center: false },
        { number: '2', open: false, bingo: false, reach: false, center: false },
        { number: '3', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false },
        { number: '5', open: true, bingo: false, reach: true, center: false },
        { number: '6', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '7', open: false, bingo: false, reach: false, center: false },
        { number: '8', open: false, bingo: false, reach: false, center: false },
        { number: '9', open: false, bingo: false, reach: true, center: false },
      ],
    ]

    expect(result2).toEqual(expected2)

    // prettier-ignore
    const result3 = _checkDiagonal([
      [
        { number: '1', open: true, bingo: false, reach: false, center: false, },
        { number: '2', open: false, bingo: false, reach: false, center: false, },
        { number: '3', open: false, bingo: false, reach: false, center: false, },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false, },
        { number: '5', open: true, bingo: false, reach: false, center: false, },
        { number: '6', open: false, bingo: false, reach: false, center: false, },
      ],
      [
        { number: '7', open: false, bingo: false, reach: false, center: false, },
        { number: '8', open: false, bingo: false, reach: false, center: false, },
        { number: '9', open: true, bingo: false, reach: false, center: false, },
      ],
    ], [0, 1, 2])
    // prettier-ignore
    const expected3 = [
      [
        { number: '1', open: true, bingo: true, reach: true, center: false },
        { number: '2', open: false, bingo: false, reach: false, center: false },
        { number: '3', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '4', open: false, bingo: false, reach: false, center: false },
        { number: '5', open: true, bingo: true, reach: true, center: false },
        { number: '6', open: false, bingo: false, reach: false, center: false },
      ],
      [
        { number: '7', open: false, bingo: false, reach: false, center: false },
        { number: '8', open: false, bingo: false, reach: false, center: false },
        { number: '9', open: true, bingo: true, reach: true, center: false },
      ],
    ]

    expect(result3).toEqual(expected3)
  })
})
