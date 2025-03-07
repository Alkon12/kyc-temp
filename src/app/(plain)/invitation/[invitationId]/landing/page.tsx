'use client'

import React, { FC, useState, useEffect } from 'react'
import UberConnect from './UberConnect'
import { useQuery, gql, useMutation } from '@apollo/client'
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
import { IInvitation } from '@type/IInvitation'

interface Props {
  params: {
    invitationId: string
  }
}

const QUERY = gql`
  query InvitationById($invitationId: ID!) {
    invitationById(invitationId: $invitationId) {
      id
      firstName
      lastName
      email
      phoneNumber
      hasUberAccount
      productId
      isOnsite
      referrerId
      campaignId
      branchId
      promotionId
      status
      createdAt
      updatedAt
      referrer {
        email
        firstName
        lastName
      }
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

const InvitationLandingPage: FC<Props> = ({ params }) => {
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      invitationId: params.invitationId,
    },
  })

  if (loading || status === 'loading')
    return (
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
            <Typography variant="h5" mt={2} sx={{ color: '#ffffff' }}>
              Cargando invitación..
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
              Por favor espere un segundo
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  if (error) return <ErrorModal errorMessage="Hubo un problema al cargar la invitación." onClose={() => null} />

  const { invitationById }: { invitationById: IInvitation } = data

  return (
    <div>
      <UberConnect invitation={invitationById} />
    </div>
  )
}

export default InvitationLandingPage
