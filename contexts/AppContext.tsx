import React, { createContext, useState } from 'react'
import firebase from 'firebase'

type SnackBarState = {
  open: boolean
  message?: string
  type?: 'success' | 'error' | 'info'
}

type ConfirmDialogState = {
  open: boolean
  title?: string
  text?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  onClickPrimaryButton?: () => void
  onClickSecondaryButton?: () => void
}

interface State {
  primaryColor: string
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>

  isAppLoading: boolean
  setIsAppLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>

  isAuth: boolean
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: firebase.User | undefined
  setCurrentUser: React.Dispatch<
    React.SetStateAction<firebase.User | undefined>
  >
  snackBar: SnackBarState
  setSnackBar: React.Dispatch<React.SetStateAction<SnackBarState>>
  confirmDialog: ConfirmDialogState
  openDialog: (args: Omit<ConfirmDialogState, 'open'>) => void
  closeDialog: () => void
}

const AppContext = createContext<State>({} as State)

function AppContextProvider(props: { children?: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState('#ff89a3')
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [currentUser, setCurrentUser] = useState<firebase.User | undefined>()
  const [snackBar, setSnackBar] = useState({ open: false })
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
  })

  function openDialog(args: Omit<ConfirmDialogState, 'open'>) {
    setConfirmDialog({
      open: true,
      ...args,
    })
  }

  const closeDialog = () => {
    setConfirmDialog((prevValue) => ({
      ...prevValue,
      open: false,
    }))
  }

  return (
    <AppContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        isAppLoading,
        setIsAppLoading,
        isLoading,
        setIsLoading,
        isAuth,
        setIsAuth,
        currentUser,
        setCurrentUser,
        snackBar,
        setSnackBar,
        confirmDialog,
        openDialog,
        closeDialog,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export { AppContext, AppContextProvider }
