// prettier-ignore
import { useState, useEffect, useContext } from 'react'
// prettier-ignore
import { Container, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import firebase from '../../common/firebase'
import moment from 'moment'
import { RemoveScroll } from 'react-remove-scroll'

import { chunk } from '../../common/utils'
import { Number, Room } from '../../common/types'
// prettier-ignore
import { generateNumbers, toCardNumbers, checkBingo, countBingo } from '../../common/bingo'
import { AppContext } from '../../contexts/AppContext'
import { BingoContext } from '../../contexts/BingoContext'
import FAB from '../../components/FAB'
import NumberSquare from '../../components/NumberSquare'
import PlayerDrawer from '../../components/PlayerDrawer'
import HistoryDrawer from '../../components/HistoryDrawer'
import GiftDrawer from '../../components/GiftDrawer'
import SpinnerIcon from '../../components/SpinnerIcon'
import EntryButton from '../../components/EntryButton'
import SettingDialog from '../../components/SettingDialog'
import useAPI from '../../hooks/useAPI'
import { THEME_COLORS } from '../../common/constants'
import AppLoading from '../../components/AppLoading'

const database = firebase.database()

export default function Card() {
  const router = useRouter()
  const { id: roomId } = router.query

  const { setSnackBar, openDialog, closeDialog, setPrimaryColor } = useContext(
    AppContext
  )
  const { playerId } = useContext(BingoContext)
  const { updateRoom } = useAPI()

  const [numbers, setNumbers] = useState<Number[]>([])
  const [room, setRoom] = useState<Room>()
  const [count, setCount] = useState({ bingo: 0, reach: 0 })
  const [isBingo, setIsBingo] = useState<boolean>(false)

  useEffect(() => {
    const roomRef = database.ref('rooms/' + roomId)
    roomRef.on('value', (snapshot) => {
      setRoom(snapshot.val())
    })
  }, [])

  useEffect(() => {
    if (room) {
      let myNumbers = []
      // 確定済みの数字列を取得 もしくは 新規生成
      const me = room.players?.find((p) => p.id === playerId)
      if (me && me.numbers) {
        myNumbers = toCardNumbers(me.numbers)
      } else {
        setPrimaryColor(
          THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)]
        )
        myNumbers = toCardNumbers(generateNumbers())
      }

      // 完全にエントリーしてなければ表示しない
      if (me && me.numbers) {
        // ルーム履歴にある数字をオープンにする
        myNumbers = myNumbers.map((n) => ({
          ...n,
          open: (n.open || room.history?.includes(n.number)) ?? false,
        }))

        if (room.number !== '0') {
          // 抽選画面から配信された数字
          const target = numbers.find((n) => n.number === room.number)

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
          setSnackBar({
            open: true,
            message: `「${room.number}」が出ました！`,
            type: target ? 'success' : 'info',
          })
        }
      }

      setNumbers(checkBingo(myNumbers))
    }
  }, [room])

  function onClickNumber(num: Number) {
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
   * 数字の確定
   */
  function onClickSelect() {
    if (room) {
      openDialog({
        text: 'ビンゴカードを確定してもよろしいですか？',
        primaryButtonText: 'OK',
        secondaryButtonText: 'キャンセル',
        onClickPrimaryButton: async () => {
          const players =
            room.players?.map((p) =>
              p.id === playerId
                ? {
                    ...p,
                    numbers: numbers.map((n) => n.number),
                    bingo: 0,
                    reach: 0,
                  }
                : p
            ) ?? []
          await updateRoom(room.id, { ...room, players })

          closeDialog()
        },
        onClickSecondaryButton: () => closeDialog(),
      })
    }
  }

  const onClickRegenerate = () => setNumbers(toCardNumbers(generateNumbers()))

  useEffect(() => {
    if (!playerId) {
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
  }, [numbers])

  if (room) {
    return (
      // prettier-ignore
      <View {...{ room, numbers, playerId, isBingo, onClickSelect, onClickRegenerate, onClickNumber }} />
    )
  } else {
    return <LoadingView />
  }
}

const View: React.FC<{
  room: Room
  numbers: Number[]
  playerId: string
  isBingo: boolean
  onClickSelect: () => void
  onClickRegenerate: () => void
  onClickNumber: (num: Number) => void
}> = (props) => {
  const classes = useStyles()
  const { room } = props
  const me = room.players?.find((r) => r.id === props.playerId)

  return (
    <RemoveScroll style={{ height: '100%' }}>
      <Container className={classes.container} maxWidth="xs">
        <Typography className={classes.roomId}>
          {props.playerId ? `エントリー中: ${me?.name}` : '未エントリー'}
        </Typography>

        <div className={classes.title}>
          <div className={classes.char}>B</div>
          <div className={classes.char}>I</div>
          <div className={classes.char}>N</div>
          <div className={classes.char}>G</div>
          <div className={classes.char}>O</div>
        </div>

        <div className={classes.numbers}>
          {chunk(props.numbers, 5).map((arr, i) => (
            <div key={i}>
              {arr.map((num, j) => (
                <NumberSquare
                  key={j}
                  number={num}
                  history={room.history ?? []}
                  onClick={(num) => props.onClickNumber(num)}
                />
              ))}
            </div>
          ))}
        </div>
        <div className={classes.buttons}>
          {!props.playerId && <EntryButton {...{ room }} />}

          {props.playerId && !me?.numbers && (
            <>
              <div>タップして数字を変更できます</div>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={props.onClickSelect}
              >
                決定！
              </Button>

              <Button
                variant="contained"
                className={classes.button}
                onClick={props.onClickRegenerate}
              >
                シャッフル
              </Button>
            </>
          )}

          {props.playerId && me?.numbers && (
            <div>
              <SpinnerIcon />
              <div style={{ marginTop: '1rem' }}>
                ビンゴ開始まで少々お待ちください
              </div>
            </div>
          )}
        </div>

        <div>
          <div className={classes.roomName}> {room.name}</div>
          <div className={classes.date}>
            {moment(room.startDate).format('YYYY年MM月DD日hh時mm分〜')}
          </div>
        </div>

        {/* <div className={`${classes.reach} ${props.isReach && classes.appear}`}>リーチ！！</div> */}
        <div className={`${classes.bingo} ${props.isBingo && classes.appear}`}>
          BINGO!!
        </div>

        <SettingDialog className={classes.setting} />
        <FAB />
        <PlayerDrawer players={room.players ?? []} isEntered={!!me} />
        <GiftDrawer gifts={room.gifts ?? []} isEntered={!!me} />
        <HistoryDrawer history={room.history ?? []} isEntered={!!me} />
      </Container>
    </RemoveScroll>
  )
}

function LoadingView() {
  const classes = useStyles()
  return <AppLoading />
}

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    paddingTop: '64px',
    paddingBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    height: '40px',
  },
  char: {
    color: '#ddd',
    fontSize: '4.5rem',
    fontWeight: 'bold',
    width: '64px',
    height: '64px',
    display: 'inline-block',
    margin: '0 0.2rem',
  },
  roomName: {
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0',
    color: '#676767',
  },
  date: {
    textAlign: 'center',
    margin: '0',
    fontSize: '0.7rem',
    color: '#676767',
  },
  numbers: { textAlign: 'center', margin: '1rem 0' },
  button: { fontWeight: 'bold', color: '#fff', margin: '5px' },
  buttons: { textAlign: 'center' },

  roomId: { color: 'gray', fontSize: '9px', textAlign: 'right' },
  setting: {
    position: 'absolute',
    bottom: theme.spacing(3),
    left: theme.spacing(3),
  },
  reach: {
    color: theme.palette.primary.main,
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: '-120px',
    transform: 'rotate(-5deg) translateY(-200px)',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
  },
  bingo: {
    color: theme.palette.primary.main,
    fontSize: '3.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: '-110px',
    transform: 'rotate(-5deg) translateY(-200px)',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
    transition: '0.3s',
    letterSpacing: '0.5rem',
    pointerEvents: 'none',
    opacity: 0,
  },
  appear: {
    transform: 'rotate(-5deg) translateY(-250px) scale(1.2)',
    opacity: 1,
  },
}))
