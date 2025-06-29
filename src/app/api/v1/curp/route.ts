import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ValidationServiceUnavailableError } from '@domain/integration/ValidationError';
import container from '@infrastructure/inversify.config';
import { DI } from '@infrastructure';
import ValidationService from '@domain/integration/ValidationService';
import { CurpValidationResult } from '@domain/integration/ValidationTypes';

// Esquema de validación para la solicitud
const curpValidationRequestSchema = z.object({
  curp: z.string().length(18),
});

/**
 * Endpoint POST para validar una CURP
 * Este endpoint actúa como proxy para el servicio SOAP, evitando problemas de CORS
 */
export async function POST(request: Request) {
  try {
    // Parsear y validar el cuerpo de la solicitud
    const body = await request.json();
    const validationResult = curpValidationRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Datos de solicitud inválidos',
          errors: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    const { curp } = validationResult.data;

    // Obtener el servicio de validación
    const validationService = container.get<ValidationService>(DI.ValidationService);

    // Validar la CURP
    let validaCurpResult: CurpValidationResult;
    try {
      console.log(`Validando CURP: [${curp}]`);
      validaCurpResult = await validationService.validateCurp(curp);
      console.log('Respuesta del servicio de validación CURP:', JSON.stringify(validaCurpResult, null, 2));
    } catch (error) {
      console.error('Error al validar CURP:', error);
      
      // Verificar si debemos usar el modo de fallback para desarrollo/pruebas
      const useFallbackMode = process.env.NODE_ENV !== 'production' || process.env.USE_VALIDATION_FALLBACK === 'true';
      
      if (useFallbackMode) {
        console.log('Usando modo de fallback para validación de CURP (solo para desarrollo)');
        
        // Crear un resultado de prueba
        validaCurpResult = {
          success: true,
          message: 'Validación CURP simulada para desarrollo',
          data: {
            curp: curp,
            nombre: "NOMBRE SIMULADO",
            apellidoPaterno: "APELLIDO1",
            apellidoMaterno: "APELLIDO2",
            sexo: "HOMBRE",
            fechaNacimiento: "01/01/2000",
            entidadNacimiento: "CIUDAD DE MEXICO"
          }
        };
      } else {
        // En producción, devolver el error adecuado
        if (error instanceof ValidationServiceUnavailableError) {
          return NextResponse.json(
            {
              success: false,
              message: 'Servicio de validación CURP no disponible temporalmente',
              details: error.message
            },
            { status: 503 }
          );
        }
        
        return NextResponse.json(
          {
            success: false,
            message: 'Error al validar CURP',
            details: error instanceof Error ? error.message : String(error)
          },
          { status: 500 }
        );
      }
    }

    // Verificar la respuesta del servicio
    if (!validaCurpResult.success) {
      console.error('Error en el servicio de validación CURP:', {
        message: validaCurpResult.message,
        data: validaCurpResult.data,
        error: validaCurpResult.error,
        completo: JSON.stringify(validaCurpResult)
      });
      
      return NextResponse.json(
        {
          success: false,
          message: 'Error en el servicio de validación CURP' + (validaCurpResult.message ? ': ' + validaCurpResult.message : ''),
          error: validaCurpResult.error
        },
        { status: 500 }
      );
    }

    // Devolver la respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'CURP validada correctamente',
      data: validaCurpResult
    });
  } catch (error) {
    console.error('Error inesperado en el endpoint de validación CURP:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
} 