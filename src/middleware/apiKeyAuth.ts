import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { ApiKeyAuthService } from '@/application/service/ApiKeyAuthService'

export async function apiKeyAuth(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 401 }
      )
    }

    const apiKeyAuthService = container.get<ApiKeyAuthService>(DI.ApiKeyAuthService)
    const company = await apiKeyAuthService.validateApiKey(apiKey)

    // Modificar los headers directamente en la request original
    // ya que no podemos modificar la request en NextResponse.next()
    const originalHeaders = request.headers
    if (originalHeaders && originalHeaders instanceof Headers) {
      originalHeaders.set('x-company-id', company.getId().toDTO())
    } else if (request.headers && request.headers.set) {
      request.headers.set('x-company-id', company.getId().toDTO())
    }

    // Retornar ok
    return NextResponse.next()
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
} 