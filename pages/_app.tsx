import '../styles/globals.css'
import { useEffect } from 'react'
import { ThemeProvider, createMuiTheme, CssBaseline } from '@material-ui/core'

import Layout from './Layout'
import useFirebase from '../hooks/useFirebase'
import { AppContextProvider } from '../contexts/AppContext'

function MyApp({ Component, pageProps }) {
  const { initFirebase } = useFirebase()
  initFirebase()

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#ff89a3',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
