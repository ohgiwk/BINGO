import { useContext, useState } from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import FaceIcon from '@material-ui/icons/Face'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import API from 'common/API'
import firebase from 'common/firebase'
import { AppContext } from 'contexts/AppContext'
import { Room } from 'common/types'

const PlayerMenu: React.FC<{ room: Room; currentUser?: firebase.User }> = ({
  room,
  currentUser,
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { setIsLoading } = useContext(AppContext)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const leaveTheRoom = async () => {
    setIsLoading(true)
    await firebase.auth().signOut()

    await API.updateRoom(room.id, {
      ...room,
      players: room.players?.filter((p) => p.id !== currentUser?.uid) ?? [],
    })

    setAnchorEl(null)
    setIsLoading(false)
  }

  return (
    <>
      <Button
        className={classes.player}
        onClick={handleClick}
        disabled={!currentUser}
      >
        <FaceIcon style={{ marginRight: '5px' }} />
        {currentUser
          ? `エントリー中: ${currentUser.displayName}`
          : '未エントリー'}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem dense onClick={leaveTheRoom}>
          <ExitToAppIcon /> ルームを出る
        </MenuItem>
      </Menu>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  player: {
    color: 'gray',
    fontSize: '10px',
    textTransform: 'none',
  },
}))

export default PlayerMenu
