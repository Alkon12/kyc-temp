import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { UserEntity } from '@domain/user/models/UserEntity'

export interface Prospect {
  user?: UserEntity
  lastQuote?: QuoteEntity
  quoteCount: NumberValue
  lastQuoteAt?: DateTimeValue
}
