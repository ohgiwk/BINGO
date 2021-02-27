import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import * as MUI from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { v4 as uuidv4 } from 'uuid'

import { Room } from '../../common/types'
import useAPI from '../../hooks/useAPI'
import { AppContext } from '../../contexts/AppContext'
import { BingoContext } from '../../contexts/BingoContext'

const EntryDialog: React.FC<{
  room: Room
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ room, open, setOpen }) => {
  const classes = useStyles()
  const { updateRoom } = useAPI()
  const { openDialog, closeDialog } = useContext(AppContext)
  const { setPlayerId } = useContext(BingoContext)

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  function onClickEntry() {
    openDialog({
      text: 'エントリーしますか？',
      primaryButtonText: 'OK',
      secondaryButtonText: 'キャンセル',
      onClickPrimaryButton: async () => {
        // プレイヤーを追加
        const id = uuidv4()
        await updateRoom(room.id, {
          ...room,
          players: [...(room.players ?? []), { id, name, message }],
        })

        setPlayerId(id)
        closeDialog()

        openDialog({
          text: 'エントリーしました！',
          primaryButtonText: 'OK',
          onClickPrimaryButton: () => {
            closeDialog()
            setOpen(false)
          },
        })
      },
      onClickSecondaryButton: () => {
        closeDialog()
      },
    })
  }

  return (
    <MUI.Dialog open={open} fullWidth>
      <MUI.DialogTitle>
        <div className={classes.title}>
          ビンゴへ参加！
          <MUI.IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </MUI.IconButton>
        </div>
      </MUI.DialogTitle>
      <MUI.DialogContent>
        <div>
          <div className={classes.text}>エントリー情報を入力してください</div>
          <div className={classes.label}>お名前</div>
          <MUI.TextField
            className={classes.field}
            variant="outlined"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
          <div className={classes.label}>メッセージ</div>
          <MUI.TextField
            className={classes.field}
            variant="outlined"
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
          />

          <div className={classes.buttons}>
            <MUI.Button
              variant="contained"
              color="primary"
              className={classes.entryBtn}
              onClick={onClickEntry}
              disabled={!name}
            >
              エントリー
            </MUI.Button>
          </div>
        </div>

        <MUI.Divider className={classes.divider} />

        <div className={classes.text}>ルーム情報</div>
        <div className={classes.row}>
          <div>ルーム名：{room.name}</div>
        </div>
        <div className={classes.row}>
          <div>主催者：{room.owner}</div>
        </div>
      </MUI.DialogContent>
      <MUI.DialogActions></MUI.DialogActions>
    </MUI.Dialog>
  )
}

const useStyles = makeStyles(() => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    lineHeight: '48px',
  },
  buttons: { textAlign: 'center' },
  divider: { margin: '1rem 0' },
  row: { textAlign: 'center', margin: '0.5rem 0' },
  text: { fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' },
  label: { fontWeight: 'bold', textAlign: 'center', margin: '1rem 0 0.5rem' },
  field: { width: '100%' },
  entryBtn: { fontWeight: 'bold', color: '#fff', margin: '1rem' },
}))
export default EntryDialog
