import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    flexDirection: 'column',
  },
  h1: {
    fontSize: '4rem',
    fontFamily: "'Lora', serif",
    marginBottom: '3rem',
    opacity: '0.3',
    letterSpacing: '2px',
  },
}))
export default function AppLoading() {
  const classes = useStyles()

  return (
    <Backdrop
      style={{ color: '#fff' }}
      className={classes.backdrop}
      open={true}
    >
      <h1 className={classes.h1}>BINGO</h1>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
