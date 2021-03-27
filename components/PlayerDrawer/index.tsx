import { useContext } from 'react'
// prettier-ignore
import { Avatar, Drawer, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PersonIcon from '@material-ui/icons/Person'

import { Player } from 'common/types'
import { BingoContext } from 'contexts/BingoContext'

const PlayerDrawer: React.FC<{
  players: Player[]
  isEntered: boolean
}> = ({ players, isEntered }) => {
  const classes = useStyles()

  const { openPlayerDrawer: open, setOpenPlayerDrawer: setOpen } = useContext(
    BingoContext
  )

  const toggleDrawer = (val?: boolean) => setOpen(val ?? !open)

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
      <div
        className={classes.list}
        role="presentation"
        onClick={() => toggleDrawer(false)}
        onKeyDown={() => toggleDrawer(false)}
      >
        <div>
          <ListSubheader className={classes.header}>参加者一覧</ListSubheader>
          <List>
            {isEntered &&
              players.map((p, i) => (
                <ListItem key={i} className={classes.item}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={p.name}
                    secondary={p.message}
                  ></ListItemText>
                </ListItem>
              ))}
            {!isEntered && (
              <ListItem>
                <ListItemText className={classes.pleaseEntry}>
                  エントリーしてください
                </ListItemText>
              </ListItem>
            )}
          </List>
        </div>
      </div>
    </Drawer>
  )
}

export default PlayerDrawer

const useStyles = makeStyles(() => ({
  list: { width: 240 },
  header: { background: '#fff' },
  item: { padding: '0.1rem 16px' },
  pleaseEntry: {
    color: 'gray',
    textAlign: 'center',
  },
  no: {
    color: 'gray',
    width: '30px',
    display: 'inline-block',
  },
  number: {
    marginLeft: '1rem',
    fontWeight: 'normal',
    fontSize: '1.4rem',
  },
}))
