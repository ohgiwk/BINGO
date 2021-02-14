import { useState, useEffect, useContext, useCallback } from 'react'
import { Container, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'firebase'

import FAB from '../../components/FAB'
import NumberSquare from '../../components/NumberSquare'
import { chunk } from '../../common/utils'
import { Number, Room } from '../../common/types'
import useBingo from '../../hooks/useBingo'
import { AppContext } from '../../contexts/AppContext'
import { useRouter } from 'next/router'
import HistoryDrawer from '../../components/HistoryDrawer'

export default function Card() {
  const classes = useStyles()
  const router = useRouter()
  const { id: roomId } = router.query

  const [started, setStarted] = useState(false)
  const [numbers, setNumbers] = useState<Number[]>([])
  const [snapshot, setSnapshot] = useState<Room>()
  const { generateNumbers, checkBingo } = useBingo()
  const { setSnackBar } = useContext(AppContext)

  useEffect(() => {
    setNumbers(generateNumbers())

    const roomRef = firebase.database().ref('rooms/' + roomId)
    roomRef.on('value', (snapshot) => {
      setSnapshot(snapshot.val())
    })
  }, [])

  useEffect(() => {
    if (snapshot) {
      if (snapshot.number === '0') return

      const target = numbers.find((n) => n.number === snapshot.number)

      setSnackBar({
        open: true,
        message: `「${snapshot.number}」が出ました！`,
        type: target ? 'success' : 'info',
      })

      let result = numbers.map((n) => ({
        ...n,
        open: (n.open || snapshot.history?.includes(n.number)) ?? false,
      }))

      if (target) {
        result = [
          ...result.map((n) => ({
            ...n,
            open: n === target ? !n.open : n.open,
          })),
        ]
      }

      setNumbers(checkBingo(result))
    }
  }, [snapshot])

  function onClickNumber(num: Number) {
    if (num.center) return
    const result = checkBingo([
      ...numbers.map((n) => ({ ...n, open: n === num ? !n.open : n.open })),
    ])
    setNumbers(result)
  }

  function start() {
    setStarted(true)
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Typography className={classes.roomId}>ROOM_ID: dbtuG5bD3x</Typography>
      <Typography variant="h6" className={classes.welcome}>
        カード１
      </Typography>
      <div className={classes.numbers}>
        {chunk(numbers, 5).map((arr, i) => (
          <div key={i}>
            {arr.map((num, j) => (
              <NumberSquare
                key={j}
                number={num}
                onClick={(num) => onClickNumber(num)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={classes.buttons}>
        {!started && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={start}
          >
            決定！
          </Button>
        )}
        {!started && (
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => setNumbers(generateNumbers())}
          >
            選び直す
          </Button>
        )}
      </div>

      <FAB />
      <HistoryDrawer history={snapshot?.history ?? []} />
    </Container>
  )
}

const useStyles = makeStyles(() => ({
  container: { marginTop: '64px' },
  numbers: { textAlign: 'center', margin: '1rem 0' },
  button: { fontWeight: 'bold', color: '#333', margin: '5px' },
  buttons: { textAlign: 'center' },
  welcome: { fontWeight: 'bold', textAlign: 'center', marginTop: '2rem' },
  roomId: { color: 'gray', fontSize: '9px', textAlign: 'right' },
}))
