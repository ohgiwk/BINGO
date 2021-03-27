import React, { useState, useContext, KeyboardEvent } from 'react'
import NextLink from 'next/link'
// prettier-ignore
import { Link, Button, Card, CardContent, Container, TextField, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { AppContext } from 'contexts/AppContext'
import useAuth from 'hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const { isLoading } = useContext(AppContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const props = {
    isLoading,
    username,
    password,
    onChangeUsername: (value: string) => setUsername(value),
    onChangePassword: (value: string) => setPassword(value),
    login,
    onClickLoginButton: () => props.login(props.username, props.password),
    onKeypressPassword: (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        login(username, password)
      }
    },
  }
  return <View {...props}></View>
}

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex !important',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },
  login: { fontFamily: "'Lora', serif" },
  signUp: { fontWeight: 'bold' },
  content: { textAlign: 'center' },
  textField: { width: '90%', margin: '0 0 1rem' },
  button: { marginTop: '1rem', fontWeight: 'bold', color: '#fff' },
  or: { fontSize: '14px', color: 'gray', marginTop: '1rem' },
  forgotPassword: { fontSize: '14px' },
}))

interface ViewProps {
  isLoading: boolean
  username: string
  onChangeUsername: (value: string) => void
  password: string
  onChangePassword: (value: string) => void
  login: Function
  onClickLoginButton: () => void
  onKeypressPassword: (event: KeyboardEvent<HTMLDivElement>) => void
}

const View: React.FC<ViewProps> = (props) => {
  const classes = useStyles()

  return (
    <Container className={classes.container} maxWidth="md">
      <Card>
        <CardContent className={classes.content}>
          <h2 className={classes.login}>Login</h2>
          <Grid container>
            <Grid item xs={12}>
              <form>
                <TextField
                  label={'ユーザー名'}
                  variant="outlined"
                  className={classes.textField}
                  value={props.username}
                  onChange={({ target: { value } }) =>
                    props.onChangeUsername(value)
                  }
                />
                <TextField
                  label={'パスワード'}
                  variant="outlined"
                  type="password"
                  className={classes.textField}
                  value={props.password}
                  onChange={({ target: { value } }) =>
                    props.onChangePassword(value)
                  }
                  onKeyPress={props.onKeypressPassword}
                />
              </form>
              <div>
                <NextLink href="/forgotPassword">
                  <Link className={classes.forgotPassword}>
                    パスワードを忘れた場合
                  </Link>
                </NextLink>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={props.onClickLoginButton}
                className={classes.button}
                disabled={props.isLoading}
              >
                ログイン
              </Button>
              <div className={classes.or}>or</div>
              <NextLink href="/signUp">
                <Button color="primary" className={classes.signUp}>
                  ユーザー新規登録
                </Button>
              </NextLink>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}
