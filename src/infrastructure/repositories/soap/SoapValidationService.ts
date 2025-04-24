import ValidationService from '@domain/integration/ValidationService';
import { ListaNominalResult, SelloTiempoResult, ValidaCurpResult } from '@domain/integration/ValidationTypes';
import { ValidationError, ValidationServiceUnavailableError, ValidationInvalidDataError } from '@domain/integration/ValidationError';
import axios, { AxiosError } from 'axios';
import { injectable } from 'inversify';

@injectable()
export class SoapValidationService implements ValidationService {
  private readonly baseUrl = 'https://validmobile.iqsec.mx/WSCommerceFielValidate2/WebService.asmx';
  private readonly contentType = 'text/xml';
  private readonly credentials = {
    entidad: 'fielnet',
    usuario: 'user_autofin',
    claveUsuario: 'AuTF1n2023.',
  };

  /**
   * Creates the SOAP envelope for a request
   */
  private createEnvelope(command: Record<string, any>): string {
    return `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
      <Body>
        <Todo xmlns="http://tempuri.org/">
          <command>
${JSON.stringify(command, null, 2)}
          </command>
        </Todo>
      </Body>
    </Envelope>`;
  }

  /**
   * Makes a SOAP request to the validation service
   */
  private async makeRequest<T>(command: Record<string, any>): Promise<T> {
    try {
      const envelope = this.createEnvelope(command);
      
      const response = await axios.post(
        this.baseUrl,
        envelope,
        {
          headers: {
            'Content-Type': this.contentType,
          },
        }
      );

      if (response.status !== 200) {
        throw new ValidationServiceUnavailableError(`Service returned status ${response.status}`);
      }

      // Parse the XML response to extract the JSON from the command response
      // This is a simplified implementation - in a real-world scenario, 
      // you'd want to use a proper XML parser
      try {
        const responseText = response.data;
        // Extract JSON from the XML response
        // This regex is a simplification and might need adjustment based on actual response format
        const jsonMatch = responseText.match(/<TodoResult>([\s\S]*?)<\/TodoResult>/);
        
        if (!jsonMatch || !jsonMatch[1]) {
          throw new ValidationError('Invalid response format');
        }
        
        const jsonResponse = JSON.parse(jsonMatch[1].trim());
        
        if (jsonResponse.error) {
          throw new ValidationError(jsonResponse.error);
        }
        
        return jsonResponse as T;
      } catch (parseError) {
        if (parseError instanceof ValidationError) {
          throw parseError;
        }
        throw new ValidationError(`Failed to parse response: ${(parseError as Error).message}`);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          throw new ValidationServiceUnavailableError(
            `Service returned status ${axiosError.response.status}: ${axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new ValidationServiceUnavailableError('No response received from validation service');
        }
      }
      
      throw new ValidationError(`Unexpected error: ${(error as Error).message}`);
    }
  }

  /**
   * Validates an INE ID against the nominal list
   */
  async validateListaNominal(cic: string, identificador: string): Promise<ListaNominalResult> {
    if (!cic || !identificador) {
      throw new ValidationInvalidDataError('CIC and identificador are required for lista nominal validation');
    }

    const command = {
      oper: 'ListaNominal',
      ...this.credentials,
      referencia: 'Lista Nominal INE Vigente',
      tipo: 'INE',
      cic,
      identificador,
    };

    return this.makeRequest<ListaNominalResult>(command);
  }

  /**
   * Requests a timestamp seal
   */
  async requestSelloTiempo(digestion: string): Promise<SelloTiempoResult> {
    if (!digestion) {
      throw new ValidationInvalidDataError('Digestion is required for sello de tiempo');
    }

    const command = {
      oper: 'SolicitaSello',
      ...this.credentials,
      referencia: 'TSAPrueba',
      digestion,
      tsa: 'tsa_des_psc',
    };

    return this.makeRequest<SelloTiempoResult>(command);
  }

  /**
   * Validates a CURP
   */
  async validateCurp(curp: string): Promise<ValidaCurpResult> {
    if (!curp) {
      throw new ValidationInvalidDataError('CURP is required for validation');
    }

    const command = {
      oper: 'ValidaCurp',
      ...this.credentials,
      referencia: 'Prueba',
      curp,
    };

    return this.makeRequest<ValidaCurpResult>(command);
  }
} 