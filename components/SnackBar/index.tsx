import { makeStyles } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

const Alert = (props: AlertProps) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
)

const SnackBar: React.FC<{
  open: boolean
  message?: string
  severity?: 'success' | 'info' | 'warning' | 'error'
  onClose?: any
  vertical?: 'top' | 'bottom'
  horizontal?: 'left' | 'right' | 'center'
}> = (props) => {
  const classes = useStyles()

  const message = props.message ?? ''
  const severity = props.severity ?? undefined
  const onClose = props.onClose ?? (() => {})
  const vertical = props.vertical ?? 'bottom'
  const horizontal = props.horizontal ?? 'center'

  return (
    <Snackbar
      classes={{ anchorOriginTopCenter: classes.top }}
      anchorOrigin={{
        vertical,
        horizontal,
      }}
      open={props.open}
      onClose={onClose}
      autoHideDuration={6000}
    >
      <Alert onClose={onClose} severity={severity} icon={null}>
        {message}
      </Alert>
    </Snackbar>
  )
}

const useStyles = makeStyles((theme) => ({
  top: {
    top: '64px',
  },
}))

export default SnackBar
