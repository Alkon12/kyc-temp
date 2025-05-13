import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';

/**
 * Tipos para la validación Fuzzy
 */
export interface FuzzyMatchCandidate {
  id: number | string;
  text: string;
  score: number;
}

export interface FuzzyMatchResult {
  success: boolean;
  message?: string;
  data?: FuzzyMatchCandidate[];
  error?: any;
  bestMatch?: FuzzyMatchCandidate;
  threshold?: number;
}

/**
 * Servicio centralizado para validación fuzzy de nombres
 * Este es el punto único para validación fuzzy en la aplicación
 */
export class FuzzyMatchService {
  /**
   * Validar nombre usando coincidencia difusa (fuzzy)
   * @param baseName Nombre base para comparar (generalmente del formulario/ui)
   * @param candidates Nombres candidatos para comparar (del documento y/o validaciones)
   * @param token Token de autenticación
   * @param threshold Umbral mínimo para considerar válida una coincidencia (0-1, por defecto 0.7)
   * @returns Resultado de la validación
   */
  static async validateFuzzyMatch(
    baseName: string | undefined | null,
    candidates: string[] | undefined | null,
    token: string | undefined | null,
    threshold: number = 0.7
  ): Promise<FuzzyMatchResult> {
    if (!baseName || !candidates || candidates.length === 0) {
      return {
        success: false,
        message: 'Datos insuficientes para validación fuzzy',
        threshold
      };
    }
    
    try {
      console.log('Enviando solicitud de validación fuzzy...', {
        base: baseName,
        candidatesCount: candidates.length
      });
      
      // Preparar candidatos en el formato esperado por la API
      const candidatesFormatted = candidates.map((text, index) => ({
        id: index + 1,
        text
      }));
      
      const response = await fetch('/api/v1/fuzzy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base: baseName,
          candidates: candidatesFormatted
        }),
      });
      
      const jsonResponse = await response.json() as FuzzyMatchCandidate[];
      console.log('Resultado de validación fuzzy:', jsonResponse);
      
      // Verificar si hay coincidencias por encima del umbral
      const bestMatch = jsonResponse.length > 0 ? jsonResponse[0] : undefined;
      const success = bestMatch ? bestMatch.score >= threshold : false;
      
      return {
        success,
        message: success 
          ? 'Validación fuzzy exitosa' 
          : 'No se encontraron coincidencias suficientes',
        data: jsonResponse,
        bestMatch,
        threshold
      };
    } catch (error) {
      console.error('Error al realizar validación fuzzy:', error);
      
      return {
        success: false,
        message: 'Error de conexión al validar coincidencia fuzzy',
        error,
        threshold
      };
    }
  }
  
  /**
   * Extraer nombres a validar de los datos personales
   * @param personalData Datos personales extraídos del documento
   * @param queryName Nombre de la consulta/token para comparar
   * @param curpName Nombre de la validación CURP (opcional)
   * @returns Arreglo de candidatos para validación
   */
  static extractNamesForFuzzyValidation(
    personalData: PersonalData | null,
    queryName: string | null,
    curpName: string | null = null
  ): string[] {
    const candidates: string[] = [];
    
    // Añadir nombre desde datos personales si existe
    if (personalData) {
      const personalDataName = `${personalData.firstName || ''} ${personalData.lastName || ''}`.trim();
      if (personalDataName) {
        candidates.push(personalDataName);
      }
    }
    
    // Añadir nombre desde la query si existe y no está ya en la lista
    if (queryName && !candidates.includes(queryName)) {
      candidates.push(queryName);
    }
    
    // Añadir nombre desde la validación CURP si existe y no está ya en la lista
    if (curpName && !candidates.includes(curpName)) {
      candidates.push(curpName);
    }
    
    return candidates;
  }
}

export default FuzzyMatchService; 