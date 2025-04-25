import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';
import { CurpValidationResult } from '@/domain/integration/ValidationTypes';

/**
 * Servicio centralizado para validar CURP
 * Este es el punto único para validación de CURP en la aplicación
 */
export class CurpValidationService {
  /**
   * Valida una CURP a través del servicio RENAPO
   * @param curp CURP a validar
   * @param token Token de autenticación
   * @param personalData Datos personales opcionales para contexto
   * @returns Resultado de la validación
   */
  static async validateCurp(
    curp: string | undefined | null,
    token: string | undefined | null,
    personalData: PersonalData | null = null
  ): Promise<CurpValidationResult> {
    if (!curp) {
      return {
        success: false,
        message: 'CURP no proporcionada para validación'
      };
    }
    
    try {
      console.log('Enviando solicitud de validación CURP al servicio RENAPO...');
      
      const response = await fetch('/api/v1/curp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          curp: curp,
          token: token
        }),
      });
      
      const jsonResponse = await response.json();
      console.log('Resultado de validación CURP:', jsonResponse);
      
      return {
        success: jsonResponse.success,
        message: jsonResponse.message || 'Validación CURP completada',
        data: jsonResponse.data?.data,
        error: jsonResponse.error
      };
    } catch (error) {
      console.error('Error al validar CURP:', error);
      
      return {
        success: false,
        message: 'Error de conexión al validar CURP',
        error: error
      };
    }
  }
} 