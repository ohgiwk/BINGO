import { useState, useContext } from 'react'
// prettier-ignore
import { range, chunk, shuffle, wait, substract, transpose, reverse, } from '../common/utils'
import API from '../common/API'
import { AppContext } from '../contexts/AppContext'
import { Room, RoomNumber } from '../common/types'

export default function useRoom() {
  const maxNumber = 75
  const { openDialog, closeDialog, setSnackBar } = useContext(AppContext)

  const [room, setRoom] = useState<Room>()
  const [number, setNumber] = useState<string>('0')
  const [numbers, setNumbers] = useState<RoomNumber[]>(
    range(Math.ceil(maxNumber / 10) * 10, 1).map((n) => ({
      value: n <= maxNumber ? String(n) : '',
      open: false,
      ripple: true,
      className: '',
    }))
  )
  const [isValidRoomId, setIsValidRoomId] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [open, setOpen] = useState(false)

  /**
   *
   * @param {*} snapshot
   */
  function onUpdateRoom(newRoom: Room) {
    if (newRoom) {
      // 抽選履歴を取得して反映
      setNumbers(
        numbers.map((n) => ({
          ...n,
          open: newRoom.history?.includes(n.value) ?? false,
        }))
      )

      // 新しいユーザーが参加したら通知を表示
      if (room) {
        const newPlayerIds = substract(
          room.players?.map((p) => p.id) ?? [],
          newRoom.players?.map((p) => p.id) ?? []
        )
        if (newPlayerIds.length > 0) {
          const playerNames =
            newRoom.players
              ?.filter((p) => newPlayerIds.includes(p.id))
              .map((p) => `${p.name} さん`)
              .join('と') ?? ''

          setSnackBar({
            open: true,
            message: `${playerNames}が参加しました！`,
            type: 'info',
          })
        }
      }

      setRoom(newRoom)
    } else {
      setIsValidRoomId(false)
    }

    setIsLoading(false)
  }

  async function onClick() {
    setOpen(true)

    await wait(1000)
    setRunning(true)
    playSE()

    new Promise<string>((resolve) => {
      let num = ''
      const list = shuffle(
        numbers.filter((n) => !n.open && n.value).map((n) => n.value)
      )

      let i = 0
      const timer = setInterval(() => {
        num = list[i]
        setNumber(num)
        i = i < list.length - 1 ? i + 1 : 0
      }, 50)

      setTimeout(() => {
        clearInterval(timer)
        resolve(num)
      }, 2500)
    }).then((newNumber) => {
      setTimeout(() => {
        setRunning(false)
        setOpen(false)

        setNumbers(
          numbers.map((n) => ({
            ...n,
            open: n.value === String(newNumber) ? true : n.open,
          }))
        )

        if (room) {
          // 抽選履歴の更新
          API.updateRoom(room.id, {
            ...room,
            number: newNumber,
            history: [...(room.history ?? []), newNumber],
          })
        }
      }, 2000)
    })
  }

  function onClickStart() {
    if (room) {
      openDialog({
        text: 'ビンゴを開始しますか？',
        primaryButtonText: 'OK',
        secondaryButtonText: 'キャンセル',
        onClickPrimaryButton: () => {
          API.updateRoom(room.id, { ...room, status: 'started' })
          closeDialog()
        },
        onClickSecondaryButton: () => closeDialog(),
      })
    }
  }

  function onClickReset() {
    openDialog({
      title: '抽選をリセット',
      text: 'リセットしてもよろしいですか？',
      primaryButtonText: 'OK',
      secondaryButtonText: 'キャンセル',
      onClickPrimaryButton: () => {
        if (room) {
          API.updateRoom(room.id, { ...room, number: '0', history: [] })
          setNumber('0')
          closeDialog()
        }
      },
      onClickSecondaryButton: () => closeDialog(),
    })
  }

  function wave() {
    numbers.filter((n) => (n.ripple = false))
    const table = transpose(chunk(numbers, 10))

    const promises = table.map((r, i) => {
      return new Promise<void>((resolve) => {
        const onTimer = setInterval(async () => {
          await wait(i * 150)

          const lastTruePos = reverse(r).findIndex((i) => i.open)
          const index = lastTruePos < 0 ? 0 : r.length - lastTruePos
          if (index >= 0 && index < r.length) {
            r[index].open = true
            // r[index].className = classes.on
          } else {
            clearInterval(onTimer)
          }
        }, 80)

        setTimeout(() => {
          const offTimer = setInterval(async () => {
            await wait(i * 150)

            const index = r.findIndex((i) => i.open)
            if (index >= 0) {
              r[index].open = false
              r[index].className = ''
            } else {
              clearInterval(offTimer)
              resolve()
            }
          }, 80)
        }, 800)
      })
    })

    const update = setInterval(() => {
      setNumbers(transpose(table).flat())
    }, 50)

    Promise.all(promises).then(() => {
      clearInterval(update)
    })
  }

  function playSE() {
    const player = document.createElement('audio')
    player.src = '/drumroll.mp3'
    player.play()
  }

  return {
    room,
    number,
    numbers,
    isValidRoomId,
    isLoading,
    running,
    open,
    onUpdateRoom,
    onClick,
    onClickStart,
    onClickReset,
  }
}
