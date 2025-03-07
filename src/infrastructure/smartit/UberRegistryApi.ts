import { UberRegistrySmartItEntity } from '@domain/uberRegistrySmartIt/UberRegistrySmartItEntity'
import { UberRegistrySmartItFactory } from '@domain/uberRegistrySmartIt/UberRegistrySmartItFactory'
import UberRegistrySmartItRepository from '@domain/uberRegistrySmartIt/UberRegistrySmartItRepository'
import { injectable } from 'inversify'

@injectable()
export class UberRegistryApi implements UberRegistrySmartItRepository {
  private readonly URL: string

  constructor() {
    this.URL = `${process.env.NEXT_PUBLIC_URL_SMARTIT}/registro-uber`
  }

  async getUberRegistryByUserId(userId: string): Promise<UberRegistrySmartItEntity | null> {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`,
      },
    }

    try {
      const response = await fetch(`${this.URL}/${userId}`, options)
      const result = await response.json()

      if (!response.ok) {
        console.log('[UberRegistryApi] {response}', response)
        return null
      }

      if (!result) return null

      const uberRegistryEntity = UberRegistrySmartItFactory.fromDTO(result)

      return uberRegistryEntity
    } catch (error) {
      return null
    }
  }
}
