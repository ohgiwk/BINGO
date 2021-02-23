import { useContext } from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AppLoading from '../components/AppLoading'
import DrawerMenu from '../components/DrawerMenu'
import SnackBar from '../components/SnackBar'
import { AppContext } from '../contexts/AppContext'
import useAuth from '../hooks/useAuth'
import ConfirmDialog from '../components/ConfirmDialog'

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    fontFamily: "'Lora', serif",
    color: 'gray',
    marginLeft: '-60px',
    textAlign: 'center',
  },
}))

const Layout: React.FC = ({ children }) => {
  const classes = useStyles()

  const { isAppLoading, snackBar, setSnackBar, confirmDialog } = useContext(
    AppContext
  )
  const { initAuth } = useAuth()
  initAuth()

  if (!isAppLoading) {
    return (
      <>
        <AppBar elevation={0} color="inherit">
          <Toolbar>
            <DrawerMenu />
            <Typography variant="h6" className={classes.title}>
              Let's BINGO !
            </Typography>
          </Toolbar>
        </AppBar>

        <ConfirmDialog {...confirmDialog} />

        <SnackBar
          open={snackBar.open}
          message={snackBar.message}
          severity={snackBar.type}
          onClose={() => setSnackBar({ ...snackBar, open: false })}
          vertical="top"
        />
        <main>{children}</main>
      </>
    )
  } else {
    return <AppLoading />
  }
}

export default Layout
