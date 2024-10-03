import React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AuthUserContext from '../contexts/AuthUserContext'
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom'
import useWaiting from './useWaiting'
import useConfirmDialog from './useConfirmDialog'
import useNotification from './useNotification'
import myfetch from '../lib/myfetch'

export default function AuthControl() {
  const { authUser, setAuthUser } = React.useContext(AuthUserContext)

  const { showWaiting, Waiting } = useWaiting()
  const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
  const { notify, Notification } = useNotification()

  const navigate = useNavigate()

  async function handleLogoutButtonClick() {
    if(await askForConfirmation('Deseja realmente sair?')) {
      showWaiting(true)
      try {
        await myfetch.post('/users/logout')
        
        // Apaga as informações em memória do usuário autenticado
        setAuthUser(null)

        showWaiting(false)
        
        // Navega para a página de login
        navigate('/login')
      }
      catch(error) {
        console.error(error)
        notify(error.message, 'error')
        showWaiting(false)
      }
      
      // Apaga o token do localStorage
      // window.localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_NAME)

      // Remove as informações do usuário autenticado
      // setAuthUser(null)

      // Redireciona para a página de login
      // navigate('/login')
    }
  }

  if(authUser) {
    return (
      <>
        <Waiting />
        <Notification />
        <ConfirmDialog />

        <AccountCircleIcon color="secondary" fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="caption">
          {authUser.username}
        </Typography>
        <Button 
          color="secondary"
          size="small"
          onClick={handleLogoutButtonClick}
          sx={{
            ml: 0.75, // ml: marginLeft
          }}
        >
          Sair
        </Button>
      </>
    )
  }
  else {
    return (
      <Link to="/login">
        <Button color="secondary">Entrar</Button>
      </Link>
    )
  }

}