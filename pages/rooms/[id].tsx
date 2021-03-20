import { useEffect } from 'react'
import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import moment from 'moment'

import firebase from '../../common/firebase'
import { chunk } from '../../common/utils'
import { Room, RoomNumber } from '../../common/types'
import useRoom from '../../hooks/useRoom'

import FAB from '../../components/FAB'
import HistoryDrawer from '../../components/HistoryDrawer'
import GiftDrawer from '../../components/GiftDrawer'
import RippleNumber from '../../components/RippleNumber'
import PlayerDrawer from '../../components/PlayerDrawer'
import QRPanel from '../../components/QRPanel'

const database = firebase.database()

export default function LotteryRoom() {
  const router = useRouter()
  const { id: roomId } = router.query as { id: string }

  const {
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
  } = useRoom()

  useEffect(() => {
    // setIsLoading(true)

    const roomRef = database.ref('rooms/' + roomId)
    roomRef.on('value', (snapshot) => {
      onUpdateRoom(snapshot.val() as Room)
    })
  }, [])

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
  numbers: RoomNumber[]
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
          <MUI.Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={props.onClick}
            disabled={props.running}
          >
            抽選する！
          </MUI.Button>
        </>
      ) : (
        <>
          <MUI.Typography className={`${classes.title}`}>
            {room.name}
          </MUI.Typography>
          <MUI.Typography className={classes.date}>
            {moment(room.startDate).format('YYYY年MM月DD日hh時mm分〜')}
          </MUI.Typography>
          <MUI.Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={props.onClickStart}
            disabled={props.running}
          >
            ビンゴを開始する！
          </MUI.Button>
        </>
      )}

      <div
        className={`
        ${classes.table} ${room.status !== 'started' && classes.prepare}`}
      >
        {chunk(props.numbers, 10).map((arr, i) => (
          <div key={i} className={classes.numbers}>
            {arr.map((number, j) => (
              <RippleNumber key={j} {...number} />
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

      <QRPanel />

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
  on: {
    // transform: 'scale(1.2)',
  },
}))
