'use client'

import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import Image from 'next/image'
import ApplicationCreatedOk from './onboarding/[[...stepIndex]]/ApplicationCreatedOk'
import { IOffer } from '@/types/IOffer'
const CREATE_APPLICATION = gql`
  mutation CreateApplication($offerId: ID!) {
    createApplication(offerId: $offerId) {
      application {
        id
      }
      flowStatus
    }
  }
`

interface Props {
  offer: IOffer
  currentUser: any
  params: {
    offerId: string
  }
}

const LoadingScreen: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: '#1D3B5F',
      padding: 0,
    }}
  >
    <Container sx={{ paddingTop: 0 }}>
      <Box textAlign="center">
        <CircularProgress />
        <Typography variant="h5" mt={2} sx={{ color: '#ffffff' }}>
          Cargando oferta...
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
          Por favor espere, esto puede demorar unos momentos
        </Typography>
      </Box>
    </Container>
  </Box>
)

const ErrorScreen: React.FC<{ error: any }> = ({ error }) => {
  console.error('ERROR', error)
  return (
    <Container>
      <Box textAlign="center" my={4}>
        <Typography variant="h5" mt={2} sx={{ color: '#ff0000' }}>
          Error al cargar la oferta.
        </Typography>
      </Box>
    </Container>
  )
}

const renderHeader = () => (
  <Box
    sx={{
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      overflow: 'hidden',
      backgroundColor: '#7BAF45',
      padding: '20px',
      color: 'white',
    }}
  >
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      <Grid
        item
        xs={8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left',
          marginBottom: '-20px',
        }}
      >
        <Typography variant="h6" component="div">
          ***¡Hola, Socio Conductor de Uber!
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
          ¡Has seleccionado tu auto!
        </Typography>
      </Grid>
      <Grid
        item
        xs={4}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <img
          src="/images/Recurso 31.png"
          alt="Carro"
          style={{ maxWidth: '100%', height: 'auto', marginTop: '-20px' }}
        />
      </Grid>
    </Grid>
  </Box>
)

const ImageGallery: React.FC<{ offer: IOffer }> = ({ offer }) => (
  <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
    <Box key={0} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
      <Image
        src={offer.product.picture || ''}
        alt={`photo 0`}
        layout="responsive"
        width={800}
        height={450}
        style={{ borderRadius: '8px' }}
      />
    </Box>
  </Box>
)

const OfferDetails: React.FC<{ offer: IOffer }> = ({ offer }) => (
  <Paper
    sx={{
      p: 4,
      my: 4,
      backgroundColor: '#ffffff',
      color: '#6D6E71',
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <Typography variant="h6" component="h3" sx={{ color: '#6D6E71', fontWeight: 'bold', fontSize: '24px' }}>
      Características generales
    </Typography>
    <Box sx={{ borderBottom: '1px solid #E0E0E0', my: 2 }} />
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} sx={{ color: '#6D6E71', fontSize: '14px' }}>
      <Typography variant="body2">Aceleración Estimada: {offer.product.estimatedAcceleration}</Typography>
      <Typography variant="body2">Cilindros: {offer.product.cylinders || 'N/A'}</Typography>
      <Typography variant="body2">Tipo de motor: {offer.product.transmission}</Typography>
      <Typography variant="body2">Combustible: {offer.product.fuelType || 'N/A'}</Typography>
      <Typography variant="body2">Caballos de Fuerza Estimado: {offer.product.estimatedHorsepower}</Typography>
      <Typography variant="body2">Litros: {offer.product.liters}</Typography>
      <Typography variant="body2">Velocidad Máxima Estimada (km/h): {offer.product.estimatedTopSpeedKmH}</Typography>
      <Typography variant="body2">Torque Estimado lb/ft: {offer.product.estimatedTorqueLbFt}</Typography>
      <Typography variant="body2">Numero de Velocidades: {offer.product.numberOfSpeeds}</Typography>
      <Typography variant="body2">Start/Stop: {offer.product.startStop}</Typography>
      <Typography variant="body2">Turbo: {offer.product.turbo}</Typography>
      <Typography variant="body2">Vidrios Delanteros eléctricos: Sí</Typography>
    </Box>
  </Paper>
)

const SidebarDetail: React.FC<{
  offer: IOffer
  onSuccess: (flowStatus: string) => void
}> = ({ offer, onSuccess }) => {
  const [mutation, { loading, error }] = useMutation(CREATE_APPLICATION)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    try {
      const mutationData = await mutation({
        variables: {
          offerId: offer.id,
        },
      })
      const flowStatus = mutationData.data.createApplication.flowStatus ?? 'REJECT'
      onSuccess(flowStatus)
      handleClose()
    } catch (error) {
      console.error('Error creating application', error)
    }
  }

  if (loading) {
    return (
      <Dialog open={true} onClose={handleClose}>
        <DialogContent>
          <Box textAlign="center" my={4}>
            <CircularProgress />
            <Typography variant="h5" mt={2} sx={{ color: '#6FB142' }}>
              Generando solicitud...
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Estamos generando su solicitud
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={true} onClose={handleClose}>
        <DialogContent>
          <Typography variant="h6" color="error">
            Error en la creación de la aplicación: {error.message}
          </Typography>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Paper
      sx={{
        p: 4,
        backgroundColor: '#ffffff',
        color: '#6D6E71',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" component="h4" sx={{ color: '#6D6E71', fontWeight: 'bold' }}>
        {offer.product.brand}
      </Typography>
      <Typography variant="h6" component="h4" sx={{ color: '#6D6E71', fontWeight: 'bold' }}>
        {offer.product.model}
      </Typography>
      <Typography variant="body2" component="p" sx={{ color: '#6D6E71' }}>
        {offer.product.year} • {offer.product.series} • {offer.product.title}
      </Typography>
      <Typography variant="body2" component="p" sx={{ color: '#6D6E71' }}>
        Contrato por {offer.leasingPeriod} meses
      </Typography>
      <Typography variant="h6" component="p" sx={{ color: '#6FB142', fontWeight: 'bold', mt: 2 }}>
        ${offer.weeklyPrice} / Semana
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#6FB142',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#5DA133' },
          }}
          fullWidth
          onClick={() => router.back()}
        >
          Selecciona otro modelo
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#6FB142',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#5DA133' },
            mt: 1,
          }}
          fullWidth
          onClick={handleClickOpen}
        >
          Confirmar Selección
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '10px',
              padding: '20px',
              maxWidth: '400px',
              margin: 'auto',
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold', color: '#6FB142', textAlign: 'center' }}>
            Confirmar Selección
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ color: '#6D6E71' }}>
              ¿Estás seguro de que quieres iniciar el proceso para obtener tu {offer.product.brand}?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              onClick={handleClose}
              sx={{
                backgroundColor: '#ffffff',
                color: '#6FB142',
                borderColor: '#6FB142',
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                  borderColor: '#6FB142',
                },
                border: '1px solid',
                marginRight: '10px',
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              sx={{
                backgroundColor: '#6FB142',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#5DA133',
                },
              }}
              autoFocus
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Paper>
  )
}

const OfferPageClient: React.FC<Props> = ({ offer, currentUser, params }) => {
  const [flowStatus, setFlowStatus] = useState<string | null>(null)

  if (flowStatus) {
    return (
      <Box
        sx={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <Container>
          {renderHeader()}
          <Grid container spacing={4} sx={{ padding: '20px', minHeight: 'calc(100vh - 80px)' }}>
            <Grid item xs={12}>
              <ApplicationCreatedOk flowStatus={flowStatus} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <Container>
        {renderHeader()}
        <Grid container spacing={4} sx={{ padding: '20px' }}>
          <Grid item xs={12} lg={8}>
            <ImageGallery offer={offer} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <SidebarDetail offer={offer} onSuccess={setFlowStatus} />
          </Grid>
          <Grid item xs={12}>
            <OfferDetails offer={offer} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default OfferPageClient
