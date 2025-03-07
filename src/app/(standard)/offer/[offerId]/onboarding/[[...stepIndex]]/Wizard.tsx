'use client'

import React, { FC } from 'react'
import OnboardingStep1 from './OnboardingStep1'
import OnboardingStep2 from './OnboardingStep2'
import OnboardingStep3 from './OnboardingStep3'
import OnboardingStep4 from './OnboardingStep4'
import { useQuery, gql } from '@apollo/client'
import { IUser } from '@type/IUser'
import { IOffer } from '@type/IOffer'
import { Box, CircularProgress, Container, Typography } from '@mui/material'

const QUERY_OFFER = gql`
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
      }
    }
  }
`

interface Props {
  offerId: string
  stepIndex: string
  currentUser: IUser
}

const Wizard: FC<Props> = ({ offerId, stepIndex, currentUser }: Props) => {
  if (!currentUser) {
    return (
      <Container
        sx={{
          backgroundColor: '#2F4E69',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white' }}>
          Usuario no logueado
        </Typography>
      </Container>
    )
  }

  if (!offerId) {
    return (
      <Container
        sx={{
          backgroundColor: '#2F4E69',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white' }}>
          Oferta no especificada
        </Typography>
      </Container>
    )
  }

  const { loading, error, data } = useQuery(QUERY_OFFER, {
    variables: {
      offerId,
    },
  })

  if (loading || !data) {
    return (
      <Container
        sx={{
          backgroundColor: '#2F4E69',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
        <Typography variant="h5" mt={2} sx={{ color: '#6FB142' }}>
          Cargando oferta...
        </Typography>
      </Container>
    )
  }

  if (error) {
    console.error('ERROR', error)
    return (
      <Container
        sx={{
          backgroundColor: '#2F4E69',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white' }}>
          Error al cargar la oferta
        </Typography>
      </Container>
    )
  }

  const offer = data.offerById as IOffer

  let ContentComponent = OnboardingStep1
  switch (Number(stepIndex)) {
    case 1:
      ContentComponent = OnboardingStep1
      break
    case 2:
      ContentComponent = OnboardingStep2
      break
    case 3:
      ContentComponent = OnboardingStep3
      break
    case 4:
      ContentComponent = OnboardingStep4
      break
    default:
      ContentComponent = OnboardingStep1
      break
  }

  return (
    <Box
      sx={{
        backgroundColor: '#2F4E69',
        minHeight: '100vh',
        py: { xs: '1rem', md: '2rem' },
      }}
    >
      <Container>
        <ContentComponent currentUser={currentUser} offer={offer} />
      </Container>
    </Box>
  )
}

export default Wizard
