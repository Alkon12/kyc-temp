import { AuditService } from '@/application/service/AuditService'
import { DI } from '@infrastructure'
import container from '@infrastructure/inversify.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.debug('UBER WEBHOOK REQUEST X-Environment', request.headers.get('X-Environment'))
  console.debug('UBER WEBHOOK REQUEST X-Uber-Signature', request.headers.get('X-Uber-Signature'))
  console.debug('UBER WEBHOOK REQUEST', request)
  // console.debug('UBER WEBHOOK REQUEST BODY JSON', await request.json())

  const audit = container.get<AuditService>(DI.AuditService)
  audit.audit('UBER WEBHOOK REQUEST BODY JSON', await request.json())

  return NextResponse.json({ status: 200, webhook: 'OK' })
}
