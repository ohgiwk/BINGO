import { useContext, useState } from 'react'
import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
// prettier-ignore
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import API from '../../common/API'
import { AppContext } from '../../contexts/AppContext'

export default function createRoom() {
  const classes = useStyles()

  const { openDialog, closeDialog } = useContext(AppContext)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [isProgress, setIsProgress] = useState(false)

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  function onClickCreateRoom() {
    openDialog({
      title: 'ルーム作成',
      text: '作成してもよろしいですか？',
      primaryButtonText: '作成',
      secondaryButtonText: 'キャンセル',
      onClickPrimaryButton: async () => {
        setIsProgress(true)

        try {
          await API.createRoom({
            name,
            description,
            owner: '',
            status: '',
            number: '0',
            gifts: [],
            history: [],
            startDate: new Date().getTime(),
          })
          closeDialog()
          setIsProgress(false)

          openDialog({
            text: 'ルーム作成に成功しました',
            primaryButtonText: 'OK',
            onClickPrimaryButton: () => closeDialog(),
          })
        } catch (e) {
        } finally {
        }
      },
      onClickSecondaryButton: () => closeDialog(),
    })
  }

  return (
    <MUI.Container className={classes.container} maxWidth="md">
      <MUI.Typography className={classes.title} variant="h6">
        ルーム作成
      </MUI.Typography>
      <MUI.Paper className={classes.paper}>
        <MUI.List>
          <MUI.ListSubheader>基本情報</MUI.ListSubheader>

          <MUI.ListItem>
            <MUI.ListItemText>ルーム名</MUI.ListItemText>
            <MUI.ListItemSecondaryAction>
              <MUI.TextField
                value={name}
                className={classes.textfield}
                onChange={({ target: { value } }) => {
                  setName(value)
                }}
              ></MUI.TextField>
            </MUI.ListItemSecondaryAction>
          </MUI.ListItem>

          <MUI.ListItem>
            <MUI.ListItemText>説明</MUI.ListItemText>
            <MUI.ListItemSecondaryAction>
              <MUI.TextField
                value={description}
                className={classes.textfield}
                onChange={({ target: { value } }) => {
                  setDescription(value)
                }}
                multiline
              ></MUI.TextField>
            </MUI.ListItemSecondaryAction>
          </MUI.ListItem>

          <MUI.ListItem>
            <MUI.ListItemText>開催日</MUI.ListItemText>
            <MUI.ListItemSecondaryAction>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <MUI.Grid container justify="space-around">
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MUI.Grid>
              </MuiPickersUtilsProvider>
            </MUI.ListItemSecondaryAction>
          </MUI.ListItem>
        </MUI.List>
      </MUI.Paper>

      <MUI.Paper className={classes.paper}>
        <MUI.List>
          <MUI.ListSubheader>景品</MUI.ListSubheader>
        </MUI.List>
      </MUI.Paper>

      <MUI.Paper className={classes.paper}>
        <MUI.List>
          <MUI.ListSubheader>参加者</MUI.ListSubheader>
        </MUI.List>
      </MUI.Paper>

      <div className={classes.buttons}>
        <MUI.Button variant="contained" className={classes.button}>
          戻る
        </MUI.Button>
        <MUI.Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={onClickCreateRoom}
          disabled={!name}
        >
          作成
        </MUI.Button>
      </div>

      <MUI.Backdrop className={classes.backdrop} open={isProgress}>
        <MUI.CircularProgress />
      </MUI.Backdrop>
    </MUI.Container>
  )
}

const useStyles = makeStyles((theme) => ({
  container: { paddingTop: '64px' },
  title: { marginTop: '2rem' },
  paper: { marginTop: '1rem', padding: '1rem' },
  button: {
    fontWeight: 'bold',
    margin: '0 0.5rem',
  },
  textfield: { width: '300px' },
  buttons: {
    margin: '1rem',
    textAlign: 'center',
  },
  backdrop: { zIndex: theme.zIndex.modal + 1, flexDirection: 'column' },
}))
