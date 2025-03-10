import { DI } from '@infrastructure'
import container from '@infrastructure/inversify.config'
import { UserService } from '@service/UserService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.debug('UBER WEBHOOK REQUEST X-Environment', request.headers.get('X-Environment'))
  console.debug('UBER WEBHOOK REQUEST', request)
  // console.debug('UBER WEBHOOK REQUEST BODY JSON', await request.json())

  const userService = container.get<UserService>(DI.AuditService)
  const users = await userService.getAll()
  const usersDTO = users.map(user => user.toDTO())

  return NextResponse.json({ status: 200, webhook: 'OK', data: usersDTO })
}
