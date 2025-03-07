'use client'

import React, { useEffect, useRef } from 'react'
import { IUser } from '@type/IUser'
import { IQuote } from '@type/IQuote'
import { gql, useMutation } from '@apollo/client'
import { Box, CircularProgress, Typography, Container } from '@mui/material'
import Offers from './Offers'

const GET_OR_CREATE_QUOTE = gql`
  mutation GetOrCreateQuote($userId: ID!) {
    getOrCreateQuote(userId: $userId) {
      id
      scoringComplete
      scoringError
      expiresAt
      offers {
        id
        scoringResolution
        scoringMark
        weeklyPrice
        leasingPeriod
        expiresAt
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
  }
`

interface QuoteProps {
  currentUser: IUser
}

const Quote: React.FC<QuoteProps> = ({ currentUser }) => {
  const [mutation, { data, loading, error }] = useMutation(GET_OR_CREATE_QUOTE)
  const hasFetchedQuote = useRef(false)
  const calledOnce = useRef(false)

  useEffect(() => {
    if (hasFetchedQuote.current) return

    const fetchData = async () => {
      hasFetchedQuote.current = true
      if (currentUser && currentUser.id) {
        await mutation({
          variables: {
            userId: currentUser.id,
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
              Obteniendo su cotización...
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
              Por favor espere que podríamos demorar unos momentos
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Container sx={{ paddingTop: 0 }}>
        <Typography variant="h6" color="error">
          Error en la solicitud: {error.message}
        </Typography>
      </Container>
    )
  }

  const { getOrCreateQuote }: { getOrCreateQuote: IQuote } = data

  const approvedOffers = getOrCreateQuote.offers.filter((offer) => offer.scoringResolution !== 'REJECT')
  const hasApprovedOffers = approvedOffers.length > 0

  return (
    <>
      <div className="pagetitle p-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-5">
              <h3 className="lead text-white">{currentUser ? `¡Hola ${currentUser.firstName}!` : ''}</h3>              
              {hasApprovedOffers ? (
                <h4 className="text-white">
                  Elige el que mejor se ajuste a tus necesidades.
                </h4>
              ) : (
                <h4 className="text-white">
                  <strong>¡Gracias por tu interés!</strong>
                </h4>
              )}
            </div>
            <div className="col-lg-4">
              <center>
                <img
                  src={hasApprovedOffers ? 'images/elige-titulo.webp' : 'images/gracias-1.png'}
                  className="img-fluid"
                  alt="respuesta"
                />
              </center>
            </div>
          </div>
        </div>
      </div>
      <Offers currentUser={currentUser} offers={approvedOffers} />
    </>
  )
}

export default Quote
