import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputMask from 'react-input-mask'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ptBR }  from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import useConfirmDialog from '../../ui/useConfirmDialog'
import useNotification from '../../ui/useNotification'
import useWaiting from '../../ui/useWaiting'
import { useNavigate, useParams } from 'react-router-dom'
import myfetch from '../../lib/myfetch'
import Customer from '../../models/customer'
import { ZodError } from 'zod'

export default function CustomerForm() {
  
  const formDefaults = {
    name: '',
    ident_document: '',
    birth_date: null,
    street_name: '',
    house_number: '',
    additional_info: '',
    district: '',
    city: '',
    uf: '',
    phone: '',
    email: ''
  }

  const [state, setState] = React.useState({
    customer: { ...formDefaults },
    formModified: false,
    inputErrors: {}
  })
  const {
    customer,
    formModified,
    inputErrors
  } = state

  const states = [
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PR', label: 'Paraná' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'SP', label: 'São Paulo' },
  ]

  const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
  const { notify, Notification } = useNotification()
  const { showWaiting, Waiting } = useWaiting()
  const navigate = useNavigate()

  const phoneMaskFormatChars = {
    '9': '[0-9]',
    '%': '[\s0-9]'  // \s significa espaço em branco
  }

  const params = useParams()

  function handleFieldChange(e) {
    // Tira uma cópia do objeto que representa o cliente
    const customerCopy = { ...customer }
    // Atualiza o campo modificado em customerCopy
    customerCopy[e.target.name] = e.target.value
    // Atualiza a variável de estado, substituindo o objeto customer
    // pela cópia atualizada
    setState({ ...state, customer: customerCopy, formModified: true })
  }

  async function handleFormSubmit(e) {
    e.preventDefault()    // Evita o recarregamento da página
    // Exibir a tela de espera
    showWaiting(true)
    try {
      // Invoca a validação dos dados de entrada da biblioteca Zod
      // por meio do model Customer
      Customer.parse(customer)

      // Envia os dados para o back-end para criar um novo cliente
      // no banco de dados
      // Se houver parâmetro na rota, significa que estamos editando.
      // Portanto, precisamos enviar os dados ao back-end com o verbo PUT
      if(params.id) await myfetch.put(`/customers/${params.id}`, customer)
      
      // Senão, os dados serão enviados com o método POST para a criação de
      // um novo cliente
      else await myfetch.post('/customers', customer)

      // Deu certo, vamos exibir a mensagem de feedback que, quando fechada,
      // vai nos mandar de volta para a listagem de clientes
      notify('Item salvo com sucesso.', 'success', 4000, () => {
        navigate('..', { relative: 'path', replace: true })
      })
    }
    catch(error) {
      console.error(error)
      if(error instanceof ZodError) {
        // Formamos um objeto contendo os erros do Zod e
        // os colocamos na variável de estado inputErrors
        const errorMessages = {}
        for(let e of error.issues) errorMessages[e.path[0]] = e.message
        setState({ ...state, inputErrors: errorMessages })
        notify('Há campos com valores inválidos no formulário', 'error')
      }
      else {
        console.error(error)
        // Deu errado, exibimos o erro e permanecemos na página do formulário
        notify(error.message, 'error')
      }
    }
    finally {
      showWaiting(false)
    }
  }
  
  // useEffect() que é executado uma vez no carregamento da página.
  // Verifica se a rota tem parâmetros e, caso tenha, significa que estamos
  // vindo do botão de edição. Nesse caso, chama a função loadData() para
  // buscar os dados do cliente a ser editado no back-end
  React.useEffect(() => {
    if(params.id) loadData()
  }, [])

  async function loadData() {
    showWaiting(true)
    try {
      const result = await myfetch.get(`/customers/${params.id}`)
      
      // Converte o formato de data armazenado no banco de dados
      // para o formato reconhecido pelo componente DatePicker
      result.birth_date = parseISO(result.birth_date)

      setState({...state, customer: result})
    }
    catch(error) {
      console.error(error)
      notify(error.message, 'error')
    }
    finally {
      showWaiting(false)
    }
  }

  async function handleBackButtonClick() {
    if(formModified && 
      ! await askForConfirmation('Há informações não salvas. Deseja realmente sair?')) {
      return  // Sai sem fazer nada
    }
    // Navega para a página anterior
    navigate('..', { relative: 'path', replace: true })
  }

  return(
    <>

      <ConfirmDialog />
      <Notification />
      <Waiting />

      <Typography variant="h1" gutterBottom>
        { params.id ? `Editar cliente ${params.id}` : 'Cadastrar novo cliente' }
      </Typography>

      <Box className="form-fields">
        <form onSubmit={handleFormSubmit}>

          <TextField 
            name="name"
            label="Nome completo"
            variant="filled"
            required
            fullWidth
            autoFocus
            value={customer.name}
            onChange={handleFieldChange} 
            error={inputErrors?.name}
            helperText={inputErrors?.name} 
          />

          <InputMask
            mask="999.999.999-99"
            value={customer.ident_document}
            onChange={handleFieldChange}
          >
            {
              () => 
                <TextField 
                  name="ident_document"
                  label="CPF"
                  variant="filled"
                  required
                  fullWidth
                  error={inputErrors?.ident_document}
                  helperText={inputErrors?.ident_document}                    
                />
            }
          </InputMask>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker 
              label="Data de nascimento"
              value={customer.birth_date}
              onChange={ value => handleFieldChange({ 
                target: { name: 'birth_date', value }}
              )}
              slotProps={{
                textField: {
                  variant: 'filled',
                  fullWidth: true,
                  error: inputErrors?.birth_date,
                  helperText: inputErrors?.birth_date
                }
              }}
            />
          </LocalizationProvider>

          <TextField 
            name="street_name"
            label="Logradouro"
            variant="filled"
            required
            fullWidth
            placeholder="Ex.: Rua Principal"
            value={customer.street_name}
            onChange={handleFieldChange}
            error={inputErrors?.street_name}
            helperText={inputErrors?.street_name}  
          />

          <TextField 
            name="house_number"
            label="Nº"
            variant="filled"
            required
            fullWidth
            value={customer.house_number}
            onChange={handleFieldChange}
            error={inputErrors?.house_number}
            helperText={inputErrors?.house_number}  
          />

          <TextField 
            name="additional_info"
            label="Complemento"
            variant="filled"
            fullWidth
            placeholder="Apto., bloco, casa, etc."
            value={customer.additional_info}
            onChange={handleFieldChange}
            error={inputErrors?.additional_info}
            helperText={inputErrors?.additional_info} 
          />

          <TextField 
            name="district"
            label="Bairro"
            variant="filled"
            required
            fullWidth
            value={customer.district}
            onChange={handleFieldChange} 
            error={inputErrors?.district}
            helperText={inputErrors?.district}  
          />

          <TextField 
            name="city"
            label="Município"
            variant="filled"
            required
            fullWidth
            value={customer.city}
            onChange={handleFieldChange} 
            error={inputErrors?.city}
            helperText={inputErrors?.city}  
          />

          <TextField 
            name="uf"
            label="UF"
            variant="filled"
            required
            fullWidth
            value={customer.uf}
            onChange={handleFieldChange}
            select
            error={inputErrors?.uf}
            helperText={inputErrors?.uf} 
          >
            {
              states.map(s => 
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              )
            }
          </TextField>

          <InputMask
            mask="(99) %9999-9999"
            formatChars={phoneMaskFormatChars}
            maskChar=" "
            value={customer.phone}
            onChange={handleFieldChange}
          >
            {
              () => 
                <TextField 
                  name="phone"
                  label="Telefone/celular"
                  variant="filled"
                  required
                  fullWidth 
                  error={inputErrors?.phone}
                  helperText={inputErrors?.phone}                   
                />
            }
          </InputMask>

          <TextField 
            name="email"
            label="E-mail"
            variant="filled"
            type="email"
            required
            fullWidth
            value={customer.email}
            onChange={handleFieldChange}  
            error={inputErrors?.email}
            helperText={inputErrors?.email} 
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
            >
              Salvar
            </Button>

            <Button
              variant="outlined"
              onClick={handleBackButtonClick}
            >
              Voltar
            </Button>
          </Box>

          {/* <Box sx={{ fontFamily: 'monospace', display: 'flex', flexDirection: 'column', width: '100%' }}>
            {JSON.stringify(customer)}
            <hr />
            {JSON.stringify(inputErrors)}
          </Box> */}
        
        </form>
      </Box>

    </>
  )
}