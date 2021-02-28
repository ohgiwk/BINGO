// prettier-ignore
import { useState, useEffect, useContext } from 'react'
// prettier-ignore
import { Container, Button, Typography, Backdrop } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import firebase from 'firebase'
import moment from 'moment'
import { RemoveScroll } from 'react-remove-scroll'

import { chunk } from '../../common/utils'
import { Number, Room } from '../../common/types'
import { generateNumbers, toCardNumbers, checkBingo } from '../../common/bingo'
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

  useEffect(() => {
    const roomRef = firebase.database().ref('rooms/' + roomId)
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

  if (room) {
    return (
      // prettier-ignore
      <View {...{ room, numbers, playerId, onClickSelect, onClickRegenerate, onClickNumber }} />
    )
  } else {
    return <LoadingView />
  }
}

const View: React.FC<{
  room: Room
  numbers: Number[]
  playerId: string
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
        <div>
          <h2 className={classes.title}> {room.name}</h2>
          <h3 className={classes.date}>
            {moment(room.startDate).format('YYYY年MM月DD日hh時mm分〜')}
          </h3>
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
              <div>タップして番号を変更できます</div>
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
                選び直す
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

        {/* <div className={classes.reach}>リーチ！！</div> */}
        {/* <div className={`${classes.bingo} ${classes.appear}`}>BINGO!!</div> */}

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
    paddingBottom: '6rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  title: { margin: '0' },
  date: { margin: '0', fontSize: '0.7rem', color: '#676767' },
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
    marginLeft: '-85px',
    transform: 'rotate(-5deg) translateY(-200px)',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
    transition: '0.3s',
    opacity: 0,
  },
  appear: {
    transform: 'rotate(-5deg) translateY(-250px)',
    opacity: 1,
  },
}))
