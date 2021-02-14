import React, { useState, useEffect } from 'react'
import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import firebase from 'firebase'
import Link from 'next/Link'
import QRCode from 'qrcode.react'

import { Room } from '../common/types'

const Admin: React.FC<{}> = () => {
  const classes = useStyles()
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    const roomsRef = firebase.database().ref('rooms/')

    roomsRef.on('value', (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      setRooms(Object.values(data))
    })
  }, [])

  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <MUI.Container className={classes.container}>
        <MUI.List>
          <MUI.ListSubheader>ルーム一覧</MUI.ListSubheader>
          {rooms.map((r, i) => (
            <MUI.ListItem key={i}>
              <Link href={`/room/${r.id}`}>
                <MUI.ListItemText>
                  <MUI.Link>{r.name}</MUI.Link>
                </MUI.ListItemText>
              </Link>
              <MUI.ListItemSecondaryAction>
                <MUI.Button onClick={() => setOpen(true)}>共有</MUI.Button>
                <MUI.Button>編集</MUI.Button>
              </MUI.ListItemSecondaryAction>
            </MUI.ListItem>
          ))}
        </MUI.List>
        <Link href="/rooms/create">
          <MUI.Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            ルーム作成
          </MUI.Button>
        </Link>
      </MUI.Container>

      <MUI.Dialog open={open} onClose={handleClose}>
        <MUI.DialogTitle>URLの共有</MUI.DialogTitle>
        <MUI.DialogContent>
          <MUI.DialogContentText>
            URLをシェアして参加者を集めよう。
          </MUI.DialogContentText>
          <MUI.TextField
            className={classes.urlInput}
            value={location.href}
            InputProps={{
              readOnly: true,
            }}
          />
          <div className={classes.qr}>
            <QRCode size={300} value={location.href} />
          </div>
        </MUI.DialogContent>
        <MUI.DialogActions>
          <MUI.Button onClick={handleClose} color="primary">
            閉じる
          </MUI.Button>
        </MUI.DialogActions>
      </MUI.Dialog>
    </>
  )
}

export default Admin

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: '64px',
  },
  button: {
    fontWeight: 'bold',
    color: '#fff',
  },
  qr: {
    textAlign: 'center',
    margin: '1rem 0',
  },
  urlInput: {
    width: '90%',
  },
}))
