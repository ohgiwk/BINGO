import { useContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useRouter } from 'next/router'

import { AppContext } from '../contexts/AppContext'

const useAuth = () => {
  const {
    setIsAuth,
    setCurrentUser,
    setIsAppLoading,
    setSnackBar,
    setIsLoading,
  } = useContext(AppContext)

  const auth = firebase.auth()
  const router = useRouter()

  function initAuth() {
    auth.onAuthStateChanged((user) => {
      setIsAuth(!!user)
      setCurrentUser(user ?? undefined)
      setIsAppLoading(false)
    })
  }

  async function signUp(email: string, password: string) {
    setIsLoading(true)

    try {
      await auth.createUserWithEmailAndPassword(email, password)

      setSnackBar({ open: true, message: 'ログイン成功', type: 'success' })
      setIsLoading(false)
      router.push('/')
    } catch (e) {
      console.log(e)
      setIsLoading(false)
      setSnackBar({ open: true, message: '失敗しました', type: 'error' })
    }
  }

  async function login(username: string, password: string) {
    setIsLoading(true)

    try {
      await auth.signInWithEmailAndPassword(username, password)

      setSnackBar({ open: true, message: 'ログインしました', type: 'success' })
      setIsLoading(false)
      router.push('/')
    } catch (e) {
      setIsLoading(false)
      setSnackBar({
        open: true,
        message: 'ログインに失敗しました',
        type: 'error',
      })
    }
  }

  function logout() {
    auth.signOut()
    setSnackBar({ open: true, message: 'ログアウトしました', type: 'success' })
    router.push('/login')
  }

  return { initAuth, signUp, login, logout }
}
export default useAuth
