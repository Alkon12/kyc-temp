'use client'

import React, { useEffect, useRef } from 'react'
import { IUser } from '@type/IUser'
import { IQuote } from '@type/IQuote'
import { gql, useMutation } from '@apollo/client'
import { Box, CircularProgress, Typography, Container } from '@mui/material'

const ACCEPT_INVITATION = gql`
  mutation acceptInvitationMutation($userId: ID!, $invitationId: ID) {
    acceptInvitation(userId: $userId, invitationId: $invitationId) {
      id
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

interface AcceptInvitationProps {
  currentUser: IUser
  invitationId: string
}

const AcceptInvitation: React.FC<AcceptInvitationProps> = ({ currentUser, invitationId }) => {
  const [acceptInvitationMutation, { data, loading, error }] = useMutation(ACCEPT_INVITATION)
  const hasFetchedQuote = useRef(false)
  const calledOnce = useRef(false)

  useEffect(() => {
    if (hasFetchedQuote.current) return

    const fetchData = async () => {
      hasFetchedQuote.current = true
      if (currentUser && currentUser.id) {
        await acceptInvitationMutation({
          variables: {
            userId: currentUser.id,
            invitationId,
          },
        })
      }
    }

    if (calledOnce.current) {
      return
    }
    calledOnce.current = true
    fetchData()
  }, [])

  if (loading || !data) {
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
            <CircularProgress />
            <Typography variant="h5" mt={2} sx={{ color: '#ffffff' }}>
              Obteniendo cotización...
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
              Espere, podríamos demorar unos momentos más
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  if (error) {
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
              UPS!
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
              Error en la solicitud: {error.message}
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  const { acceptInvitation }: { acceptInvitation: IQuote } = data

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
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
            <svg width="32" height="32" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                fill="white"
                stroke="white"
              ></path>
            </svg>
          </div>
          <Typography variant="h5" mt={2} sx={{ color: '#a0ff00' }}>
            Listo por aquí !
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
            Sigue el proceso con el ejecutivo de ventas
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default AcceptInvitation
