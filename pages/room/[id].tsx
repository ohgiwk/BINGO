import { useState, useEffect, useContext } from 'react'
// prettier-ignore
import { Button, ButtonGroup, Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'firebase'
import { useRouter } from 'next/router'

import FAB from '../../components/FAB'
import { BingoContext } from '../../contexts/BingoContext'
import HistoryDrawer from '../../components/HistoryDrawer'
import { range, chunk, shuffle } from '../../common/utils'
import { Room } from '../../common/types'

type Number = {
  n: string
  open: boolean
}

export default function LotteryRoom() {
  const classes = useStyles()
  const router = useRouter()
  const { id: roomId } = router.query
  const { history, setHistory } = useContext(BingoContext)

  const maxNumber = 75
  const [number, setNumber] = useState<string>('0')
  const [numbers, setNumbers] = useState<Number[]>(
    range(Math.ceil(maxNumber / 10) * 10, 1).map((n) => ({
      n: n <= maxNumber ? String(n) : '',
      open: false,
    }))
  )
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const roomRef = firebase.database().ref('rooms/' + roomId)
    roomRef.on('value', (snapshot) => {
      const { history } = snapshot.val() as Room

      setNumbers(
        numbers.map((n) => ({ ...n, open: history?.includes(n.n) ?? false }))
      )
      setHistory(history ?? [])
    })
  }, [])

  function playSE() {
    const player = document.createElement('audio')
    player.src = '/drumroll.mp3'
    player.play()
  }

  const onClick = () => {
    setRunning(true)
    playSE()

    new Promise<string>((resolve) => {
      let num = ''
      const list = shuffle(
        numbers.filter((n) => !n.open && n.n).map((n) => n.n)
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
          open: n.n === String(newNumber) ? true : n.open,
        }))
      )

      firebase
        .database()
        .ref('rooms/' + roomId)
        .set({
          number: newNumber,
          history: [...history, newNumber],
        })

      setHistory([...history, newNumber])
      setRunning(false)
    })
  }

  function reset() {
    firebase
      .database()
      .ref('rooms/' + roomId)
      .set({
        number: '0',
        history: [],
      })
    setNumber('0')
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Typography className={classes.count}>
        {history.length} / {numbers.filter((h) => h.n).length}
      </Typography>
      <Typography className={classes.number}>{number}</Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={onClick}
        disabled={running}
      >
        抽選する！
      </Button>

      <div className={classes.table}>
        {chunk(numbers, 10).map((arr, i) => (
          <div key={i} className={classes.numbers}>
            {arr.map((number, j) => (
              <div
                key={j}
                className={`
                  ${classes.num}
                  ${number.open && classes.open}
                  ${classes.ripple}
                  ${number.open && classes.onRipple}
                `}
              >
                {number.n}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={classes.floatArea}>
        <ButtonGroup variant="text" color="primary">
          <Button onClick={reset}>リセット</Button>
        </ButtonGroup>
      </div>

      <div className={classes.fab}>
        <FAB />
      </div>
      <HistoryDrawer history={history} />
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  container: { paddingTop: '64px', textAlign: 'center' },
  count: { fontSize: '1.3rem', color: 'gray', marginTop: '0.5rem' },
  number: { fontSize: '5rem', margin: '1.4rem 0 1rem' },
  table: { margin: '2rem auto 0' },
  numbers: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'left',
    marginTop: '0.7rem',
  },
  num: {
    fontSize: '2rem',
    color: 'gray',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    lineHeight: '40px',
    textAlign: 'center',
    userSelect: 'none',
  },
  open: { color: theme.palette.primary.main },
  ripple: {
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: theme.palette.primary.main,
      borderRadius: '50%',
      width: 0,
      height: 0,
      opacity: 1,
      transition: 'opacity 1s, width 1s, height 1s',
    },
  },
  onRipple: {
    '&:after': {
      content: '',
      width: '150px',
      height: '150px',
      opacity: 0,
      transition: 'opacity 1s, width 1s, height 1s',
      pointerEvents: 'none',
    },
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
  fab: {
    opacity: 0,
    transition: 'opacity 0.5s',
    '&:hover': {
      opacity: 1,
    },
  },
}))
