import React, { createContext, useState } from 'react'

interface State {
  openHistoryDrawer: boolean
  setOpenHistoryDrawer: React.Dispatch<React.SetStateAction<boolean>>
  openGiftDrawer: boolean
  setOpenGiftDrawer: React.Dispatch<React.SetStateAction<boolean>>
  openPlayerDrawer: boolean
  setOpenPlayerDrawer: React.Dispatch<React.SetStateAction<boolean>>
}

const BingoContext = createContext<State>({} as State)

function BingoContextProvider(props: { children?: React.ReactNode }) {
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false)
  const [openGiftDrawer, setOpenGiftDrawer] = useState(false)
  const [openPlayerDrawer, setOpenPlayerDrawer] = useState(false)

  return (
    <BingoContext.Provider
      value={{
        openHistoryDrawer,
        setOpenHistoryDrawer,
        openGiftDrawer,
        setOpenGiftDrawer,
        openPlayerDrawer,
        setOpenPlayerDrawer,
      }}
    >
      {props.children}
    </BingoContext.Provider>
  )
}

export { BingoContext, BingoContextProvider }
