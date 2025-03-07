import { StringValue } from '@domain/shared/StringValue'

export interface IdentificationCardScheme {
  firstName?: string
  middleName?: string
  lastName?: string
  addressStreetName?: string
  addressHouseNumber?: string
  addressNeighborhood?: string
  addressPostalCode?: string
  addressCity?: string
  addressState?: string
  dob?: string
}

export interface ParseService {
  parseIdentificationCardFromText(text: StringValue): Promise<IdentificationCardScheme>
}
