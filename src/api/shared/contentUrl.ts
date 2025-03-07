import { ContentKey } from '@domain/content/ContentKey'

export function getContentUrl(contentKey: ContentKey, action?: 'OPEN' | 'DOWNLOAD' | 'PREVIEW' | 'THUMBNAIL'): string {
  let actionUrl = ''

  switch (action) {
    case 'OPEN':
      actionUrl = ''
      break

    case 'DOWNLOAD':
      actionUrl = 'download'
      break

    case 'PREVIEW':
      actionUrl = 'preview'
      break

    case 'THUMBNAIL':
      actionUrl = 'thumbnail'
      break

    default:
      break
  }

  return `${process.env.NEXTAUTH_URL}/api/v1/content/get/${contentKey.toDTO()}/${actionUrl}`
}
