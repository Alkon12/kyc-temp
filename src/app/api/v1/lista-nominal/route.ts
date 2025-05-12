import { NextResponse } from 'next/server';
import ValidationService from '@domain/integration/ValidationService';
import container from '@infrastructure/inversify.config';
import { DI } from '@infrastructure/inversify.symbols';

/**
 * API endpoint para validar Lista Nominal
 * POST /api/v1/lista-nominal
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cic, identificador } = body;
    
    // Validar parámetros requeridos
    if (!cic || !identificador) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'CIC e Identificador son requeridos para la validación' 
        },
        { status: 400 }
      );
    }
    
    
    // Obtener el servicio de validación del contenedor de DI
    const validationService = container.get<ValidationService>(DI.ValidationService);
    
    // Realizar la validación
    const result = await validationService.validateListaNominal(cic, identificador);
    
    // Parsear y formatear la respuesta para un formato consistente
    const formattedResponse = {
      success: result.success,
      message: result.message,
      data: {
        data: result.data
      },
      error: result.error
    };
    
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error en API de validación de Lista Nominal:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error en el servicio de validación de Lista Nominal',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 