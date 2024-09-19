import { Checkbox, FormControlLabel } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import React from 'react'
import InputMask from 'react-input-mask'
import { useNavigate, useParams } from 'react-router-dom'
import { ZodError } from 'zod'
import myfetch from '../../lib/myfetch'
import Car from '../../models/car'
import useConfirmDialog from '../../ui/useConfirmDialog'
import useNotification from '../../ui/useNotification'
import useWaiting from '../../ui/useWaiting'

export default function CarForm() {
  /*
    Por padrão, todos os campos do nosso formulário terão como
    valor inicial uma string vazia. A exceção é o campo birth_date
    que, devido ao funcionamento do componente DatePicker, deve
    iniciar valendo null.
  */

  const formDefaults = {
    brand: '',
    model: '',
    color: '',
    year_manufacture: '',
    imported: false,
    plates: '',
    selling_date: null,
    selling_price: '',
  }

  const [state, setState] = React.useState({
    car: { ...formDefaults },
    formModified: false,
    inputErrors: {},
  })
  const { car, formModified, inputErrors } = state

  const params = useParams()
  const navigate = useNavigate()

  const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
  const { notify, Notification } = useNotification()
  const { showWaiting, Waiting } = useWaiting()

  const colors = [
    { value: 'AMARELO', label: 'AMARELO' },
    { value: 'AZUL', label: 'AZUL' },
    { value: 'BRANCO', label: 'BRANCO' },
    { value: 'CINZA', label: 'CINZA' },
    { value: 'DOURADO', label: 'DOURADO' },
    { value: 'LARANJA', label: 'LARANJA' },
    { value: 'MARROM', label: 'MARROM' },
    { value: 'PRATA', label: 'PRATA' },
    { value: 'PRETO', label: 'PRETO' },
    { value: 'ROSA', label: 'ROSA' },
    { value: 'ROXO', label: 'ROXO' },
    { value: 'VERDE', label: 'VERDE' },
    { value: 'VERMELHO', label: 'VERMELHO' },
  ]

  const plateMaskFormatChars = {
    9: '[0-9]', // somente dígitos
    $: '[0-9A-J]', // dígito de 0 a 9 ou uma letra de A a J.
    A: '[A-Z]', //  letra maiúscula de A a Z.
  }

  const currentYear = new Date().getFullYear()
  const minYear = 1960
  const years = []
  for (let year = currentYear; year >= minYear; year--) {
    years.push(year)
  }

  const [imported, setImported] = React.useState(false)
  // car.imported = imported
  const handleImportedChange = (event) => {
    setImported(event.target.checked)
  }

  function handleFieldChange(event) {
    const carCopy = { ...car }
    carCopy[event.target.name] = event.target.value
    setState({ ...state, car: carCopy, formModified: true })
  }

  async function handleFormSubmit(event) {
    event.preventDefault(); // Evita que a página seja recarregada
    showWaiting(true); // Exibe a tela de espera
    try {
      // Invoca a validação dos dados da biblioteca Zod
      // por meio do model Car === '' ? '' : parseFloat(value)

      Car.parse(car)
      console.log(car)

      // Se houver parâmetro na rota, significa que estamos modificando
      // um cliente já existente. A requisição será enviada ao back-end
      // usando o método PUT
      if (params.id) await myfetch.put(`/cars/${params.id}`, car)
      // Caso contrário, estamos criando um novo cliente, e enviaremos
      // a requisição com o método POST
      else await myfetch.post('/cars', car)

      // Deu certo, vamos exbir a mensagem de feedback que, quando for
      // fechada, vai nos mandar de volta para a listagem de clientes
      notify('Item salvo com sucesso.', 'success', 4000, () => {
        navigate('..', { relative: 'path', replace: true })
      })
    } catch (error) {
      // console.error(error)
      if (error instanceof ZodError) {
        // Formamos um objeto contendo os erros do Zod e
        // o colocamos na variável de estado inputErrors
        const messages = {}
        for (let i of error.issues) messages[i.path[0]] = i.message
        setState({ ...state, inputErrors: messages })
        notify('Há campos com valores inválidos no formulário', 'error')
      } else notify(error.message, 'error')
    } finally {
      // Desliga a tela de espera, seja em caso de sucesso, seja em caso de erro
      showWaiting(false)
    }
  }

  /*
    useEffect() que é executado apenas uma vez, no carregamento do componente.
    Verifica se a rota tem parâmetro. Caso tenha, significa que estamos vindo
    do componente de listagem por meio do botão de editar, e precisamos chamar
    a função loadData() para buscar no back-end os dados do cliente a ser editado
  */
  React.useEffect(() => {
    if (params.id) loadData()
  }, [])

  async function loadData() {
    showWaiting(true)
    try {
      const result = await myfetch.get(`/cars/${params.id}`)

      // Converte o formato de data armazenado no banco de dados
      // para o formato reconhecido pelo componente DatePicker
      result.birth_date = parseISO(result.birth_date)

      setState({ ...state, customer: result })
    } catch (error) {
      console.error(error)
      notify(error.message, 'error')
    } finally {
      showWaiting(false)
    }
  }

  async function handleBackButtonClick() {
    if (
      formModified &&
      !(await askForConfirmation(
        'Há informações não salvas. Deseja realmente sair?'
      ))
    )
      return; // Sai da função sem fazer nada

    // Navega de volta para a página de listagem
    navigate('..', { relative: 'path', replace: true })
  }

  return (
    <>
      <ConfirmDialog />
      <Notification />
      <Waiting />

      <Typography variant='h1' gutterBottom>
        {params.id ? `Editar carro #${params.id}` : 'Cadastrar novo carro'}
      </Typography>

      <Box className='form-fields'>
        <form onSubmit={handleFormSubmit}>
          <TextField
            name='brand'
            label='Marca do carro'
            variant='filled'
            required
            fullWidth
            value={car.brand}
            onChange={handleFieldChange}
            helperText={inputErrors?.brand}
            error={inputErrors?.brand}
          />
          <TextField
            name='model'
            label='Modelo do carro'
            variant='filled'
            required
            fullWidth
            value={car.model}
            onChange={handleFieldChange}
            helperText={inputErrors?.model}
            error={inputErrors?.model}
          />

          <TextField
            name='color'
            label='Color'
            variant='filled'
            required
            fullWidth
            value={car.color}
            onChange={handleFieldChange}
            select
            helperText={inputErrors?.state}
            error={inputErrors?.state}
          >
            {colors.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            name='year_manufacture'
            label='Ano de fabricação'
            variant='filled'
            required
            fullWidth
            select
            value={car.year_manufacture}
            onChange={handleFieldChange}
            helperText={inputErrors?.year_manufacture}
            error={inputErrors?.year_manufacture}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                name='imported'
                variant='filled'
                value={(car.imported = imported)}
                checked={imported}
                onChange={handleImportedChange}
                color='primary'
              />
            }
            label='Importado'
          />

          <InputMask
            mask='AAA-9$99'
            formatChars={plateMaskFormatChars}
            maskChar=' '
            value={car.plates}
            onChange={handleFieldChange}
          >
            {() => (
              <TextField
                name='plates'
                label='Placa'
                variant='filled'
                required
                fullWidth
                helperText={inputErrors?.phone}
                error={inputErrors?.phone}
              />
            )}
          </InputMask>

          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ptBR}
          >
            <DatePicker
              label='Data de venda'
              value={car.selling_date}
              onChange={(value) =>
                handleFieldChange({
                  target: { name: 'selling_date', value },
                })
              }
              slotProps={{
                textField: {
                  variant: 'filled',
                  fullWidth: true,
                  helperText: inputErrors?.selling_date,
                  error: inputErrors?.selling_date,
                },
              }}
            />
          </LocalizationProvider>

          <TextField
            name='selling_price'
            label='Preço de venda'
            variant='filled'
            type='number'
            required
            fullWidth
            value={car.selling_price}
            onChange={handleFieldChange}
            helperText={inputErrors?.selling_price}
            error={inputErrors?.selling_price}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <Button variant='contained' color='secondary' type='submit'>
              Salvar
            </Button>
            <Button variant='outlined' onClick={handleBackButtonClick}>
              Voltar
            </Button>
          </Box>

          {/* <Box sx={{ fontFamily: 'monospace', display: 'flex', width: '100%' }}>
            {JSON.stringify(inputErrors)}
          </Box> */}
        </form>
      </Box>
    </>
  )
}