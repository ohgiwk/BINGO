import { useState, useEffect } from 'react'
import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { CardNumber } from 'common/types'
import { MAX_BINGO_NUMBER } from 'common/constants'

const ChangeNumberDialog: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  number: number
  numbers: CardNumber[]
  onClickButton: (n: number) => void
}> = (props) => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  const numbers = props.numbers.map((n) => n.number)

  useEffect(() => {
    setValue(props.number)
  }, [props.number])

  const disabled = props.number !== value && numbers.includes(String(value))

  return (
    <MUI.Dialog open={props.open}>
      <MUI.DialogContent>
        <MUI.OutlinedInput
          classes={{ root: classes.root, input: classes.input }}
          defaultValue={value}
          type="number"
          inputProps={{
            max: MAX_BINGO_NUMBER,
            min: 1,
          }}
          onChange={({ target: { value } }) => {
            setValue(Number(value))
          }}
        />

        <div className={classes.message}>
          {disabled && '数字が重複しています'}
        </div>
      </MUI.DialogContent>
      <MUI.DialogActions>
        <MUI.Button
          className={classes.button}
          variant="contained"
          onClick={() => {
            setValue(props.number)
            props.setOpen(false)
          }}
        >
          キャンセル
        </MUI.Button>
        <MUI.Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => {
            props.onClickButton(value)
            props.setOpen(false)
          }}
          disabled={disabled}
        >
          確定
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  )
}

export default ChangeNumberDialog

const useStyles = makeStyles(() => ({
  input: {
    fontSize: '5rem',
    textAlign: 'center',
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
      '-moz-appearance': 'textfield',
    },
  },
  root: {
    fontSize: 'inherit',
    width: '200px',
    height: '200px',
  },
  button: {
    fontWeight: 'bold',
    color: '#fff',
    width: '50%',
  },
  message: {
    textAlign: 'center',
    color: '#f00',
    fontSize: '14px',
    height: '20px',
  },
}))
