import { useState, useEffect } from 'react'
import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const ChangeNumberDialog: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  number: number
  onClickButton: (n: number) => void
}> = (props) => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  useEffect(() => {
    setValue(props.number)
  }, [props.number])

  return (
    <MUI.Dialog open={props.open}>
      <MUI.DialogContent>
        <MUI.OutlinedInput
          classes={{ root: classes.root, input: classes.input }}
          defaultValue={value}
          type="number"
          onChange={({ target: { value } }) => {
            setValue(Number(value))
          }}
        />
      </MUI.DialogContent>
      <MUI.DialogActions>
        <MUI.Button
          className={classes.button}
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            props.onClickButton(value)
            props.setOpen(false)
          }}
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
  },
  noSpin: {},
}))
