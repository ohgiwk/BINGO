import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import QRCode from 'qrcode.react'

const QRPanel: React.FC<{}> = (props) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  return (
    <QRCode
      size={350}
      value={`http://localhost:3000`}
      className={`${classes.qr} ${open ? classes.open : ''}`}
      onClick={() => setOpen(!open)}
    />
  )
}

export default QRPanel

const useStyles = makeStyles(() => ({
  qr: {
    position: 'absolute',
    bottom: '30px',
    left: '30px',
    opacity: 0.4,
    transformOrigin: 'bottom left',
    transform: 'scale(0.15)',
    marginLeft: '0px',
    transition:
      'bottom 0.5s, left 0.5s, transform 0.5s, opacity 0.5s, margin 0.5s',
    padding: '10px',
  },
  open: {
    position: 'absolute',
    bottom: '100px',
    left: '50%',
    transform: 'scale(1)',
    opacity: 1,

    marginLeft: '-175px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '5px',
    background: '#fff',
  },
}))
