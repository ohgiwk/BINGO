import { useState } from 'react'
import * as MUI from '@material-ui/core'
import moment from 'moment'
import { makeStyles } from '@material-ui/core'

import { Room } from 'common/types'

const RoomDetailDialog: React.FC<{ room: Room }> = ({ room }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const startDate = moment(room.startDate).format('YYYY年MM月DD日hh時mm分〜')

  return (
    <>
      <MUI.Button
        onClick={() => setOpen(true)}
        classes={{
          label: classes.buttonLabel,
        }}
      >
        <div className={classes.roomName}> {room.name}</div>
        <div className={classes.date}>{startDate}</div>
      </MUI.Button>

      <MUI.Dialog open={open} fullWidth>
        <MUI.DialogTitle>ルーム詳細</MUI.DialogTitle>
        <MUI.DialogContent>
          <div className={classes.label}>ルーム名</div>
          <div>{room.name}</div>
          <div className={classes.label}>主催者</div>
          <div>{room.owner}</div>
          <div className={classes.label}>開催日</div>
          <div>{startDate}</div>
        </MUI.DialogContent>

        <MUI.DialogActions>
          <MUI.Button
            variant="contained"
            color="primary"
            className={classes.close}
            onClick={() => setOpen(false)}
          >
            閉じる
          </MUI.Button>
        </MUI.DialogActions>
      </MUI.Dialog>
    </>
  )
}

export default RoomDetailDialog

const useStyles = makeStyles(() => ({
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  roomName: {
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0',
    color: '#676767',
  },
  date: {
    textAlign: 'center',
    margin: '0',
    fontSize: '0.7rem',
    color: '#676767',
  },
  close: {
    fontWeight: 'bold',
    color: '#fff',
  },
}))
