// src/app/api/debug-db/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const prisma = new PrismaClient()
    
    // Test básico de conexión
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Test de una tabla real (ajusta según tu schema)
    const userCount = await prisma.user.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      connectionTest: result,
      userCount,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...', // Solo primeros 50 chars por seguridad
        nodeEnv: process.env.NODE_ENV,
      },
      prismaVersion: process.env.PRISMA_CLIENT_VERSION || 'unknown',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// También puedes agregar POST si necesitas
export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Use GET method' }, { status: 405 })
}