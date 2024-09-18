import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import myfetch from '../lib/myfetch'
import AuthUserContext from '../contexts/AuthUserContext'
import useWaiting from '../ui/useWaiting'

export default function AuthGuard({ children }) {

  const [hasAuthUser, setHasAuthUser] = React.useState() // undefined
  const { setAuthUser } = React.useContext(AuthUserContext)

  const location = useLocation()
  const { showWaiting, Waiting } = useWaiting()

  async function checkAuthUser() {
    setAuthUser(null)

    showWaiting(true)
    try {
      await myfetch.get('/users/me')
      setHasAuthUser(true)
    }
    catch(error) {
      console.log(error)
    }
    finally {
      showWaiting(false)
    }
  }

  React.useEffect(() => {
    checkAuthUser()
  }, [location])

  // Enquanto ainda não temos a resposta do back-end para /users/me,
  // exibimos um componente Waiting
  if(! authUser) return <Waiting />

  return authUser ? children : <Navigate to="/login" replace />
  
}