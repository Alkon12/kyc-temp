import { ListaNominalResult, SelloTiempoResult, CurpValidationResult } from './ValidationTypes';

/**
 * Service interface for external validation services via SOAP
 */
export default interface ValidationService {
  /**
   * Validates an INE ID against the nominal list
   * @param cic - CIC identifier
   * @param identificador - INE identifier
   */
  validateListaNominal(cic: string, identificador: string): Promise<ListaNominalResult>;
  
  /**
   * Requests a timestamp seal
   * @param digestion - Hash digest to timestamp
   */
  requestSelloTiempo(digestion: string): Promise<SelloTiempoResult>;
  
  /**
   * Validates a CURP
   * @param curp - CURP string to validate
   */
  validateCurp(curp: string): Promise<CurpValidationResult>;
} 