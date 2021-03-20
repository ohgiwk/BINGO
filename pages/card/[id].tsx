import { useState, useEffect } from 'react'
import { Container, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useRouter } from 'next/router'
import { RemoveScroll } from 'react-remove-scroll'

import firebase from '../../common/firebase'
import { chunk } from '../../common/utils'
import { Number, Room } from '../../common/types'
import useCard from '../../hooks/useCard'

import FAB from '../../components/FAB'
import NumberSquare from '../../components/NumberSquare'
import PlayerDrawer from '../../components/PlayerDrawer'
import HistoryDrawer from '../../components/HistoryDrawer'
import GiftDrawer from '../../components/GiftDrawer'
import SpinnerIcon from '../../components/SpinnerIcon'
import EntryButton from '../../components/EntryButton'
import SettingDialog from '../../components/SettingDialog'
import AppLoading from '../../components/AppLoading'
import RoomDetailDialog from '../../components/RoomDetailDialog'
import PlayerMenu from '../../components/PlayerMenu'

const database = firebase.database()

export default function Card() {
  const router = useRouter()
  const { id: roomId } = router.query

  const [room, setRoom] = useState<Room>()

  const {
    numbers,
    isBingo,
    currentUser,
    onUpdateRoom,
    onClickNumber,
    onClickSelect,
    onClickRegenerate,
    demoMode,
  } = useCard()

  useEffect(() => {
    // Room オブジェクトを監視
    const roomRef = database.ref('rooms/' + roomId)
    roomRef.on('value', (snapshot) => {
      setRoom(snapshot.val())
    })
  }, [])

  useEffect(() => {
    if (room) {
      onUpdateRoom(room)
    }
  }, [room])

  useEffect(() => {
    if (!currentUser) {
      return demoMode()
    }
  }, [numbers])

  if (room) {
    return (
      <View
        {...{
          room,
          numbers,
          currentUser,
          isBingo,
          onClickSelect,
          onClickRegenerate,
          onClickNumber,
        }}
      />
    )
  } else {
    return <></>
  }
}

const View: React.FC<{
  room: Room
  numbers: Number[]
  currentUser?: firebase.User
  isBingo: boolean
  onClickSelect: (room: Room) => void
  onClickRegenerate: () => void
  onClickNumber: (num: Number) => void
}> = (props) => {
  const classes = useStyles()
  const { room } = props
  const me = room.players?.find((r) => r.id === props.currentUser?.uid)

  return (
    <RemoveScroll style={{ height: '100%' }}>
      <Container className={classes.container} maxWidth="xs">
        <div style={{ marginLeft: 'auto' }}>
          <PlayerMenu room={room} currentUser={props.currentUser} />
        </div>

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
          {!props.currentUser && <EntryButton {...{ room }} />}

          {props.currentUser && !me?.numbers && (
            <>
              <div>タップして数字を変更できます</div>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => props.onClickSelect(room)}
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

          {room.status !== 'started' && props.currentUser && me?.numbers && (
            <div>
              <SpinnerIcon />
              <div style={{ marginTop: '1rem' }}>
                ビンゴ開始まで少々お待ちください
              </div>
            </div>
          )}
        </div>
        <div className={classes.center}>
          <RoomDetailDialog room={room} />
        </div>
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

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    paddingTop: '64px',
    paddingBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    height: '50px',
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
  numbers: { textAlign: 'center', margin: '1rem 0' },
  button: { fontWeight: 'bold', color: '#fff', margin: '5px' },
  buttons: { textAlign: 'center' },
  setting: {
    position: 'absolute',
    bottom: theme.spacing(3),
    left: theme.spacing(3),
  },
  center: {
    textAlign: 'center',
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
