import React from 'react'
import {
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  IconButton
} from '@mui/material'
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import myfetch from '../lib/myfetch'
import useNotification from '../ui/useNotification'
import useWaiting from '../ui/useWaiting'
import { useNavigate } from 'react-router-dom'
import AuthUserContext from '../contexts/AuthUserContext'

export default function Login() {

  const [state, setState] = React.useState({
    email: '',
    password: '',
    showPassword: false
  })
  const {
    email,
    password,
    showPassword
  } = state

  const { setAuthUser } = React.useContext(AuthUserContext)

  const { notify, Notification } = useNotification()
  const { showWaiting, Waiting } = useWaiting()

  const navigate = useNavigate()

  function handleChange(event) {
    // Atualiza a variável de estado associada ao
    // input que foi modificado
    setState({ ...state, [event.target.name]: event.target.value })
  }

  function handleClick(event) {
    // Alterna a visibilidade da senha
    setState({ ...state, showPassword: !showPassword })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    showWaiting(true)
    try {
      const LoginData = {password}

      if(email.includes('@')) LoginData.email = email
      else LoginData.username = email

      const response = await myfetch.post('/users/login',  LoginData )

      window.localStorage.setItem(
        import.meta.env.VITE_AUTH_TOKEN_NAME,
        response.token
      )

      //armazena as informações do usuario autenticado
      setAuthUser(response.user)

      notify('Autenticação realizada com sucesso', 'success', 1500,
        () => navigate('/'))
    }
    catch(error) {
      console.error(error)
      notify(error.message, 'error')
    }
    finally {
      showWaiting(false)

    }
  }

  return(
    <>
      <Notification />
      <Waiting />
      <Typography variant="h1" gutterBottom>
        Autentique-se
      </Typography>

      <Paper
        elevation={6}
        sx={{
          padding: '24px',
          maxWidth: '500px',
          margin: 'auto'
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            name="email"
            value={email}
            label="nome de usuário ou e-mail"
            variant="filled"
            fullWidth
            onChange={handleChange}
            sx={{ mb: '24px' /* mb = marginBottom */ }}
          />

          <TextField
            name="password"
            value={password}
            label="Senha"
            variant="filled"
            type={ showPassword ? 'text': 'password' }
            fullWidth
            onChange={handleChange}
            sx={{ mb: '24px' /* mb = marginBottom */ }}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="alterna a visibilidade da senha"
                    onClick={handleClick}
                    edge="end"
                  >
                    { showPassword ? <VisibilityOff /> : <Visibility /> }
                  </IconButton>
                </InputAdornment>
            }}
          />

          <Button
            variant="contained"
            type="submit"
            color="secondary"
            fullWidth
          >
            Enviar
          </Button>
        </form>
      </Paper>
      <Paper sx={{ fontFamily: 'monospace', textAlign: 'center' }}>
        { JSON.stringify(state) }
      </Paper>
    </>
  )
}