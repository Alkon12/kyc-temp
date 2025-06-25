import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { KycPersonId } from '@domain/kycPerson/models/KycPersonId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import AbstractKycPersonService from '@domain/kycPerson/KycPersonService'
import { CreateKycPersonArgs } from '@domain/kycPerson/interfaces/CreateKycPersonArgs'
import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor'
import { NotFoundError } from '@domain/error'

export interface UpdateKycPersonFromFaceTecDto {
  kycPersonId: string
  personalData: PersonalData
}

@injectable()
export class UpdateKycPersonFromFaceTecUseCase {
  constructor(
    @inject(DI.KycPersonService) private kycPersonService: AbstractKycPersonService
  ) {}

  async execute(dto: UpdateKycPersonFromFaceTecDto): Promise<void> {
    const kycPersonId = new KycPersonId(dto.kycPersonId)
    
    // Verificar que la persona KYC existe
    const kycPerson = await this.kycPersonService.getById(kycPersonId)
    
    // Preparar los datos de actualización
    const updateArgs: Partial<CreateKycPersonArgs> = {}
    
    
    // Mapear CURP (viene en idNumber2)
    if (dto.personalData.idNumber2) {
      updateArgs.curp = new StringValue(dto.personalData.idNumber2)
    }
    
    // Mapear número de documento (viene en mrzLine1)
    if (dto.personalData.mrzLine1) {
      updateArgs.documentNumber = new StringValue(dto.personalData.mrzLine1)
    }
    
    // Mapear dirección (separar address1, address2, address3 en street, colony, city)
    if (dto.personalData.address1) {
      updateArgs.street = new StringValue(dto.personalData.address1)
    }
    if (dto.personalData.address2) {
      updateArgs.colony = new StringValue(dto.personalData.address2)
    }
    if (dto.personalData.address3) {
      updateArgs.city = new StringValue(dto.personalData.address3)
    }
    
    // Convertir fecha de nacimiento del formato DD/MM/YYYY al formato YYYY-MM-DD
    if (dto.personalData.dateOfBirth) {
      const convertedDate = this.convertDateFormat(dto.personalData.dateOfBirth)
      if (convertedDate) {
        updateArgs.dateOfBirth = new DateTimeValue(convertedDate)
      }
    }
    
    // Solo actualizar si hay datos para actualizar
    if (Object.keys(updateArgs).length > 0) {
      console.log('Actualizando KycPerson con datos de FaceTec:', {
        kycPersonId: kycPersonId.toDTO(),
        fieldsToUpdate: Object.keys(updateArgs)
      })
      
      await this.kycPersonService.update(kycPersonId, updateArgs)
      
      console.log('KycPerson actualizado exitosamente')
    } else {
      console.log('No hay datos de FaceTec para actualizar en KycPerson')
    }
  }
  
  /**
   * Convierte fecha del formato DD/MM/YYYY al formato YYYY-MM-DD
   * @param dateString Fecha en formato DD/MM/YYYY (ej: "15/10/2002")
   * @returns Date object o null si no se puede convertir
   */
  private convertDateFormat(dateString: string): Date | null {
    try {
      // Validar formato básico
      if (!dateString || typeof dateString !== 'string') {
        console.warn('Formato de fecha inválido:', dateString)
        return null
      }
      
      // Dividir la fecha por "/"
      const parts = dateString.split('/')
      if (parts.length !== 3) {
        console.warn('Formato de fecha no esperado (debe ser DD/MM/YYYY):', dateString)
        return null
      }
      
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)
      
      // Validaciones básicas
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        console.warn('Componentes de fecha no son números válidos:', dateString)
        return null
      }
      
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
        console.warn('Fecha fuera de rango válido:', dateString)
        return null
      }
      
      // Crear la fecha (meses en JavaScript son 0-indexados)
      const date = new Date(year, month - 1, day)
      
      // Verificar que la fecha creada corresponde a la fecha original
      if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        console.warn('Fecha inválida (probablemente día/mes incorrectos):', dateString)
        return null
      }
      
      console.log(`Fecha convertida: ${dateString} -> ${date.toISOString()}`)
      return date
    } catch (error) {
      console.error('Error al convertir formato de fecha:', error)
      return null
    }    
  }
} 