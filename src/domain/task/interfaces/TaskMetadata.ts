import { ContentProvider } from '@domain/content/ContentProvider'
import { ContentStorageKey } from '@domain/content/ContentStorageKey'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

// every property here MUST be optional and can be used in different scenarios
export interface TaskMetadata {
  message?: StringValue
  slotId?: UUID
  referencia?: StringValue
  idcliente?: NumberValue
  contentProvider?: ContentProvider
  contentStorageKey?: ContentStorageKey
}
