import '../styles/globals.css'
import { useEffect } from 'react'

import Layout from './Layout'
import useFirebase from '../hooks/useFirebase'
import { AppContextProvider } from '../contexts/AppContext'
import { BingoContextProvider } from '../contexts/BingoContext'

function MyApp({ Component, pageProps }) {
  const { initFirebase } = useFirebase()
  initFirebase()

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <AppContextProvider>
      <BingoContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BingoContextProvider>
    </AppContextProvider>
  )
}

export default MyApp
