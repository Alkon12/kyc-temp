'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { TbBrandUber } from 'react-icons/tb'
import { ApolloPublicWrapper } from '@app/ApolloPublicWrapper'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Box, Typography, Container, CircularProgress } from '@mui/material'
import { IInvitation } from '@type/IInvitation'

interface UberConnectProps {
  invitation: IInvitation
}

const UberConnect: React.FC<UberConnectProps> = ({ invitation }) => {
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked)
  }

  const { referrer, product } = invitation

  const loginWithUber = () => {
    setLoading(true)
    signIn('uber', { callbackUrl: `/invitation/${invitation.id}/response` })
  }

  if (loading) {
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
              Conectando con Uber...
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
              Espera un momento, podrías tener que ingresar tu cuenta de Uber
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <ApolloPublicWrapper>
      <div>
        <div className="container">
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
                <div>
                  <Typography variant="h5" mt={2} sx={{ color: '#ffffff' }}>
                    Hola {invitation.firstName} {invitation.lastName} !
                  </Typography>
                  <Typography variant="h6" mt={1} sx={{ color: '#ffffff' }}>
                    Vamos por tu {product?.brand} {product?.model}
                  </Typography>

                  <Typography variant="subtitle1" mt={4} sx={{ color: '#cccccc' }}>
                    Use su cuenta de Uber para ingresar, luego{' '}
                    <strong>
                      {referrer?.firstName} {referrer?.lastName}
                    </strong>{' '}
                    le guiará en el resto del proceso
                  </Typography>
                </div>
                <div className="pt-6 mt-6">
                  <div className="form-check pt-6 mb-3 d-flex justify-content-center align-items-center">
                    <Typography variant="subtitle1" mt={4} sx={{ color: '#ffffff' }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="termsCheck"
                        checked={termsAccepted}
                        onChange={handleTermsChange}
                      />
                      <label className="form-check-label ms-2 text-white" htmlFor="termsCheck">
                        Acepto los{' '}
                        <a href="/termsandConditions" target="_blank" rel="noopener noreferrer">
                          términos y condiciones
                        </a>
                        .
                      </label>
                    </Typography>
                  </div>
                  <div className="mb-3 d-flex justify-content-center align-items-center">
                    <button
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      onClick={() => loginWithUber()}
                      disabled={loading || !termsAccepted}
                      style={{ backgroundColor: '#7BAF45', borderColor: '#7BAF45' }}
                    >
                      <TbBrandUber className="me-2" />
                      Continue con su cuenta de Uber
                    </button>
                  </div>
                </div>
              </Box>
            </Container>
          </Box>
        </div>
      </div>
    </ApolloPublicWrapper>
  )
}

export default UberConnect
