'use client'

import React, { FC, useState, useEffect } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import {
  Container,
  Box,
  Divider,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { IOffer } from '@type/IOffer'
import ApplicationCreatedOk from './onboarding/[[...stepIndex]]/ApplicationCreatedOk'
import { useSession } from 'next-auth/react'
import { ButtonSharedIcon } from '@app/(standard)/components/ButtonSharedIcon'

interface Props {
  params: {
    offerId: string
  }
}

const QUERY = gql`
  query Offer($offerId: ID!) {
    offerById(offerId: $offerId) {
      id
      weeklyPrice
      leasingPeriod
      createdAt
      updatedAt
      expiresAt
      quoteId
      product {
        id
        brand
        model
        year
        series
        picture
        estimatedHorsepower
        estimatedAcceleration
        numberOfSpeeds
        transmission
        title
        startStop
        turbo
        liters
        estimatedTorqueLbFt
        estimatedTopSpeedKmH
        cylinders
        fuelType
        engineType
        idversion
        cityFuelEconomy
        highwayFuelEconomy
        safetyFeatures
        confortFeatures
      }
    }
  }
`

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

const MUTATION_CREATE_QUOTE = gql`
  mutation CreateQuoteSmartIt(
    $marca: String!
    $modelo: String!
    $anio: Int!
    $uuid: String!
    $idVersion: String!
    $idSmartIt: String!
  ) {
    createQuoteSmartIt(
      Marca: $marca
      Modelo: $modelo
      Anio: $anio
      UUID: $uuid
      IdVersion: $idVersion
      IdSmartIt: $idSmartIt
    ) {
      IdAgencia
      IdCotizacion
      IdPersona
      LinkReporte
    }
  }
`

const LoadingScreen: FC = () => (
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

const ErrorModal: FC<{ errorMessage: string; onClose: () => void }> = ({ errorMessage, onClose }) => (
  <Dialog open={true} onClose={onClose}>
    <DialogContent>
      <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
        Error
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
        {errorMessage}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onClose}
        sx={{
          margin: 'auto',
          backgroundColor: '#6FB142',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#5DA133',
            color: '#ffffff',
          },
        }}
      >
        Cerrar
      </Button>
    </DialogActions>
  </Dialog>
)

const renderHeader = (currentUser: string) => (
  <div className="pagetitle p-5">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-8 mb-5">
          <h4 className="text-white">
            ¡{currentUser} has seleccionado <strong>tu auto</strong>!
          </h4>
        </div>
        <div className="col-lg-4">
          <center>
            <img src="/images/seleccion-title.png" className="img-fluid" alt="Carro" />
          </center>
        </div>
      </div>
    </div>
  </div>
)

const renderHeaderFins = (currentUser: string) => (
  <div className="pagetitle p-5">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-8 mb-5">
          <h4 className="text-white">
            ¡{currentUser} has seleccionado <strong>tu auto!</strong>
          </h4>
        </div>
        <div className="col-lg-4">
          <center className="d-none d-md-block">
            <img src="/images/escanear-title.png" className="img-fluid" />
          </center>
        </div>
      </div>
    </div>
  </div>
)

const ImageGallery: FC<{ offer: IOffer }> = ({ offer }) => (
  <div className="col-lg-8">
    <center>
      {offer.product.picture && <img src={offer.product.picture} className="img-fluid w-100 rounded mb-4" />}
    </center>
  </div>
)

const OfferDetails: FC<{ offer: IOffer }> = ({ offer }) => {
  const safetyFeatures = JSON.parse(offer.product.safetyFeatures || '[]') as string[]
  const confortFeatures = JSON.parse(offer.product.confortFeatures || '[]') as string[]

  return (
    <div className="card p-4">
      <h2 className="fw-bold fs-4 mb-4">Características</h2>
      <div className="d-flex flex-column gap-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <svg className="bi" width="24" height="24" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                clip-rule="evenodd"
              />
            </svg>
            <h3 className="fw-bold fs-5 mb-0">Desempeño</h3>
          </div>
          <ol className="ms-4">
            <li>
              Motor: {offer.product.liters} litros, {offer.product.cylinders} cilindros que generan{' '}
              {offer.product.estimatedHorsepower} caballos de fuerza a 5600 rpm y un torque de{' '}
              {offer.product.estimatedTorqueLbFt} lb pie a 4000 rpm
            </li>
            <li>
              Transmisión: {offer.product.transmission} de {offer.product.numberOfSpeeds || 'N/A'} velocidades
            </li>
            <li>
              Rendimiento de combustible: hasta {offer.product.cityFuelEconomy || '15.9'} km/l en ciudad y{' '}
              {offer.product.highwayFuelEconomy || '22.2'} km/l en carretera
            </li>
          </ol>
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <svg className="bi" width="24" height="24" fill="currentColor">
              <path d="M12.356 3.066a1 1 0 0 0-.712 0l-7 2.666A1 1 0 0 0 4 6.68a17.695 17.695 0 0 0 2.022 7.98 17.405 17.405 0 0 0 5.403 6.158 1 1 0 0 0 1.15 0 17.406 17.406 0 0 0 5.402-6.157A17.694 17.694 0 0 0 20 6.68a1 1 0 0 0-.644-.949l-7-2.666Z" />
            </svg>
            <h3 className="fw-bold fs-5 mb-0">Seguridad</h3>
          </div>
          <ol className="ms-4">
            {safetyFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ol>
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <svg className="bi" width="24" height="24" fill="currentColor">
              <path d="M11.782 5.72a4.773 4.773 0 0 0-4.8 4.173 3.43 3.43 0 0 1 2.741-1.687c1.689 0 2.974 1.972 3.758 2.587a5.733 5.733 0 0 0 5.382.935c2-.638 2.934-2.865 3.137-3.921-.969 1.379-2.44 2.207-4.259 1.231-1.253-.673-2.19-3.438-5.959-3.318ZM6.8 11.979A4.772 4.772 0 0 0 2 16.151a3.431 3.431 0 0 1 2.745-1.687c1.689 0 2.974 1.972 3.758 2.587a5.733 5.733 0 0 0 5.382.935c2-.638 2.933-2.865 3.137-3.921-.97 1.379-2.44 2.208-4.259 1.231-1.253-.673-2.19-3.443-5.963-3.317Z" />
            </svg>
            <h3 className="fw-bold fs-5 mb-0">Confort y Equipamiento</h3>
          </div>
          <ol className="ms-4">
            {confortFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

const SidebarDetail: FC<{
  offer: IOffer
  session: any
  onSuccess: (flowStatus: string) => void
}> = ({ offer, session, onSuccess }) => {
  const [createQuoteSmartIt] = useMutation(MUTATION_CREATE_QUOTE)
  const [mutation] = useMutation(CREATE_APPLICATION)
  const [open, setOpen] = useState(false)
  const [flowStatus, setFlowStatus] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)

    try {
      const mutationData = await mutation({
        variables: {
          offerId: offer.id,
        },
      })

      if (!mutationData.data || !mutationData.data.createApplication) {
        throw new Error('Hubo un problema al crear la aplicación')
      }

      const quoteData = await createQuoteSmartIt({
        variables: {
          marca: offer.product.brand,
          modelo: offer.product.model,
          anio: offer.product.year,
          uuid: session?.user?.id,
          idVersion: String(offer.product.idversion),
          idSmartIt: '',
        },
      })

      if (!quoteData.data || !quoteData.data.createQuoteSmartIt) {
        throw new Error('Hubo un problema al crear la cotización')
      }

      setFlowStatus(mutationData.data.createApplication.flowStatus ?? 'REJECT')
      handleClose()
    } catch (error: any) {
      console.error('Error:', error)
      setErrorMessage('Hubo un problema al procesar su solicitud, por favor intente más tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (flowStatus) {
      onSuccess(flowStatus)
    }
  }, [flowStatus, onSuccess])

  return (
    <>
      {isSubmitting && (
        <Dialog open={true} onClose={handleClose}>
          <DialogContent>
            <Box textAlign="center" my={4}>
              <CircularProgress />
              <Typography variant="h5" mt={2} sx={{ color: '#6FB142' }}>
                Procesando solicitud...
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Por favor, espere un momento.
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {errorMessage && <ErrorModal errorMessage={errorMessage} onClose={() => setErrorMessage(null)} />}

      <div className="col-lg-4">
        <div className="text-center tarjeta-precio mb-4">
          <h4 className="text-center">
            <strong>{offer.product.brand}</strong>
            <br />
            <strong className="verde-rent">{offer.product.model}</strong>
          </h4>
          <Divider sx={{ marginY: 1.5, borderColor: '#E0E0E0' }} />
          <p className="text-white mb-0">
            <strong>Semanalidad con IVA, desde</strong>
          </p>
          <center>
            <div className="d-inline-flex text-center center mx-auto mb-4">
              <h3 className="verde-rent mb-0 text-center">
                <strong>${Number(offer.weeklyPrice || 0).toLocaleString()}</strong>
              </h3>
              <p className="mb-0 mt-2 text-white text-center">&nbsp;MXN</p>
            </div>
          </center>
          <div>
            <a onClick={() => router.back()}>
              <ButtonSharedIcon title="Selecciona otro modelo" iconName="row-left" style={2} disabled={false} />
            </a>
            <br />
            <a onClick={handleClickOpen}>
              <ButtonSharedIcon title="Confirmar selección" iconName="check" style={1} disabled={false} />
              {/* <img src="/images/btn-confirmar.svg" className="img-fluid w-75 mb-3" alt="Confirmar" /> */}
            </a>
          </div>
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
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                fontWeight: 'bold',
                color: '#6FB142',
                textAlign: 'center',
                fontSize: { xs: '20px', sm: '22px', md: '24px' },
              }}
            >
              Confirmar Selección
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                sx={{
                  color: '#6D6E71',
                  fontSize: { xs: '14px', sm: '16px', md: '18px' },
                }}
              >
                ¿Estás seguro de que quieres iniciar el proceso para obtener tu {offer.product.brand}?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                onClick={() => router.back()}
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
                  fontSize: { xs: '14px', sm: '16px', md: '18px' },
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
                  fontSize: { xs: '14px', sm: '16px', md: '18px' },
                }}
                autoFocus
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  )
}

const OfferPage: FC<Props> = ({ params }) => {
  const { data: session, status } = useSession()
  const [flowStatus, setFlowStatus] = useState<string | null>(null)
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      offerId: params.offerId,
    },
  })

  if (loading || status === 'loading') return <LoadingScreen />
  if (error) return <ErrorModal errorMessage="Hubo un problema al cargar la oferta." onClose={() => null} />

  if (status === 'unauthenticated') {
    return <ErrorModal errorMessage="Usuario no autenticado." onClose={() => null} />
  }

  const { offerById }: { offerById: IOffer } = data

  if (flowStatus) {
    return (
      <>
        {renderHeaderFins(session?.user.firstName ?? '')}
        <ApplicationCreatedOk flowStatus={flowStatus} />
      </>
    )
  }

  return (
    <>
      {renderHeader(session?.user.firstName ?? '')}
      <div>
        <div className="container my-5">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="row align-items-center mb-4">
                <ImageGallery offer={offerById} />

                {session && <SidebarDetail offer={offerById} session={session} onSuccess={setFlowStatus} />}
              </div>
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <OfferDetails offer={offerById} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OfferPage
