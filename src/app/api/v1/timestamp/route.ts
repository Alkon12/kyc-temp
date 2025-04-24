import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ValidationServiceUnavailableError } from '@domain/integration/ValidationError';
import container from '@infrastructure/inversify.config';
import { DI } from '@infrastructure';
import ValidationService from '@domain/integration/ValidationService';
import { SelloTiempoResult } from '@domain/integration/ValidationTypes';
import { VerificationLinkService } from '@service/VerificationLinkService';
import { StringValue } from '@domain/shared/StringValue';

// Esquema de validación para la solicitud
const timestampRequestSchema = z.object({
  hash: z.string().min(1),
  token: z.string().min(1)
});

/**
 * Endpoint POST para obtener un sello de tiempo para un hash
 * Este endpoint actúa como proxy para el servicio SOAP, evitando problemas de CORS
 */
export async function POST(request: Request) {
  try {
    // Parsear y validar el cuerpo de la solicitud
    const body = await request.json();
    const validationResult = timestampRequestSchema.safeParse(body);

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

    const { hash, token } = validationResult.data;

    // Verificar que el token sea válido
    const verificationLinkService = container.get<VerificationLinkService>(DI.VerificationLinkService);
    try {
      // Convertir el token string a StringValue para usar con el servicio
      const tokenValue = new StringValue(token);
      
      // Obtener el enlace de verificación usando el token
      const verificationLink = await verificationLinkService.getByToken(tokenValue);
      
      // Verificar si el enlace es válido
      if (!verificationLink || !verificationLink.isValid()) {
        return NextResponse.json(
          {
            success: false,
            message: 'Token de verificación inválido o expirado'
          },
          { status: 400 }
        );
      }

      // Verificar el tipo de verificación
      // Acceder a los props directamente ya que no hay un método getter explícito
      const kycVerification = verificationLink.props.kycVerification;
      if (!kycVerification || !kycVerification.verificationType) {
        return NextResponse.json(
          {
            success: false,
            message: 'No se pudo determinar el tipo de verificación'
          },
          { status: 400 }
        );
      }
      
      const verificationType = kycVerification.verificationType.toLowerCase();
      if (verificationType !== 'silver' && verificationType !== 'gold') {
        return NextResponse.json(
          {
            success: false,
            message: 'El tipo de verificación no requiere sellado de tiempo'
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error(`Error al validar el token [${token}]:`, error);
      return NextResponse.json(
        {
          success: false,
          message: 'Error al validar el token de verificación'
        },
        { status: 400 }
      );
    }

    // Obtener el servicio de validación
    const validationService = container.get<ValidationService>(DI.ValidationService);

    // Solicitar el sello de tiempo
    let selloTiempoResult: SelloTiempoResult;
    try {
      console.log(`Solicitando sello de tiempo para hash: [${hash}]`);
      selloTiempoResult = await validationService.requestSelloTiempo(hash);
      console.log('Respuesta del servicio de sellado:', JSON.stringify(selloTiempoResult, null, 2));
    } catch (error) {
      console.error('Error al solicitar sello de tiempo:', error);
      
      // Verificar si debemos usar el modo de fallback para desarrollo/pruebas
      const useFallbackMode = process.env.NODE_ENV !== 'production' || process.env.USE_TIMESTAMP_FALLBACK === 'true';
      
      if (useFallbackMode) {
        console.log('Usando modo de fallback para sellado de tiempo (solo para desarrollo)');
        
        // Crear un resultado de prueba
        selloTiempoResult = {
          success: true,
          message: 'Sello de tiempo simulado para desarrollo',
          data: {
            sello: 'SIMULATED_TIMESTAMP_SEAL_FOR_DEVELOPMENT',
            fechaSello: new Date().toISOString(),
            digestion: hash
          }
        };
      } else {
        // En producción, devolver el error adecuado
        if (error instanceof ValidationServiceUnavailableError) {
          return NextResponse.json(
            {
              success: false,
              message: 'Servicio de sellado de tiempo no disponible temporalmente',
              details: error.message
            },
            { status: 503 }
          );
        }
        
        return NextResponse.json(
          {
            success: false,
            message: 'Error al solicitar sello de tiempo',
            details: error instanceof Error ? error.message : String(error)
          },
          { status: 500 }
        );
      }
    }

    // Verificar la respuesta del servicio
    if (!selloTiempoResult.success) {
      console.error('Error en el servicio de sellado de tiempo:', {
        message: selloTiempoResult.message,
        data: selloTiempoResult.data,
        error: selloTiempoResult.error,
        completo: JSON.stringify(selloTiempoResult)
      });
      
      return NextResponse.json(
        {
          success: false,
          message: 'Error en el servicio de sellado de tiempo' + (selloTiempoResult.message ? ': ' + selloTiempoResult.message : ''),
          error: selloTiempoResult.error
        },
        { status: 500 }
      );
    }

    // Devolver la respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Sello de tiempo obtenido correctamente',
      data: selloTiempoResult
    });
  } catch (error) {
    console.error('Error inesperado en el endpoint de sellado de tiempo:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
} 