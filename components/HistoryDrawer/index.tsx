import { useContext } from 'react'
// prettier-ignore
import { Drawer, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import { BingoContext } from '../../contexts/BingoContext'
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  history: string[]
}

export default function HistoryDrawer({ history }: Props) {
  const classes = useStyles()

  const { openHistoryDrawer: open, setOpenHistoryDrawer: setOpen } = useContext(
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
          <ListSubheader className={classes.header}>抽選履歴</ListSubheader>
          <List>
            {history.map((h, i) => (
              <ListItem key={i} className={classes.item}>
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
  list: { width: 150 },
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
