import { NextRequest } from 'next/server'
import { ContentKey } from '@domain/content/ContentKey'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { ContentService } from '@/application/service/ContentService'

export async function GET(_request: NextRequest, { params }: { params: { contentKey: string } }) {
  const contentKey = new ContentKey(params.contentKey)
  const contentService = container.get<ContentService>(DI.ContentService)

  return contentService.preview(contentKey)
}
