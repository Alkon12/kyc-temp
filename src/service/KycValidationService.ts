import { injectable, inject } from 'inversify';
import { DI } from '@infrastructure';
import type ValidationService from '@domain/integration/ValidationService';
import type { LoggingService } from '@/application/service/LoggingService';
import { LoggingModule } from '@/application/service/LoggingService';
import { ValidationError } from '@domain/integration/ValidationError';

@injectable()
export class KycValidationService {
  constructor(
    @inject(DI.ValidationService) private validationService: ValidationService,
    @inject(DI.LoggingService) private logger: LoggingService
  ) {}

  /**
   * Validates an INE document using the nominal list
   * @param cic - CIC identifier
   * @param identificador - INE identifier
   */
  async validateINE(cic: string, identificador: string): Promise<boolean> {
    try {
      const result = await this.validationService.validateListaNominal(cic, identificador);
      
      if (!result.success) {
        this.logger.error(LoggingModule.GENERAL, 'INE validation failed', { cic, identificador, error: result.error });
        return false;
      }
      
      this.logger.info('INE validated successfully', { 
        cic, 
        identificador, 
        nombre: result.data?.nombre,
        curp: result.data?.curp
      });
      
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        this.logger.error(LoggingModule.GENERAL, 'INE validation error', { 
          cic, 
          identificador, 
          error: error.message,
          code: error.errorCode
        });
      } else {
        this.logger.error(LoggingModule.GENERAL, 'Unexpected error in INE validation', {
          cic,
          identificador,
          error: (error as Error).message
        });
      }
      
      return false;
    }
  }

  /**
   * Creates a timestamp seal for a document hash
   * @param documentHash - Base64 encoded hash of the document
   */
  async createTimestamp(documentHash: string): Promise<string | null> {
    try {
      const result = await this.validationService.requestSelloTiempo(documentHash);
      
      if (!result.success || !result.data?.sello) {
        this.logger.error(LoggingModule.GENERAL, 'Failed to create timestamp', { documentHash, error: result.error });
        return null;
      }
      
      this.logger.info('Timestamp created successfully', { 
        documentHash, 
        fechaSello: result.data.fechaSello
      });
      
      return result.data.sello;
    } catch (error) {
      if (error instanceof ValidationError) {
        this.logger.error(LoggingModule.GENERAL, 'Timestamp creation error', { 
          documentHash, 
          error: error.message,
          code: error.errorCode
        });
      } else {
        this.logger.error(LoggingModule.GENERAL, 'Unexpected error in timestamp creation', {
          documentHash,
          error: (error as Error).message
        });
      }
      
      return null;
    }
  }

  /**
   * Validates a CURP
   * @param curp - CURP to validate
   */
  async validateCURP(curp: string): Promise<boolean> {
    try {
      const result = await this.validationService.validateCurp(curp);
      
      if (!result.success) {
        this.logger.error(LoggingModule.GENERAL, 'CURP validation failed', { curp, error: result.error });
        return false;
      }
      
      this.logger.info('CURP validated successfully', { 
        curp, 
        nombre: result.data?.nombre,
        apellidoPaterno: result.data?.apellidoPaterno,
        apellidoMaterno: result.data?.apellidoMaterno
      });
      
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        this.logger.error(LoggingModule.GENERAL, 'CURP validation error', { 
          curp, 
          error: error.message,
          code: error.errorCode
        });
      } else {
        this.logger.error(LoggingModule.GENERAL, 'Unexpected error in CURP validation', {
          curp,
          error: (error as Error).message
        });
      }
      
      return false;
    }
  }
} 