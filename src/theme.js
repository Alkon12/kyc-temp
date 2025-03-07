// src/theme.ts
'use client' // Asegúrate de marcarlo como un archivo del cliente

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontFamily: 'Roboto-Bold, Arial, sans-serif',
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: 'Roboto-Bold, Arial, sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
    },
    h5: {
      fontFamily: 'Roboto-Medium, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    body1: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
    },
    body2: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
  },
  palette: {
    primary: {
      main: '#1d3b5f',
    },
    secondary: {
      main: '#7baf45',
    },
  },
})

export default theme
