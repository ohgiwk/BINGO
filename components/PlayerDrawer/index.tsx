import { useContext } from 'react'
// prettier-ignore
import { Avatar, Drawer, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'

import { BingoContext } from '../../contexts/BingoContext'
import { makeStyles } from '@material-ui/core/styles'
import { Player } from '../../common/types'

const PlayerDrawer: React.FC<{
  players: Player[]
}> = ({ players }) => {
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
            {players.map((p, i) => (
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
          </List>
        </div>
      </div>
    </Drawer>
  )
}

export default PlayerDrawer

const useStyles = makeStyles(() => ({
  list: { width: 200 },
  header: { background: '#fff' },
  item: { padding: '0.1rem 16px' },
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
