import firebase from 'firebase/app'
import 'firebase/database'
import { Room } from './types'
import { v4 as uuidv4 } from 'uuid'

function createRoom(value: Omit<Room, 'id'>) {
  const roomId = uuidv4()

  return firebase
    .database()
    .ref('rooms/' + roomId)
    .set({ id: roomId, ...value })
}

function updateRoom(roomId: string, value: Room) {
  return firebase
    .database()
    .ref('rooms/' + roomId)
    .set(value)
}

function deleteRoom() {
  //
}

export default { createRoom, updateRoom, deleteRoom }
