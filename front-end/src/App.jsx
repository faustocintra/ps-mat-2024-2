import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css'
import React from 'react'
import TopBar from './ui/TopBar'
import theme from './ui/theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import FooterBar from './ui/FooterBar'
import AppRoutes from './routes/AppRoutes'
import Box from '@mui/material/Box'
import { BrowserRouter } from 'react-router-dom'
import AuthUserContext from './contexts/AuthUserContext'

import myfetch from './lib/myfetch'

function App() {

  // Variável de estado que armazena as informações
  // do usuário autenticado
  const [authUser, setAuthUser] = React.useState(null)
  const [redirectLocation, setRedirectLocation] = React.useState(null)

  React.useEffect(() => {
    // Busca as informações do usuário autenticado quando
    // a aplicação é carregada
    fetchAuthUser()
  }, [])

  async function fetchAuthUser() {
    try {
      const authUser = await myfetch.get('/users/me')
      setAuthUser(authUser)
    }
    catch(error) {
      console.error(error)
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthUserContext.Provider value={{ 
            authUser, setAuthUser,
            redirectLocation, setRedirectLocation
          }} >
          
            <TopBar />
            
            <Box sx={{ 
              m: '24px 24px 72px 24px'
            }}>
              <AppRoutes />
            </Box>
            
            <FooterBar />

          </AuthUserContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
