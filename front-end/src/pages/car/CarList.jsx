import AddBoxIcon from '@mui/icons-material/AddBox'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { Link } from 'react-router-dom'
import myfetch from '../../lib/myfetch'
import useConfirmDialog from '../../ui/useConfirmDialog'
import useNotification from '../../ui/useNotification'
import useWaiting from '../../ui/useWaiting'

export default function CarList() {
  const columns = [
    {
      field: 'id',
      headerName: 'Cód.',
      type: 'number',
      width: 80,
    },
    {
      field: 'brand',
      headerName: 'Marca/Modelo',
      width: 200,
      // Colocando dois campos na mesma célula
      valueGetter: (value, row) => row.brand + '/' + row.model,
    },
    {
      field: 'color',
      headerName: 'Cor do carro',
      width: 150,
    },

    {
      field: 'year_manufacture',
      headerName: 'Ano de fabricação',
      width: 150,
    },
    {
      field: 'imported',
      headerName: 'Importado?',
      width: 100,
      renderCell: (value) => (value.row.imported ? 'SIM' : ''),
    },
    {
      field: 'plates',
      headerName: 'Placa',
      width: 100,
    },
    {
      field: 'selling_date',
      headerName: 'Data de venda',
      width: 120,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '',
    },
    {
      field: 'selling_price',
      headerName: 'Preço de venda',
      width: 120,
      // valueFormatter: (params) =>
      //   params.selling_price?.toLocaleString('pt-BR', {
      //     style: 'currency',
      //     currency: 'BRL',
      //   }),
      valueFormatter: (value) =>
        value
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(value)
          : '',
    },
    {
      field: 'customer',
      headerName: 'Cliente',
      width: 250,
      renderCell: (value) => value.row?.customer?.name
    },
    {
      field: '_edit',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      sortable: 'false',
      width: 90,
      renderCell: (params) => (
        <Link to={`./${params.id}`}>
          <IconButton aria-label='Editar'>
            <EditIcon />
          </IconButton>
        </Link>
      ),
    },
    {
      field: '_delete',
      headerName: 'Excluir',
      headerAlign: 'center',
      align: 'center',
      sortable: 'false',
      width: 90,
      renderCell: (params) => (
        <IconButton
          aria-label='Excluir'
          onClick={() => handleDeleteButtonClick(params.id)}
        >
          <DeleteForeverIcon color='error' />
        </IconButton>
      ),
    },
  ]

  const [state, setState] = React.useState({
    cars: [],
  })
  const { cars } = state

  const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
  const { notify, Notification } = useNotification()
  const { showWaiting, Waiting } = useWaiting()

  /*
    useEffect() com vetor de dependências vazio irá ser executado
    apenas uma vez, durante o carregamento inicial do componente
  */
  React.useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    showWaiting(true)
    try {
      const result = await myfetch.get('/cars?include=customer')
      setState({
        ...state,
        cars: result,
      })
    } catch (error) {
      console.error(error)
      notify(error.message, 'error')
    } finally {
      showWaiting(false)
    }
  }

  async function handleDeleteButtonClick(deleteId) {
    if (await askForConfirmation('Deseja realmente excluir este item?')) {
      // Exibe a tela de espera
      showWaiting(true)
      try {
        await myfetch.delete(`/cars/${deleteId}`)

        // Recarrega os dados da grid
        fetchData()

        notify('Item excluído com sucesso.')
      } catch (error) {
        console.log(error)
        notify(error.message, 'error')
      } finally {
        showWaiting(false)
      }
    }
  }

  return (
    <>
      <Waiting />
      <Notification />
      <ConfirmDialog />

      <Typography variant='h1' gutterBottom>
        Listagem de carros
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          mb: 2, // marginBottom
        }}
      >
        <Link to='./new'>
          <Button
            variant='contained'
            size='large'
            color='secondary'
            startIcon={<AddBoxIcon />}
          >
            Novo Carro
          </Button>
        </Link>
      </Box>

      <Paper elevation={10}>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={cars}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
          />
        </Box>
      </Paper>
    </>
  )
}