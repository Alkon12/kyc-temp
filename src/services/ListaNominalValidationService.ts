import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';
import { ListaNominalResult } from '@/domain/integration/ValidationTypes';
import { FaceTecDataExtractor } from '@/domain/faceTec/FaceTecDataExtractor';

/**
 * Servicio centralizado para validar Lista Nominal
 * Este es el punto único para validación de Lista Nominal en la aplicación
 */
export class ListaNominalValidationService {
  /**
   * Valida una identificación INE a través del servicio RENAPO
   * @param mrzLine1 Línea MRZ del documento INE
   * @param token Token de autenticación
   * @param personalData Datos personales opcionales para contexto
   * @returns Resultado de la validación
   */
  static async validateListaNominal(
    mrzLine1: string | undefined | null,
    token: string | undefined | null,
    personalData: PersonalData | null = null
  ): Promise<ListaNominalResult> {
    if (!mrzLine1) {
      return {
        success: false,
        message: 'MRZ no proporcionada para validación'
      };
    }
    
    try {
      // Extraer CIC e Identificador del MRZ
      const { cic, identificador } = FaceTecDataExtractor.extractCicAndIdentificador(mrzLine1);
      
      if (!cic || !identificador) {
        return {
          success: false,
          message: 'No se pudo extraer CIC o Identificador del MRZ'
        };
      }
      
      console.log('Enviando solicitud de validación Lista Nominal al servicio RENAPO...');
      
      const response = await fetch('/api/v1/lista-nominal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cic,
          identificador,
          token
        }),
      });
      
      const jsonResponse = await response.json();
      console.log('Resultado de validación Lista Nominal:', jsonResponse);
      
      // Ajustar el éxito basado en el valor de estado
      // Estado 3 significa "vigente" para Lista Nominal y debe considerarse como éxito
      let isSuccess = jsonResponse.success;
      if (!isSuccess && jsonResponse.data?.data?.estado === 3) {
        isSuccess = true;
        console.log('Ajustando resultado a success=true porque estado=3 indica INE vigente');
      }
      
      return {
        success: isSuccess,
        message: jsonResponse.message || 'Validación Lista Nominal completada',
        data: jsonResponse.data?.data,
        error: jsonResponse.error
      };
    } catch (error) {
      console.error('Error al validar Lista Nominal:', error);
      
      return {
        success: false,
        message: 'Error de conexión al validar Lista Nominal',
        error: String(error)
      };
    }
  }
  
  /**
   * Extrae CIC e Identificador de un MRZ
   * Utilidad para componentes que necesitan estos valores directamente
   */
  static extractCicAndIdentificador(mrzLine1: string | null): { cic: string | null; identificador: string | null } {
    return FaceTecDataExtractor.extractCicAndIdentificador(mrzLine1);
  }
} 