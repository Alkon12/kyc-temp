import { injectable } from 'inversify'
import { NotFoundError, UnexpectedError } from '@domain/error'
import {
  ContentCustomField,
  ContentMetadata,
  ContentQueueSituation,
  ContentQueueStatus,
  ContentService,
  DocumentResponse,
  MetadataResponse,
} from '@/application/service/ContentService'
import { ContentQueueKey } from '@domain/content/ContentQueueKey'
import { ContentKey } from '@domain/content/ContentKey'
import { ContentProvider } from '@domain/content/ContentProvider'
import { ContentStorageKey } from '@domain/content/ContentStorageKey'
import { DateTimeValue } from '@domain/shared/DateTime'
import { StringValue } from '@domain/shared/StringValue'
import { ContentNature } from '@domain/content/ContentNature'
import { NumberValue } from '@domain/shared/NumberValue'
import { NextResponse } from 'next/server'

type QueueJobResponse = {
  id: number
  task_id: string
  task_file_name: string
  date_created: string
  date_done: string
  type: string
  status: string
  result: string
  acknowledged: boolean
  related_document: string
}

@injectable()
export class PaperlessAPI implements ContentService {
  async content(contentKey: ContentKey): Promise<string | null> {
    this._checkCorrectProvider(contentKey)

    const url = this._getUrl(`/documents/${contentKey.getKey().toDTO()}/`)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this._buildHeaders(),
      })

      if (response.status === 404) {
        throw new NotFoundError(`No se ha encontrado el documento solicitado ${contentKey.getKey().toDTO()}`)
      }
      if (response.status !== 200) {
        throw new UnexpectedError(`Ha ocurrido un error al consultar el documento ${response.statusText}`)
      }
      const data = await response.json()
      const jsonString = await data
      const existPdf = jsonString.original_file_name.split('.')
      if (existPdf[1] === 'pdf') return jsonString.content
      return null
    } catch (error) {
      console.log('No se puede conecar a PaperlessAPI')
      throw new UnexpectedError(`Ha ocurrido un error al obtener un archivo`)
    }
  }

  async save(file: File, contentNature?: ContentNature): Promise<ContentQueueKey> {
    const formData: FormData = new FormData()
    formData.append('document', file)

    const metadata = this._getMetadataForContentNature(contentNature)
    metadata.forEach((m) => formData.append(Object.keys(m)[0], m[Object.keys(m)[0]]))

    try {
      const response = await fetch(this._getUrl('/documents/post_document/'), {
        method: 'POST',
        headers: this._buildHeaders(),
        body: formData,
      })

      if (response.status !== 200) {
        console.log('PaperlessAPI Response ERROR:', response)
        throw new UnexpectedError(`Ha ocurrido un error al guardar el archivo`)
      }

      const jobId = await response.json()

      return new ContentQueueKey(jobId)
    } catch (error) {
      console.error('PaperlessAPI Upload ERROR', error)
      throw new UnexpectedError(`Ha ocurrido un error al guardar el archivo`)
    }
  }

  async getQueueJob(referenceKey: ContentQueueKey): Promise<ContentQueueSituation | null> {
    const variables = new URLSearchParams({
      task_id: referenceKey.toDTO(),
    })

    const paperlessResponse = await fetch(this._getUrl(`/tasks/?${variables}`), {
      method: 'GET',
      headers: this._buildHeaders(),
    })

    if (paperlessResponse.status === 404) {
      return null
    }
    if (paperlessResponse.status !== 200) {
      throw new UnexpectedError(`Error fetching job ${paperlessResponse.statusText}`)
    }

    const jobResponse = await paperlessResponse.json()
    if (!jobResponse[0]) {
      return null
    }
    const jobStatus = jobResponse[0] as QueueJobResponse

    let status: ContentQueueStatus = 'UNKNOWN'
    switch (jobStatus.status) {
      case 'SUCCESS':
        status = 'SUCCEEDED'
        break

      case 'FAILURE':
        status = 'FAILED'
        break

      default:
        status = 'UNKNOWN'
        break
    }

    const response: ContentQueueSituation = {
      queueKey: referenceKey,
      storageKey: new ContentStorageKey(jobStatus.related_document),
      status,
      statusMessage: new StringValue(jobStatus.result),
      createdAt: new DateTimeValue(jobStatus.date_created),
    }

    return response
  }

  async info(contentKey: ContentKey): Promise<DocumentResponse> {
    this._checkCorrectProvider(contentKey)

    const url = this._getUrl(`/documents/${contentKey.getKey().toDTO()}/`)
    console.log('Get URL', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: this._buildHeaders(),
    })

    console.log('paperless content response', response)

    if (response.status === 404) {
      throw new NotFoundError(`No se ha encontrado el documento solicitado ${contentKey.getKey()}`)
    }
    if (response.status !== 200) {
      throw new UnexpectedError(`Ha ocurrido un error al consultar el documento ${response.statusText}`)
    }
    const document = await response.json()

    console.log('paperless json content', document)

    return document
  }

  async download(contentKey: ContentKey): Promise<Response> {
    this._checkCorrectProvider(contentKey)

    const url = this._getUrl(`/documents/${contentKey.getKey().toDTO()}/download/`)
    console.log('Download URL', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: this._buildHeaders(),
    })
    if (response.status !== 200) {
      throw new UnexpectedError(`Ha ocurrido un error al consultar el documento ${response.statusText}`)
    }
    return response
  }

  async delete(contentKey: ContentKey): Promise<boolean> {
    this._checkCorrectProvider(contentKey)

    try {
      const response = await fetch(this._getUrl(`/documents/${contentKey.getKey().toDTO()}`), {
        method: 'DELETE',
        headers: this._buildHeaders(),
      })
      if (response.status !== 200) {
        return false
      }

      return true
    } catch (ex) {
      console.log(ex)
      return false
    }
  }

  async thumbnail(contentKey: ContentKey): Promise<Response> {
    this._checkCorrectProvider(contentKey)

    const url = this._getUrl(`/documents/${contentKey.getKey().toDTO()}/thumb/`)
    console.log('Thumbnail URL', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: this._buildHeaders(),
    })
    if (response.status !== 200) {
      throw new UnexpectedError(`Ha ocurrido un error al consultar el documento ${response.statusText}`)
    }
    return response
  }

  async preview(contentKey: ContentKey): Promise<Response> {
    this._checkCorrectProvider(contentKey)

    const url = this._getUrl(`/documents/${contentKey.getKey().toDTO()}/preview/`)
    console.log('Preview URL', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: this._buildHeaders(),
    })
    if (response.status !== 200) {
      throw new UnexpectedError(`Ha ocurrido un error al consultar el documento ${response.statusText}`)
    }
    const clone = response.clone()
    const blob = await clone.blob()
    return new NextResponse(blob)
  }

  async metadata(contentKey: ContentKey): Promise<ContentMetadata> {
    this._checkCorrectProvider(contentKey)

    const response = await fetch(this._getUrl(`/documents/${contentKey.getKey().toDTO()}/metadata/`), {
      method: 'GET',
      headers: this._buildHeaders(),
    })

    if (response.status === 404) {
      throw new NotFoundError(`No se ha encontrado el documento solicitado ${contentKey.getKey()}`)
    }

    if (response.status !== 200) {
      throw new UnexpectedError(`Ha ocurrido un error al consultar el documento ${response.statusText}`)
    }

    const metadata = (await response.json()) as MetadataResponse

    console.log('FILE METADATA', metadata)

    const contentMetadata: ContentMetadata = {
      size: new NumberValue(metadata.archive_size),
      originalFilename: new StringValue(metadata.original_filename),
    }

    return contentMetadata
  }

  async updateCustomFields(storageKey: ContentStorageKey, customFields: ContentCustomField[]): Promise<Boolean> {
    //this._checkCorrectProvider(contentKey)

    // console.log("[PaperlessAPI] {uri}",this._getUrl(`/documents/${storageKey.toDTO()}/`))
    // console.log("[PaperlessAPI] {customFields}", customFields)

    const response = await fetch(this._getUrl(`/documents/${storageKey.toDTO()}/`), {
      method: 'PATCH',
      headers: {
        ...this._buildHeaders(),
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ custom_fields: customFields }),
    })

    if (response.status !== 200) {
      throw new UnexpectedError(`Ha ocurrido un error al actualizar el documento ${response.statusText}`)
    }

    const document = await response.json()
    console.log('[PaperlessAPI] updateCustomFields {custom_fields}', document.custom_fields)

    return true
  }

  private _getUrl(endpoint: string) {
    return `${process.env.PAPERLESS_URL}${endpoint}`
  }

  private _buildHeaders() {
    return {
      Authorization: `Token ${process.env.PAPERLESS_API_TOKEN}`,
    }
  }

  private _checkCorrectProvider(contentKey: ContentKey) {
    if (
      !contentKey.getProvider().sameValueAs(ContentProvider.PAPERLESS_TEST) &&
      !contentKey.getProvider().sameValueAs(ContentProvider.PAPERLESS_PRODUCTION)
    ) {
      throw new NotFoundError(
        `The content implementation doesn't correspond to the content provider key ${contentKey.getProvider().toDTO()}`,
      )
    }
  }

  private _getMetadataForContentNature(contentNature?: ContentNature): Record<string, string>[] {
    if (!contentNature) {
      return []
    }

    const meta: Record<string, string>[] = []

    if (contentNature.sameValueAs(ContentNature.IDENTIFICATION_CARD)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '2' })
    }

    if (contentNature.sameValueAs(ContentNature.IDENTIFICATION_CARD_REVERSE)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '13' })
    }

    if (contentNature.sameValueAs(ContentNature.SELFIE_PICTURE)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '6' })
    }

    if (contentNature.sameValueAs(ContentNature.DRIVERS_LICENSE)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '4' })
    }

    if (contentNature.sameValueAs(ContentNature.DRIVERS_LICENSE_REVERSE)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '12' })
    }

    if (contentNature.sameValueAs(ContentNature.INCOME_STATEMENT)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '10' })
    }

    if (contentNature.sameValueAs(ContentNature.INACTIVITY_STATEMENT)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '11' })
    }

    if (contentNature.sameValueAs(ContentNature.TAX_IDENTIFICATION)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '8' })
    }

    if (contentNature.sameValueAs(ContentNature.ADDRESS_PROOF)) {
      meta.push({ storage_path: '2' }, { custom_fields: '2' }, { tags: '1' }, { tags: '3' })
    }

    return meta
  }

  private _fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      // Define the onload event handler
      reader.onload = () => {
        // reader.result will contain the Base64 string
        resolve(reader.result as string)
      }

      // Define the onerror event handler
      reader.onerror = (error) => {
        reject(error)
      }

      // Start reading the file as a Data URL (Base64 string)
      reader.readAsDataURL(file)
    })
  }
}
