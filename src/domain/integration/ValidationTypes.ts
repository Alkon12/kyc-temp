/**
 * Result interface for Lista Nominal validation
 */
export interface ListaNominalResult {
  success: boolean;
  message: string;
  data?: {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    vigencia?: string;
    claveElector?: string;
    curp?: string;
    // Add other potential fields from the response
  };
  error?: string;
}

/**
 * Result interface for Sello de Tiempo
 */
export interface SelloTiempoResult {
  success: boolean;
  message: string;
  data?: {
    sello?: string;
    fechaSello?: string;
    digestion?: string;
    // Add other potential fields from the response
  };
  error?: string;
}

/**
 * Result interface for CURP validation
 * Esta es la interfaz estándar para resultados de validación CURP en todo el proyecto
 */
export interface CurpValidationResult {
  success: boolean;
  message: string;
  data?: {
    curp?: string;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    sexo?: string;
    fechaNacimiento?: string;
    entidadNacimiento?: string;
    [key: string]: any;  // Para campos adicionales
  };
  error?: any;
}

// Alias para mantener compatibilidad con código existente
export type ValidaCurpResult = CurpValidationResult; 