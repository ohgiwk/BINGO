import { useState } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import EntryDialog from '../../components/EntryDialog'
import { Room } from '../../common/types'

function EntryButton(props: { room: Room }) {
  const classes = useStyles()

  const [entryDialogOpen, setEntryDialogOpen] = useState(false)
  function onClickEntry() {
    setEntryDialogOpen(true)
  }

  return (
    <>
      <Button
        style={{ width: '300px' }}
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={onClickEntry}
      >
        エントリーする！
      </Button>

      <EntryDialog
        {...{
          room: props.room,
          open: entryDialogOpen,
          setOpen: setEntryDialogOpen,
        }}
      />
    </>
  )
}
export default EntryButton

const useStyles = makeStyles(() => ({
  button: { fontWeight: 'bold', color: '#fff', margin: '5px' },
}))
