import { useState, useEffect, useContext } from 'react'
// prettier-ignore
import { Button, ButtonGroup, CircularProgress, Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'firebase'
import { useRouter } from 'next/router'

import { range, chunk, shuffle } from '../../common/utils'
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

  const { openDialog, closeDialog } = useContext(AppContext)
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

  useEffect(() => {
    setIsLoading(true)

    const roomRef = firebase.database().ref('rooms/' + roomId)
    roomRef.on('value', (snapshot) => {
      const room = snapshot.val() as Room

      if (room) {
        setNumbers(
          numbers.map((n) => ({
            ...n,
            open: room.history?.includes(n.value) ?? false,
          }))
        )
        setRoom(room)
      } else {
        setIsValidRoomId(false)
      }

      setIsLoading(false)
    })
  }, [])

  const onClick = () => {
    setRunning(true)
    playSE()

    new Promise<string>((resolve) => {
      let num = ''
      const list = shuffle(
        numbers.filter((n) => !n.open && n.value).map((n) => n.value)
      )

      const timer = setInterval(() => {
        const random = Math.floor(Math.random() * list.length)
        num = list[random]
        setNumber(num)
      }, 50)

      setTimeout(() => {
        clearInterval(timer)
        resolve(num)
      }, 3000)
    }).then((newNumber) => {
      setNumbers(
        numbers.map((n) => ({
          ...n,
          open: n.value === String(newNumber) ? true : n.open,
        }))
      )

      if (room) {
        updateRoom(roomId, {
          ...room,
          number: newNumber,
          history: [...(room.history ?? []), newNumber],
        })
      }

      setRunning(false)
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
      <MainView
        {...{
          room,
          numbers,
          number,
          running,
          onClick,
          onClickStart,
          onClickReset,
        }}
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
  onClick: () => void
  onClickStart: () => void
  onClickReset: () => void
}> = (props) => {
  const classes = useStyles()

  const { room } = props

  return (
    <Container className={classes.container} maxWidth="md">
      <Typography className={classes.count}>
        {`${room.history?.length ?? 0} / ${
          props.numbers.filter((h) => h.value).length
        }`}
      </Typography>
      <Typography
        className={`
        ${classes.number} ${room.status !== 'started' && classes.prepare}`}
      >
        {props.number}
      </Typography>

      {room.status !== 'started' ? (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={props.onClickStart}
          disabled={props.running}
        >
          ビンゴを開始する！
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={props.onClick}
          disabled={props.running}
        >
          抽選する！
        </Button>
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
      <div className={classes.info}>
        現在の参加人数: {room.players?.length ?? 0}人
      </div>
      {/* <div className={classes.info}>現在のビンゴ数: 1</div>
      <div className={classes.info}>現在のリーチ数: 1</div> */}

      <FAB className={classes.fab} />
      <PlayerDrawer players={room.players ?? []} />
      <GiftDrawer gifts={room.gifts ?? []} />
      <HistoryDrawer history={room.history ?? []} />
    </Container>
  )
}

function LoadingView() {
  const classes = useStyles()
  return <CircularProgress className={classes.loading} />
}

function NotFoundView() {
  const classes = useStyles()

  return (
    <Container className={classes.container} maxWidth="md">
      <div className={classes.roomNotFound}>ルームが見つかりません</div>
      <Button variant="contained">TOPへ</Button>
    </Container>
  )
}

function playSE() {
  const player = document.createElement('audio')
  player.src = '/drumroll.mp3'
  player.play()
}

const useStyles = makeStyles((theme) => ({
  container: { paddingTop: '64px', textAlign: 'center' },
  count: { fontSize: '1.3rem', color: 'gray', marginTop: '0.5rem' },
  number: { fontSize: '5rem', margin: '1.4rem 0 1rem' },
  table: { margin: '2rem auto 0', transition: 'opacity 0.3s' },
  numbers: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'left',
    marginTop: '0.7rem',
  },
  button: { fontWeight: 'bold', color: 'white' },
  floatArea: {
    boxShadow: '0 0 5px rgba(0,0,0, 0.3)',
    borderRadius: '20px',
    marginTop: '1rem',
    opacity: 0,
    transition: 'opacity 0.5s',
    '&:hover': {
      opacity: 1,
    },
  },
  prepare: {
    opacity: 0.5,
  },
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
}))
