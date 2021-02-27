/**
 * 配列を一定の要素数ごとに分割する
 * @param array 分割する配列
 * @param size 要素数
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunked = []
  for (let element of array) {
    const last = chunked[chunked.length - 1]
    if (!last || last.length === size) {
      chunked.push([element])
    } else {
      last.push(element)
    }
  }
  return chunked
}

/**
 * 渡された配列の要素をランダム並び替えた配列を返す
 * @param param0
 */
export function shuffle<T>([...array]: T[]): T[] {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * 連続した数字を持つ配列を作成する
 * @param size 作成する配列の長さ
 * @param startAt １つ目の要素
 */
export function range(size: number, startAt = 0) {
  if (size < 0) return []
  return Array.from(Array(size), (_, k) => k).map((i) => i + startAt)
}

/**
 * 渡された配列の先頭から指定要素数分の切り取った配列を返す
 * @param array
 * @param n
 */
export function take<T>(array: T[], n: number): T[] {
  if (n === 0) return []
  if (n > array.length) return [...array]

  const takeValues = []
  for (let i = 0; i < n; i++) {
    takeValues.push(array[i])
  }
  return takeValues
}

/**
 *
 * @param array
 */
export function transpose<T>(array: T[][]): T[][] {
  return array[0].map((col, i) => array.map((row) => row[i]))
}

export function deepCopy<T>(obj: T): T[] {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 非破壊reverse
 * @param array 反転する配列
 */
export function reverse<T>(array: T[]): T[] {
  return [...array].reverse()
}

/**
 * 配列内の重複した要素を削除した配列を返す
 * @param array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function max(array: number[]) {
  return array.reduce((a, b) => Math.max(a, b))
}

export function min(array: number[]) {
  return array.reduce((a, b) => Math.min(a, b))
}

/**
 * 2つの配列のなかで片方にしかない要素の配列を返す
 * @param a
 * @param b
 */
export function substract<T>(a: T[], b: T[]): T[] {
  const [_a, _b] = a.length > b.length ? [a, b] : [b, a]
  return _a.filter((i) => !_b.includes(i))
}

/**
 * 指定ミリ秒待つプロミスを返す
 * @param ms
 */
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
