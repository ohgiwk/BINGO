import firebase from 'firebase'
import { Room } from '../common/types'
import { v4 as uuidv4 } from 'uuid'

export default function useAPI() {
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

  return {
    createRoom,
    updateRoom,
    deleteRoom,
  }
}
