import { injectable } from 'inversify'
import fetch from 'node-fetch'
import { PrismaClient } from '@prisma/client'
import { PersonUpdateEntity } from '@domain/personUpdate/PersonUpdateEntity'
import PersonUpdateRepository from '@domain/personUpdate/PersonUpdateRepository'
import { PersonUpdateFactory } from '@domain/personUpdate/PersonUpdateFactory'
import { IPersonUpdate } from '@type/IPersonUpdate'

@injectable()
export class PersonUpdateApi implements PersonUpdateRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async updatePerson(data: IPersonUpdate): Promise<PersonUpdateEntity | null> {
    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}/persona`
    console.log('data', data)

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`,
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(url, options)
    const result = await response.json()

    if (result.ExceptionMessage) {
      throw new Error(result.ExceptionMessage)
    }

    if (result.IdCliente) {
      const idPersona = parseInt(result.IdCliente, 10)
      try {
        await this.updateApplications(data.UUID, idPersona)
      } catch (error) {
        console.error('Error updating applications:', error)
        throw error
      }
    }

    return PersonUpdateFactory.fromDTO(result.IdCliente)
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
