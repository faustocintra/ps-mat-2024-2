import React from 'react'
import {
    Typography,
    Paper,
    TextField,
    InputAdornment,
    Button,
    IconButton
} from '@mui/material'

export default function Login() {

    const [state, setState] = React.useState({
        email: '',
        password: ''
    })
    const {
        email,
        password
    } = state

  return(
    <>
      <Typography variant="h1" gutterBottom>
        Autentique-se
      </Typography>

      <Paper
        elevation={6}
        sx={{
            padding: '24sx',
            maxWidth: '500px',
            margin: 'auto'
        }}
      >
        <form>
            <TextField
                name="email"
                value={email}
                label="E-mail"
                variant="filled"
                fullWidth
                sx={{ mb: '24px' /* mb = marginBottom */}}
            />

            <TextField
                name="password"
                value={password}
                label="Senha"
                variant="filled"
                type="password"
                fullWidth
                sx={{ mb: '24px' /* mb = marginBottom */}}
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
    </>
  )
}