import {
  chunk,
  shuffle,
  range,
  take,
  transpose,
  deepCopy,
  reverse,
  unique,
  substract,
} from './utils'

describe('Test utils.ts', () => {
  test('Test chunk function', () => {
    // 正常系
    // prettier-ignore
    expect(chunk([0, 1, 2, 3, 4, 5], 2))
        .toEqual([[0, 1], [2, 3], [4, 5]])

    // 正常系
    // prettier-ignore
    expect(chunk([0, 1, 2, 3, 4, 5], 3))
        .toEqual([[0, 1, 2], [3, 4, 5]])

    // 端数が出る
    // prettier-ignore
    expect(chunk([0, 1, 2, 3, 4, 5], 4))
        .toEqual([[0, 1, 2, 3], [4, 5]])

    // 配列の長さより大きい数字を渡す
    // prettier-ignore
    expect(chunk([0, 1, 2], 4))
        .toEqual([[0, 1, 2]])

    // 1を渡す
    // prettier-ignore
    expect(chunk([0, 1, 2], 1))
        .toEqual([[0], [1], [2]])

    // 0を渡す
    // prettier-ignore
    expect(chunk([0, 1, 2], 0))
        .toEqual([[0, 1, 2]])

    // 負数を渡す
    // prettier-ignore
    expect(chunk([0, 1, 2], -2))
        .toEqual([[0, 1, 2]])

    // 空配列を渡す
    // prettier-ignore
    expect(chunk([], 2))
        .toEqual([])
  })

  test('Test shuffle function', () => {
    const arr = [0, 1, 2, 3]
    const result = shuffle(arr)
    // 別のオブジェクトかどうか
    expect(result).not.toBe(arr)
  })

  test('Test range function', () => {
    // 正常系
    expect(range(3)).toEqual([0, 1, 2])
    // 開始数を指定
    expect(range(3, 3)).toEqual([3, 4, 5])
    // 0を指定
    expect(range(0)).toEqual([])
    // 長さに負数を指定
    expect(range(-1)).toEqual([])
    // 開始数に負数を指定
    expect(range(3, -2)).toEqual([-2, -1, 0])
    // 0を指定(開始数指定あり)
    expect(range(0, 3)).toEqual([])
  })

  test('Test take function', () => {
    // 正常系
    expect(take([0, 1, 2, 3, 4, 5], 3)).toEqual([0, 1, 2])
    // 配列数より大きい数を渡したら
    expect(take([], 3)).toEqual([])
    // 0を渡したら
    expect(take([1, 2, 3], 0)).toEqual([])
    // 負数を渡したら
    expect(take([1, 2, 3], -1)).toEqual([])
  })

  test('Test transpose function', () => {
    const result = transpose([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ])
    expect(result).toEqual([
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ])
  })

  test('Test deepCopy function', () => {
    const arr = [0, 1, 2]
    // 別のオブジェクトか
    expect(deepCopy(arr)).not.toBe(arr)
    // 同じ値か
    expect(deepCopy(arr)).toEqual(arr)

    const obj = { test: 'hello world' }
    // 別のオブジェクトか
    expect(deepCopy(obj)).not.toBe(obj)
    // 同じ値か
    expect(deepCopy(obj)).toEqual(obj)
  })

  test('Test reverse function', () => {
    const arr = [0, 1, 2, 3, 4, 5]
    const result = reverse(arr)
    // 逆順になっているか
    expect(result).toEqual([5, 4, 3, 2, 1, 0])
    // 元の配列は変わらないか
    expect(arr).toEqual([0, 1, 2, 3, 4, 5])
    // 元の配列と違うオブジェクトか
    expect(result).not.toBe(arr)
  })

  test('Test unique function', () => {
    // 正常系
    expect(unique([1, 1, 1, 2])).toEqual([1, 2])
    // 正常系
    expect(unique(['1', '2', '2', '3', '3'])).toEqual(['1', '2', '3'])
    // 空配列を渡す
    expect(unique([])).toEqual([])
  })

  test('Test substract function', () => {
    // 正常系
    expect(substract([1, 2, 3], [1, 2])).toEqual([3])

    expect(substract([1, 2], [1, 2, 3])).toEqual([3])

    expect(substract([], [1, 2, 3])).toEqual([1, 2, 3])

    expect(substract([1, 2, 3], [])).toEqual([1, 2, 3])
  })
})
