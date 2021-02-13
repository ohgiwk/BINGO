import React, { useState } from 'react'

// prettier-ignore
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import HomeIcon from '@material-ui/icons/Home'
import SettingsIcon from '@material-ui/icons/Settings'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Link from 'next/Link'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  list: {
    width: 200,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  fullList: { width: 'auto' },
  spaceOuter: {
    height: 'calc(100% - 225px)',
    maskImage:
      'radial-gradient(#000 20%, transparent 20%), radial-gradient(#000 20%, transparent 20%)',
    maskSize: '15px 15px',
    maskPosition: '0 0, 7px 7px',
  },
  space: {
    height: '100%',
    maskImage: 'linear-gradient(0deg, #000 20%, transparent 100%)',
  },
  spaceInner: {
    background:
      'linear-gradient( 30deg, #f1c40f, #e74c3c, #1abc9c, #3498db, #9b59b6, #f1c40f)',
    backgroundSize: '500% 500%',
    animation: 'slideGradient 15s ease infinite',
    height: '100%',
  },
}))

export default function DrawerMenu() {
  const [open, setOpen] = useState(false)

  const classes = useStyles()

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    const { key } = event as React.KeyboardEvent
    if (event.type === 'keydown' && (key === 'Tab' || key === 'Shift')) {
      return
    }

    setOpen(open)
  }

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        onClick={() => setOpen(!open)}
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div>
            <List>
              <Link href="/card">
                <ListItem button>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="ホーム" />
                </ListItem>
              </Link>

              <Link href="/settings">
                <ListItem button>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="設定" />
                </ListItem>
              </Link>
            </List>
          </div>

          <div className={classes.spaceOuter}>
            <div className={classes.space}>
              <div className={classes.spaceInner}></div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}
