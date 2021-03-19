import '../styles/globals.css'
import { useEffect } from 'react'
import { AppProps } from 'next/app'

import '../common/firebase'
import Layout from '../components/Layout'
import { AppContextProvider } from '../contexts/AppContext'
import { BingoContextProvider } from '../contexts/BingoContext'

function MyApp({ Component, pageProps }: AppProps) {
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
