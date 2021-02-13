import { useState, useEffect } from 'react'
import { Container, Button, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import FAB from '../components/FAB'
import NumberSquare from '../components/NumberSquare'
import { chunk } from '../common/utils'
import { Number } from '../common/types'
import useBingo from '../hooks/useBingo'

const useStyles = makeStyles(() => ({
  container: { marginTop: '64px' },
  numbers: { textAlign: 'center', margin: '1rem 0' },
  button: { fontWeight: 'bold', color: '#333' },
  welcome: { fontWeight: 'bold', textAlign: 'center', marginTop: '2rem' },
  roomId: { color: 'gray', fontSize: '9px', textAlign: 'right' },
}))

export default function Card() {
  const classes = useStyles()
  const [numbers, setNumbers] = useState<Number[]>([])
  const { generateNumbers, checkBingo } = useBingo()

  useEffect(() => {
    setNumbers(generateNumbers())
  }, [])

  function onClickNumber(num: Number) {
    if (num.center) return
    const result = checkBingo([
      ...numbers.map((n) => ({ ...n, open: n === num ? !n.open : n.open })),
    ])
    setNumbers(result)
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
        {/*
        <Typography variant="h6" className={classes.welcome}>
          ようこそ！
        </Typography> */}
        {/* <Button variant="contained">確認する</Button> */}

        {/* <form noValidate autoComplete="off">
          <TextField label="お名前" />
        </form>
 */}

        {/*
        <Button variant="contained" color="primary" className={classes.button}>
          決定！
        </Button> */}
      </div>
      <Button
        variant="contained"
        onClick={() => setNumbers(generateNumbers())}
        className={classes.button}
      >
        選び直す
      </Button>
      <FAB />
    </Container>
  )
}
