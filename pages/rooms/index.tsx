import React, { useState, useEffect } from 'react'
import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/link'

import firebase from 'common/firebase'
import { Room } from 'common/types'
import ShareDialog from 'components/ShareDialog'

const database = firebase.database()

const Admin: React.FC<{}> = () => {
  const classes = useStyles()
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room>()

  useEffect(() => {
    const roomsRef = database.ref('rooms/')

    roomsRef.on('value', (snapshot) => {
      const rooms = snapshot.val()
      if (rooms) {
        setRooms(Object.values(rooms))
      }
    })
  }, [])

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <MUI.Container className={classes.container} maxWidth="md">
        <MUI.List>
          <MUI.ListSubheader className={classes.header}>
            <div>ルーム一覧</div>
            <div>
              <Link href="/rooms/create">
                <MUI.Button
                  variant="contained"
                  color="primary"
                  className={`${classes.button}`}
                >
                  ルームを作成する
                </MUI.Button>
              </Link>
            </div>
          </MUI.ListSubheader>
          {rooms.length > 0 ? (
            rooms.map((r, i) => (
              <MUI.ListItem key={i}>
                <MUI.ListItemIcon>
                  <MUI.Checkbox />
                </MUI.ListItemIcon>

                <Link href={`/rooms/${r.id}`}>
                  <MUI.ListItemText>
                    <MUI.Link>{r.name}</MUI.Link>
                  </MUI.ListItemText>
                </Link>

                <MUI.ListItemSecondaryAction>
                  <MUI.Button
                    onClick={() => {
                      setSelectedRoom(r)
                      setOpen(true)
                    }}
                  >
                    共有
                  </MUI.Button>
                  <MUI.Button>編集</MUI.Button>
                </MUI.ListItemSecondaryAction>
              </MUI.ListItem>
            ))
          ) : (
            <MUI.ListItem>ルームがありません</MUI.ListItem>
          )}
        </MUI.List>
      </MUI.Container>

      <ShareDialog {...{ room: selectedRoom, open, setOpen }} />
    </>
  )
}

export default Admin

const useStyles = makeStyles(() => ({
  container: { paddingTop: '64px' },
  button: { fontWeight: 'bold', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between' },
  qr: {
    textAlign: 'center',
    margin: '1rem 0',
  },
  urlInput: {
    width: '90%',
  },
}))
