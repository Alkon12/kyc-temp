import { ContentKey } from '@domain/content/ContentKey'
import { ContentNature } from '@domain/content/ContentNature'
import { ContentQueueKey } from '@domain/content/ContentQueueKey'
import { ContentStorageKey } from '@domain/content/ContentStorageKey'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'

export type ContentQueueStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'UNKNOWN'

export interface ContentQueueSituation {
  queueKey: ContentQueueKey
  storageKey: ContentStorageKey
  status: ContentQueueStatus
  statusMessage: StringValue
  createdAt: DateTimeValue
}

export interface ContentMetadata {
  size?: NumberValue
  originalFilename?: StringValue
  // ....
}

//  TODO type and format from implementation
export interface MetadataResponse {
  original_checksum: string
  original_size: number
  original_mime_type: string
  media_filename: string
  has_archive_version: true
  // original_metadata: [],
  archive_checksum: string
  archive_media_filename: string
  original_filename: string
  archive_size: number
  archive_metadata: {
    namespace: string
    prefix: string
    key: string
    value: string
  }[]
  lang: string
}

//  TODO type and format from implementation
export interface DocumentResponse {
  id: number
  // correspondent: null,
  // document_type: null,
  // storage_path: null,
  title: string
  content: string | null
  tags: number[]
  created: string | null
  created_date: string | null
  modified: string | null
  added: string | null
  deleted_at: string | null
  archive_serial_number: string | null
  original_file_name: string | null
  archived_file_name: string | null
  owner: number | null
  user_can_change: boolean
  is_shared_by_requester: boolean
  notes: string[]
  // custom_fields: {
  //   value: string | null
  //   field: number | null
  // }[]
  custom_fields: ContentCustomField[]
}

export interface ContentCustomField {
  value: string | null
  field: number | null
}

export interface ContentService {
  save(file: File, contentNature?: ContentNature): Promise<ContentQueueKey>
  getQueueJob(referenceKey: ContentQueueKey): Promise<ContentQueueSituation | null>
  info(contentKey: ContentKey): Promise<DocumentResponse>
  download(contentKey: ContentKey): Promise<Response>
  delete(contentKey: ContentKey): Promise<boolean>
  thumbnail(contentKey: ContentKey): Promise<Response>
  preview(contentKey: ContentKey): Promise<Response>
  metadata(contentKey: ContentKey): Promise<ContentMetadata>
  updateCustomFields(storageKey: ContentStorageKey, customFields: ContentCustomField[]): Promise<Boolean>
  content(contentKey: ContentKey): Promise<string | null>
}
