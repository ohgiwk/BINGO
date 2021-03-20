export type Number = {
  number: string
  open: boolean
  reach: boolean
  bingo: boolean
  center: boolean
}

export type RoomNumber = {
  value: string
  open: boolean
  ripple: boolean
  className: string
}

export type Player = {
  id: string
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
