import React, { useState } from 'react'
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import RedeemOutlinedIcon from '@material-ui/icons/RedeemOutlined'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp': {
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
  },
}))

export default function FAB() {
  const classes = useStyles()
  const [fab, setFab] = useState(false)
  const iconStyle: React.CSSProperties = {
    fontSize: '20px',
    color: 'rgb(255 243 243)',
  }

  return (
    <SpeedDial
      ariaLabel="SpeedDial"
      className={classes.speedDial}
      icon={
        <SpeedDialIcon
          icon={<FontAwesomeIcon style={iconStyle} icon={faInfo} />}
          openIcon={<CloseOutlinedIcon style={{ marginLeft: '-8px' }} />}
        />
      }
      open={fab}
      onClose={() => setFab(false)}
      onOpen={() => setFab(true)}
      direction="up"
    >
      <SpeedDialAction
        key="show gift list"
        color="primary"
        icon={<RedeemOutlinedIcon />}
        tooltipTitle={'景品一覧'}
        tooltipOpen
        onClick={() => {}}
      />
      <SpeedDialAction
        key="show user list"
        icon={<PeopleAltOutlinedIcon />}
        tooltipTitle={'参加者一覧'}
        tooltipOpen
        onClick={() => {}}
      />
    </SpeedDial>
  )
}
