'use client'

import React, { useState, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Container,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { gql, useMutation } from '@apollo/client'
import { MdEmail } from 'react-icons/md'

const CREATE_LEAD = gql`
  mutation CreateLead($input: CreateLeadInput!) {
    createLead(input: $input)
  }
`

interface DriverSignUpManualProps {
  onClose?: () => void
  onLoading?: (loading: boolean) => void
}

const DriverSignUpManual: React.FC<DriverSignUpManualProps> = ({ onClose, onLoading }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [contactType, setContactType] = useState('')
  const router = useRouter()
  const [mutateFunction, { data, loading, error }] = useMutation(CREATE_LEAD)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      contactype: '',
    },
  })

  useEffect(() => {
    if (loading) {
      onLoading && onLoading(true)
    } else {
      onLoading && onLoading(false)
    }
  }, [loading, onLoading])

  useEffect(() => {
    if (data) {
      onClose && onClose()
      router.push('/lead/signedup')
    }
  }, [data, onClose, router])

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    setIsLoading(true)

    await mutateFunction({
      variables: {
        input: {
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactype: formData.contactype,
        },
      },
    })
    setIsLoading(false)
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 2 }}>
        Error en mutation... {error.message}
      </Typography>
    )
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column">
        <CircularProgress color="primary" size={50} />
        <Typography variant="body2" sx={{ ml: 2, fontSize: '16px' }}>
          Ingresando sus datos...
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column">
        <Typography variant="h5" align="center" gutterBottom>
          Completa tus datos
        </Typography>

        <TextField
          id="firstName"
          label="Nombres"
          disabled={isLoading}
          {...register('firstName', { required: 'El nombre es requerido' })}
          error={!!errors.firstName}
          helperText={errors.firstName ? 'El nombre es requerido' : ''}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="lastName"
          label="Apellidos"
          disabled={isLoading}
          {...register('lastName', { required: 'El apellido es requerido' })}
          error={!!errors.lastName}
          helperText={errors.lastName ? 'El apellido es requerido' : ''}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="phoneNumber"
          label="Teléfono"
          disabled={isLoading}
          {...register('phoneNumber', { required: 'El teléfono es requerido' })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber ? 'Teléfono es requerido' : ''}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="email"
          label="E-Mail"
          type="email"
          disabled={isLoading}
          {...register('email', {
            required: 'E-Mail es requerido',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Correo no es válido',
            },
          })}
          error={!!errors.email}
          helperText={errors.email ? (errors.email.message as string) : ''}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="contactype-label">Método de contacto</InputLabel>
          <Select
            labelId="contactype-label"
            id="contactype"
            value={contactType}
            label="Método de contacto"
            {...register('contactype', { required: 'Método de contacto es requerido' })}
            onChange={(e) => setContactType(e.target.value)}
            error={!!errors.contactype}
          >
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
            <MenuItem value="email">Correo</MenuItem>
          </Select>
          {errors.contactype && (
            <Typography color="error" variant="body2">
              {errors.contactype?.message as string}
            </Typography>
          )}
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          sx={{
            backgroundColor: '#7BAF45',
            '&:hover': {
              backgroundColor: '#66BB6A',
            },
            color: 'white',
            padding: '12px 20px',
            fontSize: '16px',
            mt: 2,
          }}
        >
          Enviar
        </Button>
      </Box>
    </Container>
  )
}

export default DriverSignUpManual
