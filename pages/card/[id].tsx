// prettier-ignore
import { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react'
// prettier-ignore
import { Container, Button, Typography, CircularProgress, TextField, Paper, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import firebase from 'firebase'
import moment from 'moment'

import { chunk } from '../../common/utils'
import { Number, Room } from '../../common/types'
import useBingo from '../../hooks/useBingo'
import { AppContext } from '../../contexts/AppContext'
import { BingoContext } from '../../contexts/BingoContext'
import FAB from '../../components/FAB'
import NumberSquare from '../../components/NumberSquare'
import HistoryDrawer from '../../components/HistoryDrawer'
import GiftDrawer from '../../components/GiftDrawer'
import EntryDialog from '../../components/EntryDialog'
import useAPI from '../../hooks/useAPI'

export default function Card() {
  const maxNumber = 75
  const numOfNumbersOnCard = 25

  const router = useRouter()
  const { id: roomId } = router.query

  const { setSnackBar } = useContext(AppContext)
  const { playerName } = useContext(BingoContext)
  const { updateRoom } = useAPI()
  const [entryDialogOpen, setEntryDialogOpen] = useState(false)
  const [numbers, setNumbers] = useState<Number[]>([])
  const [room, setRoom] = useState<Room>()
  const { generateNumbers, toCardNumbers, checkBingo } = useBingo()

  useEffect(() => {
    setNumbers(generateNumbers(maxNumber, numOfNumbersOnCard))

    const roomRef = firebase.database().ref('rooms/' + roomId)
    roomRef.on('value', (snapshot) => {
      setRoom(snapshot.val())
    })
  }, [])

  useEffect(() => {
    if (room) {
      if (room.number === '0') return
      // 抽選画面から配信された数字
      const target = numbers.find((n) => n.number === room.number)

      // SnackBarを表示
      if (room.status === 'started' && playerName) {
        setSnackBar({
          open: true,
          message: `「${room.number}」が出ました！`,
          type: target ? 'success' : 'info',
        })
      }

      // 確定済みの数字列を取得
      const me = room.players?.find((p) => p.name === playerName)
      if (me && me.numbers) {
        toCardNumbers(me.numbers)
      }

      // 履歴にある数字をオープンにする
      let result = numbers.map((n) => ({
        ...n,
        open: (n.open || room.history?.includes(n.number)) ?? false,
      }))

      if (target) {
        result = [
          ...result.map((n) => ({
            ...n,
            open: n === target ? !n.open : n.open,
          })),
        ]
      }

      // setNumbers(checkBingo(result))
    }
  }, [room])

  function onClickNumber(num: Number) {
    if (num.center) return
    const result = checkBingo([
      ...numbers.map((n) => ({ ...n, open: n === num ? !n.open : n.open })),
    ])
    setNumbers(result)
  }

  function onClickEntry() {
    setEntryDialogOpen(true)
  }

  /**
   * 数字の確定
   */
  function onClickSelect() {
    if (room) {
      const players =
        room.players?.map((p) =>
          p.name === playerName
            ? {
                ...p,
                numbers: numbers.map((n) => n.number),
                bingo: 0,
                reach: 0,
              }
            : p
        ) ?? []
      updateRoom(room.id, { ...room, players })
    }
  }

  const onClickRegenerate = () =>
    setNumbers(generateNumbers(maxNumber, numOfNumbersOnCard))

  if (room) {
    return (
      <View
        {...{
          room,
          numbers,
          playerName,
          entryDialogOpen,
          setEntryDialogOpen,
          onClickEntry,
          onClickSelect,
          onClickRegenerate,
          onClickNumber,
        }}
      />
    )
  } else {
    return <LoadingView />
  }
}

const View: React.FC<{
  room: Room
  numbers: Number[]
  playerName: string
  entryDialogOpen: boolean
  setEntryDialogOpen: Dispatch<SetStateAction<boolean>>
  onClickEntry: () => void
  onClickSelect: () => void
  onClickRegenerate: () => void
  onClickNumber: (num: Number) => void
}> = (props) => {
  const classes = useStyles()
  const { room } = props

  return (
    <Container className={classes.container} maxWidth="md">
      {props.playerName && (
        <Typography className={classes.roomId}>
          エントリー中: {props.playerName}
        </Typography>
      )}

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
                onClick={(num) => props.onClickNumber(num)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={classes.buttons}>
        {props.playerName ? (
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
        ) : (
          <Button
            style={{ width: '300px' }}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={props.onClickEntry}
          >
            エントリーする！
          </Button>
        )}
      </div>

      <EntryDialog
        {...{
          room,
          open: props.entryDialogOpen,
          setOpen: props.setEntryDialogOpen,
        }}
      />

      <FAB />
      <GiftDrawer gifts={room.gifts ?? []} />
      <HistoryDrawer history={room.history ?? []} />
    </Container>
  )
}

function LoadingView() {
  const classes = useStyles()
  return <CircularProgress className={classes.loading} />
}

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    paddingTop: '64px',
    paddingBottom: '6rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: { margin: '0' },
  date: { margin: '0', fontSize: '0.7rem', color: '#676767' },
  numbers: { textAlign: 'center', margin: '1rem 0' },
  button: { fontWeight: 'bold', color: '#fff', margin: '5px' },
  buttons: { textAlign: 'center' },

  roomId: { color: 'gray', fontSize: '9px', textAlign: 'right' },
  loading: { position: 'absolute', top: '50%', left: '50%' },
}))
