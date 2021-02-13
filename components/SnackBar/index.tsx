import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

const Alert = (props: AlertProps) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
)

interface Props {
  open: boolean
  message?: string
  severity?: 'success' | 'info' | 'warning' | 'error'
  onClose?: any
}

export default function SnackBar(props: Props) {
  const message = props.message ?? ''
  const severity = props.severity ?? undefined
  const onClose = props.onClose ?? (() => {})

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={props.open}
      onClose={onClose}
      autoHideDuration={6000}
    >
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}
