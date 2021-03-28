import { useContext } from 'react'
// prettier-ignore
import { Drawer, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

import { BingoContext } from 'contexts/BingoContext'
import { reverse } from 'common/utils'
import { CardNumber } from 'common/types'

const HistoryDrawer: React.FC<{
  history: string[]
  isEntered: boolean
  numbers?: CardNumber[]
}> = ({ history, isEntered, numbers }) => {
  const classes = useStyles()

  const { openHistoryDrawer: open, setOpenHistoryDrawer: setOpen } = useContext(
    BingoContext
  )

  const toggleDrawer = (val?: boolean) => setOpen(val ?? !open)
  const opens = numbers?.filter((n) => n.open).map((n) => n.number) ?? []

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
            {isEntered &&
              reverse(history).map((h, i) => (
                <ListItem key={i} className={classes.item}>
                  <ListItemText>
                    <span className={classes.no}>{history.length - i}. </span>
                    <span
                      className={classNames(classes.number, {
                        [`${classes.open}`]: opens.includes(h),
                      })}
                    >
                      {h}
                    </span>
                  </ListItemText>
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

export default HistoryDrawer

const useStyles = makeStyles((theme) => ({
  list: { width: 150 },
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
  open: {
    color: theme.palette.primary.main,
  },
}))
