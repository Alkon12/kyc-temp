import { useState } from 'react'
import { useMutation, gql, ApolloClient } from '@apollo/client'
import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor'

// Mutación GraphQL para actualizar KycPerson
const UPDATE_KYC_PERSON = gql`
  mutation UpdateKycPerson($updateKycPersonId: ID!, $input: UpdateKycPersonInput!) {
    updateKycPerson(id: $updateKycPersonId, input: $input) {
      id
      firstName
      secondName
      lastName
      secondLastName
      curp
      dateOfBirth
      nationality
      documentNumber
      documentType
      email
      phone
      street
      colony
      city
      verificationId
    }
  }
`

export const useKycPersonUpdate = (apolloClient?: ApolloClient<any>) => {
  const [error, setError] = useState<string | null>(null)
  
  const [updateKycPersonMutation, { loading: isUpdating }] = useMutation(UPDATE_KYC_PERSON, {
    client: apolloClient
  })

  /**
   * Convierte fecha del formato DD/MM/YYYY al formato YYYY-MM-DD para GraphQL
   */
  const convertDateFormat = (dateString: string): string | null => {
    try {
      if (!dateString || typeof dateString !== 'string') {
        console.warn('Formato de fecha inválido:', dateString)
        return null
      }
      
      const parts = dateString.split('/')
      if (parts.length !== 3) {
        console.warn('Formato de fecha no esperado (debe ser DD/MM/YYYY):', dateString)
        return null
      }
      
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)
      
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        console.warn('Componentes de fecha no son números válidos:', dateString)
        return null
      }
      
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
        console.warn('Fecha fuera de rango válido:', dateString)
        return null
      }
      
      // Crear la fecha en formato YYYY-MM-DD
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      console.log(`Fecha convertida: ${dateString} -> ${formattedDate}`)
      return formattedDate
    } catch (error) {
      console.error('Error al convertir formato de fecha:', error)
      return null
    }
  }

  const updateKycPersonFromFaceTec = async (
    kycPersonId: string,
    personalData: PersonalData
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null)

    try {
      console.log('Actualizando KycPerson con datos de FaceTec:', {
        kycPersonId,
        personalDataKeys: Object.keys(personalData)
      })

      // Mapear los datos de PersonalData al formato que espera UpdateKycPersonInput
      const input: any = {}
      
      // Mapear CURP (viene en idNumber2)
      if (personalData.idNumber2) {
        input.curp = personalData.idNumber2
      }
      
      // Mapear número de documento (viene en mrzLine1)
      if (personalData.mrzLine1) {
        input.documentNumber = personalData.mrzLine1
      }
      
      // Mapear dirección (separar address1, address2, address3 en street, colony, city)
      if (personalData.address1) {
        input.street = personalData.address1
      }
      if (personalData.address2) {
        input.colony = personalData.address2
      }
      if (personalData.address3) {
        input.city = personalData.address3
      }
      
      // Convertir fecha de nacimiento del formato DD/MM/YYYY al formato YYYY-MM-DD
      if (personalData.dateOfBirth) {
        const convertedDate = convertDateFormat(personalData.dateOfBirth)
        if (convertedDate) {
          input.dateOfBirth = convertedDate
        }
      }

      // Solo actualizar si hay datos para actualizar
      if (Object.keys(input).length === 0) {
        console.log('No hay datos de FaceTec para actualizar en KycPerson')
        return { success: true }
      }

      console.log('Datos a actualizar en KycPerson:', input)

      // Ejecutar la mutación GraphQL
      const result = await updateKycPersonMutation({
        variables: {
          updateKycPersonId: kycPersonId,
          input
        }
      })

      if (result.data?.updateKycPerson) {
        console.log('KycPerson actualizado exitosamente:', result.data.updateKycPerson)
        return { success: true }
      } else {
        const errorMessage = 'No se recibió respuesta válida del servidor'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar KycPerson'
      console.error('Error al actualizar KycPerson:', err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return {
    updateKycPersonFromFaceTec,
    isUpdating,
    error
  }
} 