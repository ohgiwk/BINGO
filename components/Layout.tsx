import { useContext } from 'react'
// prettier-ignore
import { AppBar, Backdrop, CircularProgress, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ThemeProvider, createMuiTheme, CssBaseline } from '@material-ui/core'

import AppLoading from './AppLoading'
import DrawerMenu from './DrawerMenu'
import SnackBar from './SnackBar'
import { AppContext } from '../contexts/AppContext'
import useAuth from '../hooks/useAuth'
import ConfirmDialog from './ConfirmDialog'

const Layout: React.FC = ({ children }) => {
  const classes = useStyles()

  const {
    primaryColor,
    isAppLoading,
    isLoading,
    snackBar,
    setSnackBar,
    confirmDialog,
  } = useContext(AppContext)
  const { initAuth } = useAuth()
  initAuth()

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: primaryColor,
      },
    },
  })

  if (!isAppLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar elevation={0} color="inherit">
          <Toolbar>
            <DrawerMenu />
            <Typography variant="h6" className={classes.title}>
              Let's BINGO !
            </Typography>
          </Toolbar>
        </AppBar>

        <ConfirmDialog {...confirmDialog} />

        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <SnackBar
          open={snackBar.open}
          message={snackBar.message}
          severity={snackBar.type}
          onClose={() => setSnackBar({ ...snackBar, open: false })}
          vertical="top"
        />
        <main>{children}</main>
      </ThemeProvider>
    )
  } else {
    return <AppLoading />
  }
}

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontFamily: "'Lora', serif",
    color: 'gray',
    marginLeft: '-60px',
    textAlign: 'center',
  },
  backdrop: { zIndex: theme.zIndex.modal + 1, flexDirection: 'column' },
}))

export default Layout
