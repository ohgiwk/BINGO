import { useContext } from 'react'
// prettier-ignore
import { Drawer, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import { BingoContext } from '../../contexts/BingoContext'
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  gifts: string[]
}

export default function GiftDrawer({ gifts }: Props) {
  const classes = useStyles()

  const { openGiftDrawer: open, setOpenGiftDrawer: setOpen } = useContext(
    BingoContext
  )

  const toggleDrawer = (val?: boolean) => {
    setOpen(val ?? !open)
  }

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
      <div
        className={classes.list}
        role="presentation"
        onClick={() => toggleDrawer(false)}
        onKeyDown={() => toggleDrawer(false)}
      >
        <div>
          <ListSubheader className={classes.header}>景品一覧</ListSubheader>
          <List>
            {gifts.map((h, i) => (
              <ListItem button key={i} className={classes.item}>
                <ListItemText>
                  <span className={classes.no}>{i + 1}. </span>
                  <span className={classes.number}>{h}</span>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </Drawer>
  )
}
const useStyles = makeStyles(() => ({
  list: { width: 250 },
  header: { background: '#fff' },
  item: { padding: '0.1rem 16px' },
  no: {
    color: 'gray',
    width: '30px',
    display: 'inline-block',
  },
  number: {
    marginLeft: '0rem',
    fontWeight: 'normal',
    fontSize: '1.2rem',
  },
}))
