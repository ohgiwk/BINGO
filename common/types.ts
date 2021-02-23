export type Number = {
  number: string
  open: boolean
  reach: boolean
  bingo: boolean
  center: boolean
}

export type Player = {
  name: string
  message: string
  numbers?: string[]
  bingo?: number
  reach?: number
}

export type Room = {
  id: string
  name: string
  description: string
  owner: string
  status: string
  startDate: number
  number: string
  history?: string[]
  gifts?: string[]
  players?: Player[]
}
