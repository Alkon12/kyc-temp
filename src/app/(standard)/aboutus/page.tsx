import React from 'react'
import { Container, Typography, Box } from '@mui/material'

const QuieneSomos: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          textAlign: 'center',
          minHeight: '100vh',
          pb: { xs: '2rem', md: '0rem' },
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Quienes Somos
        </Typography>
        <Typography variant="body1" paragraph></Typography>
      </Box>
    </Container>
  )
}

export default QuieneSomos
