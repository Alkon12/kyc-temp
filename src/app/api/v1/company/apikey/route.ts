import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import { KycController } from '@interfaces/controllers/KycController'

const kycController = container.get<KycController>(DI.KycController)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Crear un objeto Request y Response compatible con Express
    const expressReq = {
      body,
      method: 'POST',
      headers: req.headers,
      url: req.url
    } as any

    const expressRes = {
      status: (code: number) => ({
        json: (data: any) => NextResponse.json(data, { status: code })
      })
    } as any

    // Usar el controlador
    return await kycController.generateApiKey(expressReq, expressRes)
    
  } catch (error) {
    console.error('Error generating API Key:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
} 