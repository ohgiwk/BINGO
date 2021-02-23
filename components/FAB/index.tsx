import React, { useContext, useState } from 'react'
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import RedeemOutlinedIcon from '@material-ui/icons/RedeemOutlined'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'

import MenuIcon from '@material-ui/icons/Menu'
import ListIcon from '@material-ui/icons/List'
import { BingoContext } from '../../contexts/BingoContext'

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp': {
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
  },
}))

export default function FAB(props: { className?: string }) {
  const classes = useStyles()
  const [fab, setFab] = useState(false)

  const { setOpenHistoryDrawer, setOpenGiftDrawer } = useContext(BingoContext)

  return (
    <SpeedDial
      ariaLabel="SpeedDial"
      className={`${classes.speedDial} ${props.className}`}
      icon={
        <SpeedDialIcon
          icon={<MenuIcon htmlColor="#fff" />}
          openIcon={<CloseOutlinedIcon />}
        />
      }
      open={fab}
      onClose={() => setFab(false)}
      onOpen={() => setFab(true)}
      direction="up"
    >
      <SpeedDialAction
        key="number history"
        color="primary"
        icon={<ListIcon />}
        tooltipTitle={'抽選履歴'}
        tooltipOpen
        onClick={() => {
          setOpenHistoryDrawer(true)
        }}
      />
      <SpeedDialAction
        key="show gift list"
        color="primary"
        icon={<RedeemOutlinedIcon />}
        tooltipTitle={'景品一覧'}
        tooltipOpen
        onClick={() => {
          setOpenGiftDrawer(true)
        }}
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
