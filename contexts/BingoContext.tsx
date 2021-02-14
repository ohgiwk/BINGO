import React, { createContext, useState } from 'react'

interface State {
  numbers: Number[]
  setNumbers: React.Dispatch<React.SetStateAction<Number[]>>
  history: string[]
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
  openHistoryDrawer: boolean
  setOpenHistoryDrawer: React.Dispatch<React.SetStateAction<boolean>>
}

const BingoContext = createContext<State>({} as State)

function BingoContextProvider(props: { children?: React.ReactNode }) {
  const [numbers, setNumbers] = useState<Number[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false)

  return (
    <BingoContext.Provider
      value={{
        numbers,
        setNumbers,
        history,
        setHistory,
        openHistoryDrawer,
        setOpenHistoryDrawer,
      }}
    >
      {props.children}
    </BingoContext.Provider>
  )
}

export { BingoContext, BingoContextProvider }
