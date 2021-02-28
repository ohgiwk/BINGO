import { useState, useEffect, useContext } from 'react'
// prettier-ignore
import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'firebase'
import { useRouter } from 'next/router'
import moment from 'moment'

import { range, chunk, shuffle, wait, substract } from '../../common/utils'
import { Room } from '../../common/types'
import useAPI from '../../hooks/useAPI'
import FAB from '../../components/FAB'
import HistoryDrawer from '../../components/HistoryDrawer'
import GiftDrawer from '../../components/GiftDrawer'
import RippleNumber from '../../components/RippleNumber'
import { AppContext } from '../../contexts/AppContext'
import PlayerDrawer from '../../components/PlayerDrawer'

type Number = {
  value: string
  open: boolean
}

export default function LotteryRoom() {
  const router = useRouter()
  const { id: roomId } = router.query as { id: string }
  const { updateRoom } = useAPI()

  const maxNumber = 75

  const { openDialog, closeDialog, setSnackBar } = useContext(AppContext)
  const [room, setRoom] = useState<Room>()
  const [number, setNumber] = useState<string>('0')
  const [numbers, setNumbers] = useState<Number[]>(
    range(Math.ceil(maxNumber / 10) * 10, 1).map((n) => ({
      value: n <= maxNumber ? String(n) : '',
      open: false,
    }))
  )
  const [isValidRoomId, setIsValidRoomId] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const roomRef = firebase.database().ref('rooms/' + roomId)
    roomRef.on('value', (snapshot) => {
      const newRoom = snapshot.val() as Room

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
    })
  }, [])

  const onClick = async () => {
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
          updateRoom(roomId, {
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
          updateRoom(roomId, { ...room, status: 'started' })
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
          updateRoom(roomId, { ...room, number: '0', history: [] })
          setNumber('0')
          closeDialog()
        }
      },
      onClickSecondaryButton: () => closeDialog(),
    })
  }

  if (isLoading) {
    return <LoadingView />
  } else if (isValidRoomId && room) {
    return (
      // prettier-ignore
      <MainView {...{ room, numbers, number, open, running, onClick, onClickStart, onClickReset }}
      />
    )
  } else {
    return <NotFoundView />
  }
}

const MainView: React.FC<{
  room: Room
  numbers: Number[]
  number: string
  running: boolean
  open: boolean
  onClick: () => void
  onClickStart: () => void
  onClickReset: () => void
}> = (props) => {
  const classes = useStyles()

  const { room } = props

  return (
    <MUI.Container className={classes.container} maxWidth="md">
      {room.status === 'started' ? (
        <>
          <MUI.Typography className={classes.count}>
            {`${room.history?.length ?? 0} / ${
              props.numbers.filter((h) => h.value).length
            }`}
          </MUI.Typography>
          <MUI.Typography
            className={`
        ${classes.number} ${room.status !== 'started' && classes.prepare}`}
          >
            {props.number}
          </MUI.Typography>
        </>
      ) : (
        <>
          <MUI.Typography className={`${classes.title}`}>
            {room.name}
          </MUI.Typography>
          <MUI.Typography className={classes.date}>
            {moment(room.startDate).format('YYYY年MM月DD日hh時mm分〜')}
          </MUI.Typography>
        </>
      )}

      {room.status !== 'started' ? (
        <MUI.Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={props.onClickStart}
          disabled={props.running}
        >
          ビンゴを開始する！
        </MUI.Button>
      ) : (
        <MUI.Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={props.onClick}
          disabled={props.running}
        >
          抽選する！
        </MUI.Button>
      )}

      <div
        className={`
        ${classes.table} ${room.status !== 'started' && classes.prepare}`}
      >
        {chunk(props.numbers, 10).map((arr, i) => (
          <div key={i} className={classes.numbers}>
            {arr.map((number, j) => (
              <RippleNumber key={j} {...{ number }} />
            ))}
          </div>
        ))}
      </div>

      {/* <div className={classes.floatArea}>
        <ButtonGroup variant="text" color="primary">
          <Button onClick={onClickReset}>リセット</Button>
        </ButtonGroup>
      </div> */}
      <div className={`${classes.info} ${classes.blinking}`}>
        現在の参加人数: {room.players?.length ?? 0}人
      </div>
      {/* <div className={classes.info}>現在のビンゴ数: 1</div>
      <div className={classes.info}>現在のリーチ数: 1</div> */}

      <FAB className={classes.fab} />
      <PlayerDrawer players={room.players ?? []} isEntered={true} />
      <GiftDrawer gifts={room.gifts ?? []} isEntered={true} />
      <HistoryDrawer history={room.history ?? []} isEntered={true} />

      <MUI.Dialog open={props.open}>
        <MUI.DialogContent
          className={`${classes.dialogNumber} ${
            props.running && classes.roulette
          }`}
        >
          {props.number}
        </MUI.DialogContent>
      </MUI.Dialog>
    </MUI.Container>
  )
}

function LoadingView() {
  const classes = useStyles()
  return <MUI.CircularProgress className={classes.loading} />
}

function NotFoundView() {
  const classes = useStyles()

  return (
    <MUI.Container className={classes.container} maxWidth="md">
      <div className={classes.roomNotFound}>ルームが見つかりません</div>
      <MUI.Button variant="contained">TOPへ</MUI.Button>
    </MUI.Container>
  )
}

function playSE() {
  const player = document.createElement('audio')
  player.src = '/drumroll.mp3'
  player.play()
}

const useStyles = makeStyles((theme) => ({
  container: { paddingTop: '64px', textAlign: 'center' },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#444',
    margin: '4rem 0 1rem',
  },
  date: { fontSize: '1.3rem', color: '#676767', margin: '0 0 0.9rem' },
  count: { fontSize: '1.3rem', color: 'gray', marginTop: '0.5rem' },
  number: { fontSize: '5rem', margin: '1.4rem 0 1rem' },
  dialogNumber: {
    fontSize: '20rem',
    width: '500px',
    height: '480px',
    lineHeight: '480px',
    textAlign: 'center',
  },
  roulette: {
    animation: 'roulette 3s linear',
  },
  table: { margin: '2rem auto 0', transition: 'opacity 0.3s' },
  numbers: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'left',
    marginTop: '0.7rem',
  },
  button: { fontWeight: 'bold', color: 'white' },
  prepare: { opacity: 0.5 },
  info: { marginTop: '1rem', color: '#676767' },
  fab: {
    opacity: 0,
    transition: 'opacity 0.5s',
    '&:hover': {
      opacity: 1,
    },
  },
  roomNotFound: {
    fontSize: '1.1rem',
    marginTop: '30%',
    marginBottom: '1rem',
  },
  loading: { position: 'absolute', top: '50%', left: '50%' },
  blinking: { animation: '$blinking 2s ease infinite' },
  '@keyframes blinking': {
    '0%': { opacity: '0' },
    '50%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
}))
