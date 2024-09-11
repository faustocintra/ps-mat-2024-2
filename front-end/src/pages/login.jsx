import React from "react"
import {
    Typography,
    Paper,
    TextField,
    //InputAdornment,
    Button,
    //IconButton
} from '@mui/material'


export default function Login(){
    const[state, setState] = React.useState({
        email:'',
        password:''
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
            padding: '24px',
            maxWidth: '500px',
            margin: 'auto'
        }}
        > 
        <form>
            <TextField
                name= 'email'
                value= {email}
                label= 'E-mail'
                variant= 'filled'
                fullwidh
                sx={{ mb:'24px'}}
            />
            <TextField
                name= 'password'
                value= {password}
                label= 'senha'
                variant= 'filled'
                type="password"
                fullwidh
                sx={{ mb:'24px'}}
            />
            <Button
                variant="contained"
                type="submit"
                color="secondary"
                fullwidh
            >
               Enviar 
            </Button>
            
        </form>
    </Paper>
    </>
  )
}