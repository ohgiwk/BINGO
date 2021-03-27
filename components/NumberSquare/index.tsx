import { Button } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Number } from '../../common/types'

const Square = withStyles(() => ({
  root: {
    backgroundColor: '#fff',

    '&:hover': {
      backgroundColor: '#fff',
    },
  },
}))(Button)

const NumberSquare: React.FC<{
  number: Number
  history: string[]
  onClick: (number: Number) => void
}> = ({ number, history, onClick }) => {
  const classes = useStyles()

  // const incorrect = !number.center && !history.includes(number.number)
  const incorrect = false

  return (
    <Square
      disableElevation
      variant="contained"
      className={`
        ${classes.number}
        ${number.open && classes.opened}
        ${number.center && classes.center}
        ${number.reach && !incorrect && classes.reach}
        ${number.bingo && !incorrect && classes.bingo}
        ${number.open && incorrect && classes.incorrect}
      `}
      onClick={() => onClick(number)}
    >
      {number.number}
    </Square>
  )
}

export default NumberSquare

const useStyles = makeStyles((theme) => ({
  number: {
    width: '64px',
    minWidth: '64px',
    height: '64px',
    margin: '0.2rem',
    textAlign: 'center',
    fontSize: '1.8rem',
    borderRadius: '50%',
    color: theme.palette.primary.main,
    background: '#fff',
    transition: 'transform 0.1s, color 0.4s, background 0.4s',
    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.2)!important',

    '&:active': {
      transform: 'scale(0.8)',
    },
  },
  opened: {
    color: '#fff',
    background: theme.palette.primary.main + '!important',
    // background: 'linear-gradient(45deg, #ff89a3 30%, #ff8e53 100%)',
  },
  reach: {
    border: `solid 3px ${theme.palette.primary.main}`,
    animation: '$reach 1s linear alternate infinite',
  },
  bingo: {
    color: '#fff',
    background: 'red!important',
    // background:
    //   'linear-gradient(90deg, #ff0000 0%, #ffa500 25%, #fffb29, 50%, #66ffd0 75%, #ff0000 100%)',
    border: 'red',
    // backgroundSize: '1000% 1000%',
    // animation: 'slideGradient 30s linear infinite',
  },
  center: { borderRadius: '10%' },
  incorrect: { background: '#888!important' },

  '@keyframes reach': {
    '0%': { borderColor: '#fff' },
    '100%': { borderColor: theme.palette.primary.main },
  },
}))
