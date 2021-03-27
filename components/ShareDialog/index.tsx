import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import QRCode from 'qrcode.react'

import { Room } from 'common/types'

const ShareDialog: React.FC<{
  room?: Room
  open: boolean
  setOpen: (arg: boolean) => void
}> = ({ room, open, setOpen }) => {
  const classes = useStyles()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <MUI.Dialog fullWidth open={open} onClose={handleClose}>
      <MUI.DialogTitle>URLの共有</MUI.DialogTitle>
      <MUI.DialogContent>
        <MUI.DialogContentText>
          URLをシェアして参加者を集めよう。
        </MUI.DialogContentText>
        <MUI.TextField
          className={classes.urlInput}
          value={`${location.origin}/card/${room?.id}`}
          InputProps={{
            readOnly: true,
          }}
        />
        <div className={classes.qr}>
          <QRCode size={300} value={`${location.origin}/card/${room?.id}`} />
        </div>
      </MUI.DialogContent>
      <MUI.DialogActions>
        <MUI.Button onClick={handleClose} color="primary">
          閉じる
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  )
}

export default ShareDialog

const useStyles = makeStyles(() => ({
  qr: {
    textAlign: 'center',
    margin: '1rem 0',
  },
  urlInput: {
    width: '90%',
  },
}))
