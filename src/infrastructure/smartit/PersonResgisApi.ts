import { injectable } from 'inversify'
import { nullsToUndefined } from '@/client/utils/nullToUndefined'
import { StringValue } from '@domain/shared/StringValue'
import PersonRegisRepository from '@domain/onBoarding/PersonRegiRepository'
import { PersonRegisEntity } from '@domain/onBoarding/PersonRegisEntity'
import { PersonRegiFactory } from '@domain/onBoarding/PersonRegiFactory'
import { IPersonRegis } from '@type/entities'
import { PrismaClient } from '@prisma/client'

@injectable()
export class PersonResgisApi implements PersonRegisRepository {
  private prisma: PrismaClient
  private readonly URL: string

  constructor() {
    this.prisma = new PrismaClient()
    this.URL = `${process.env.NEXT_PUBLIC_URL_SMARTIT}/persona`
  }

  async RegisPerson(
    Nombre: StringValue,
    ApellidoPaterno: StringValue,
    ApellidoMaterno: StringValue,
    NumeroCelular: StringValue,
    idGUID: StringValue,
    Email: StringValue,
  ): Promise<PersonRegisEntity | null> {
    try {
      const formattedNumeroCelular = this.formatPhoneNumber(NumeroCelular._value)

      const data = {
        Nombre: Nombre._value,
        ApellidoPaterno: ApellidoPaterno._value,
        ApellidoMaterno: ApellidoMaterno._value,
        NumeroCelular: formattedNumeroCelular,
        UUID: idGUID._value,
        Email: Email._value,
      }
      console.log('[RegisPerson]', this.URL)
      console.log('[RegisPerson] [data]', data)
      const respuesta = await this.sendRequest(this.URL, data)

      console.log('[respuesta]', respuesta)

      if (respuesta.IdCliente) {
        const idPersona = parseInt(respuesta.IdCliente, 10)

        await this.updateApplications(idGUID._value, idPersona)

        const personData = {
          idGUID: new StringValue(respuesta.Objeto),
          Nombre: Nombre,
          ApellidoPaterno: ApellidoPaterno,
          ApellidoMaterno: ApellidoMaterno,
          NumeroCelular: NumeroCelular,
          Email: Email,
        }
      }
    } catch (error) {
      console.error('Error registering person:', error)
      throw error
    }

    return null
  }

  private formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '').slice(-10)
  }

  private async sendRequest(url: string, data: object): Promise<any> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`,
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(url, options)
    return response.json()
  }

  private async updateApplications(userId: string, idPersona: number): Promise<void> {
    const updateResult = await this.prisma.application.updateMany({
      where: { userId: userId },
      data: { idpersona: String(idPersona) },
    })

    if (updateResult.count === 0) {
      throw new Error('No applications found for the given userId')
    }
  }
}
