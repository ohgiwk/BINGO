import { useState } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { range, chunk, shuffle } from '../common/utils'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: '64px',
    textAlign: 'center',
  },
  number: {
    fontSize: '5rem',
    margin: '2rem 0 1rem',
  },
  table: {
    margin: '2rem auto 0',
  },
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
  },
  open: {
    color: theme.palette.primary.main,
  },
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
    },
  },
  button: {
    fontWeight: 'bold',
    color: 'white',
  },
}))

type Number = {
  n: string
  open: boolean
}

export default function Home() {
  const maxNumber = 75
  const classes = useStyles()
  const [running, setRunning] = useState(false)
  const [number, setNumber] = useState<string>('0')
  const [numbers, setNumbers] = useState<Number[]>(
    range(Math.ceil(maxNumber / 10) * 10, 1).map((n) => ({
      n: n <= maxNumber ? String(n) : '',
      open: false,
    }))
  )

  const onClick = () => {
    setRunning(true)

    new Promise((resolve) => {
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
      }, 2000)
    }).then((newNumber) => {
      setNumbers(
        numbers.map((n) => ({
          ...n,
          open: n.n === String(newNumber) ? true : n.open,
        }))
      )
      setRunning(false)
    })
  }

  return (
    <Container className={classes.container} maxWidth="md">
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
    </Container>
  )
}
