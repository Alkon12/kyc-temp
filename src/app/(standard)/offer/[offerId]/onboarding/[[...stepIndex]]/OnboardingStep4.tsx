'use client'

import React, { FC, useState } from 'react'
import { IUser } from '@type/IUser'
import { IOffer } from '@type/IOffer'
import { gql, useMutation } from '@apollo/client'
import ApplicationCreatedOk from './ApplicationCreatedOk'
import { Box, Button, CircularProgress, Container, Paper, Typography, Dialog, DialogContent } from '@mui/material'

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

export interface OnboardingStep4Props {
  currentUser: IUser
  offer: IOffer
}

const OnboardingStep4: FC<OnboardingStep4Props> = ({ offer, currentUser }) => {
  const [mutation, { data, loading, error }] = useMutation(CREATE_APPLICATION)
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCreateApplication = async () => {
    if (currentUser) {
      const mutationData = await mutation({
        variables: {
          offerId: offer.id,
        },
      })
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
            Error en mutation... {error.message}
          </Typography>
        </DialogContent>
      </Dialog>
    )
  }

  if (data) {
    const flowStatus = data.createApplication.flowStatus ?? 'REJECT'
    return <ApplicationCreatedOk flowStatus={flowStatus} />
  }

  return (
    <Container>
      <Paper
        sx={{
          p: 4,
          my: 4,
          backgroundColor: '#113A5F',
          color: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: '#6FB142', fontWeight: 'bold' }}>
          ✅ {currentUser.firstName}, vamos por tu {offer.product.brand}!
        </Typography>
        <Typography sx={{ mt: 2, color: '#B0BEC5' }}>
          Si quiere iniciar el proceso para obtener su auto, haga click en confirmar
        </Typography>
        <Box sx={{ borderBottom: '1px solid #6FB142', my: 2 }} />
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            onClick={handleCreateApplication}
            sx={{
              backgroundColor: '#6FB142',
              '&:hover': {
                backgroundColor: '#5e9937',
              },
            }}
          >
            Confirmar
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default OnboardingStep4
