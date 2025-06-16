import { StringValue } from '@domain/shared/StringValue'

export interface CreateCompanyArgs {
  companyName: StringValue
  apiKey: StringValue
  callbackUrl?: StringValue
  redirectUrl?: StringValue
}