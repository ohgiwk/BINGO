import React, { createContext, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

interface State {
  openHistoryDrawer: boolean
  setOpenHistoryDrawer: React.Dispatch<React.SetStateAction<boolean>>
  openGiftDrawer: boolean
  setOpenGiftDrawer: React.Dispatch<React.SetStateAction<boolean>>
  openPlayerDrawer: boolean
  setOpenPlayerDrawer: React.Dispatch<React.SetStateAction<boolean>>
  playerId: string
  setPlayerId: (arg: string) => void
}

const BingoContext = createContext<State>({} as State)

function BingoContextProvider(props: { children?: React.ReactNode }) {
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false)
  const [openGiftDrawer, setOpenGiftDrawer] = useState(false)
  const [openPlayerDrawer, setOpenPlayerDrawer] = useState(false)

  const [playerId, setPlayerId] = useLocalStorage('playerId', '')

  return (
    <BingoContext.Provider
      value={{
        openHistoryDrawer,
        setOpenHistoryDrawer,
        openGiftDrawer,
        setOpenGiftDrawer,
        openPlayerDrawer,
        setOpenPlayerDrawer,
        playerId,
        setPlayerId,
      }}
    >
      {props.children}
    </BingoContext.Provider>
  )
}

export { BingoContext, BingoContextProvider }
