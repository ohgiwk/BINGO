// prettier-ignore
import { useContext, useState } from 'react'

// prettier-ignore
import { generateNumbers, toCardNumbers, checkBingo, countBingo } from 'common/bingo'
import API from 'common/API'
import { THEME_COLORS } from 'common/constants'
import { CardNumber, Room } from 'common/types'
import { AppContext } from 'contexts/AppContext'

export default function useCard() {
  const {
    currentUser,
    setSnackBar,
    openDialog,
    closeDialog,
    setPrimaryColor,
  } = useContext(AppContext)

  const [room, setRoom] = useState<Room>()
  const [numbers, setNumbers] = useState<CardNumber[]>([])
  const [count, setCount] = useState({ bingo: 0, reach: 0 })
  const [isBingo, setIsBingo] = useState<boolean>(false)

  /**
   *
   *
   * @param {Room} room
   */
  function onUpdateRoom(newRoom: Room) {
    let myNumbers = []

    // 確定済みの数字列を取得 もしくは 新規生成
    const me = newRoom.players?.find((p) => p.id === currentUser?.uid)
    if (me && me.numbers) {
      myNumbers = toCardNumbers(me.numbers)
    } else {
      // setPrimaryColor(
      //   THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)]
      // )
      myNumbers = toCardNumbers(generateNumbers())
    }

    // 完全にエントリーしてなければ表示しない
    if (me && me.numbers) {
      // ルーム履歴にある数字をオープンにする
      myNumbers = myNumbers.map((n) => ({
        ...n,
        open: (n.open || newRoom.history?.includes(n.number)) ?? false,
      }))

      if (newRoom.number !== '0') {
        // 抽選画面から配信された数字
        const target = numbers.find((n) => n.number === newRoom.number)

        // 新たに抽選された数字をオープンにする
        if (target) {
          myNumbers = [
            ...myNumbers.map((n) => ({
              ...n,
              open: n === target ? !n.open : n.open,
            })),
          ]
        }

        // SnackBarを表示
        // 初回読み込み時は表示しない
        if (room) {
          setSnackBar({
            open: true,
            message: `「${newRoom.number}」が出ました！`,
            type: target ? 'success' : 'info',
          })
        }
      }
    }

    setRoom(newRoom)
    setNumbers(checkBingo(myNumbers))
  }

  /**
   *
   * @param {Number} num
   */
  function onClickNumber(num: CardNumber) {
    if (num.center) return
    const result = checkBingo([
      ...numbers.map((n) => ({ ...n, open: n === num ? !n.open : n.open })),
    ])
    setNumbers(result)

    const newCount = countBingo(result)

    if (newCount.bingo > count.bingo) {
      setIsBingo(true)
      setTimeout(() => setIsBingo(false), 4000)
    }

    setCount(newCount)
  }

  /**
   * ビンゴカードの確定
   */
  function onClickSelect(room: Room) {
    openDialog({
      text: 'ビンゴカードを確定してもよろしいですか？',
      primaryButtonText: 'OK',
      secondaryButtonText: 'キャンセル',
      onClickPrimaryButton: async () => {
        const players =
          room.players?.map((p) =>
            p.id === currentUser?.uid
              ? {
                  ...p,
                  numbers: numbers.map((n) => n.number),
                  bingo: 0,
                  reach: 0,
                }
              : p
          ) ?? []
        await API.updateRoom(room.id, { ...room, players })

        closeDialog()
      },
      onClickSecondaryButton: () => closeDialog(),
    })
  }

  function onClickRegenerate() {
    setNumbers(toCardNumbers(generateNumbers()))
  }

  function demoMode() {
    const timer = setInterval(() => {
      const list = numbers.filter((n) => !n.open)
      const target = list[Math.floor(Math.random() * list.length)]
      const isBingo = numbers.some((n) => n.bingo)

      if (isBingo) {
        setNumbers(toCardNumbers(generateNumbers()))
      } else {
        if (target) {
          onClickNumber(target)
        }
      }
    }, 2000)

    return () => clearInterval(timer)
  }

  function updateNumber(index: number, newValue: number) {
    numbers[index].number = String(newValue)
    setNumbers(numbers)
  }

  return {
    room,
    numbers,
    count,
    isBingo,
    currentUser,
    onUpdateRoom,
    onClickNumber,
    onClickSelect,
    onClickRegenerate,
    demoMode,
    updateNumber,
  }
}
