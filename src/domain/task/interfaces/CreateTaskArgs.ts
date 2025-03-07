import { TaskEntityProps } from '../TaskEntity'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { TaskRelevance } from '../models/TaskRelevance'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { JsonValue } from '@domain/shared/JsonValue'

export type CreateTaskArgs = Merge<
  TaskEntityProps,
  {
    id?: UUID
    createdAt?: DateTimeValue
    done?: BooleanValue
    relevance?: TaskRelevance
    dismissible?: BooleanValue
    optional?: BooleanValue
    customData?: JsonValue
  }
>
