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

export function shuffle<T>([...array]: T[]): T[] {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function range(size: number, startAt = 0) {
  return Array.from(Array(size), (_, k) => k).map((i) => i + startAt)
}

export function take<T>(array: T[], n: number): T[] {
  if (n === 0) return []
  if (n > array.length) return [...array]

  const takeValues = []
  for (let i = 0; i < n; i++) {
    takeValues.push(array[i])
  }
  return takeValues
}

export function transpose<T>(array: T[][]): T[][] {
  return array[0].map((col, i) => array.map((row) => row[i]))
}

export function deepCopy<T>(array: T[]): T[] {
  return JSON.parse(JSON.stringify(array))
}

export function reverse<T>(arr: T[]): T[] {
  return arr.slice().reverse()
}
