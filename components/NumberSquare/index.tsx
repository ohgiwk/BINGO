import { Button } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Number } from '../../common/types'

const useStyles = makeStyles((theme) => ({
  number: {
    width: '56px',
    minWidth: '56px',
    height: '56px',
    margin: '0.2rem',
    textAlign: 'center',
    fontSize: '1.8rem',
    borderRadius: '50%',
    color: theme.palette.primary.main,
    background: '#fff',
    transition: 'color 0.5s, background 0.5s',
  },
  opened: {
    color: '#fff',
    background: '#ff89a3!important',
    // background: 'linear-gradient(45deg, #ff89a3 30%, #ff8e53 100%)',
  },
  reach: {
    border: `solid 3px ${theme.palette.primary.main}`,
    animation: 'reach 1s linear alternate infinite',
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
}))

const Square = withStyles(() => ({
  root: {
    backgroundColor: '#fff',
    '&:hover': { backgroundColor: '#fff' },
  },
}))(Button)

interface Props {
  number: Number
  onClick: (number: Number) => void
}

export default function NumberSquare({ number, onClick }: Props) {
  const classes = useStyles()

  return (
    <Square
      disableElevation
      variant="contained"
      className={`
        ${classes.number}
        ${number.open && classes.opened}
        ${number.reach && classes.reach}
        ${number.bingo && classes.bingo}
        ${number.center && classes.center}
      `}
      onClick={() => onClick(number)}
    >
      {number.number}
    </Square>
  )
}
