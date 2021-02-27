import React from 'react'
// prettier-ignore
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  open: boolean
  title?: string
  text?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  onClickPrimaryButton?: () => void
  onClickSecondaryButton?: () => void
}

export default function ConfirmDialog(props: Props) {
  const classes = useStyles()

  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {props.secondaryButtonText && (
          <Button onClick={props.onClickSecondaryButton} color="primary">
            {props.secondaryButtonText}
          </Button>
        )}
        {props.primaryButtonText && (
          <Button
            onClick={props.onClickPrimaryButton}
            color="primary"
            variant="contained"
            autoFocus
            className={classes.primary}
          >
            {props.primaryButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(() => ({
  primary: {
    fontWeight: 'bold',
    color: '#fff',
  },
}))
