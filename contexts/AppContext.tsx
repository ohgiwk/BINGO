import React, { createContext, useState } from 'react'
import firebase from 'firebase'

type SnackBarState = {
  open: boolean
  message?: string
  type?: 'success' | 'error'
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
  setConfirmDialog: React.Dispatch<React.SetStateAction<ConfirmDialogState>>
}

const AppContext = createContext<State>({} as State)

function AppContextProvider(props: { children?: React.ReactNode }) {
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [currentUser, setCurrentUser] = useState<firebase.User | undefined>()
  const [snackBar, setSnackBar] = useState({ open: false })
  const [confirmDialog, setConfirmDialog] = useState({ open: false })

  return (
    <AppContext.Provider
      value={{
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
        setConfirmDialog,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export { AppContext, AppContextProvider }
