import React from 'react'
// prettier-ignore
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText } from '@material-ui/core'

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
            autoFocus
          >
            {props.primaryButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
