import ValidationService from '@domain/integration/ValidationService';
import { ListaNominalResult, SelloTiempoResult, ValidaCurpResult, CurpValidationResult } from '@domain/integration/ValidationTypes';
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
      
      console.log(`Realizando petición SOAP a ${this.baseUrl} para operación: ${command.oper}`);
      
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
        console.error(`Servicio SOAP devolvió estado no exitoso: ${response.status}`);
        throw new ValidationServiceUnavailableError(`Service returned status ${response.status}`);
      }

      // Parse the XML response to extract the JSON from the command response
      // This is a simplified implementation - in a real-world scenario, 
      // you'd want to use a proper XML parser
      try {
        const responseText = response.data;
        console.log('Respuesta XML recibida:', responseText.substring(0, 200) + '...');
        
        // Extract JSON from the XML response
        // This regex is a simplification and might need adjustment based on actual response format
        const jsonMatch = responseText.match(/<TodoResult>([\s\S]*?)<\/TodoResult>/);
        
        if (!jsonMatch || !jsonMatch[1]) {
          console.error('Formato de respuesta inválido, no se encontró TodoResult');
          throw new ValidationError('Invalid response format - TodoResult not found');
        }
        
        const jsonContent = jsonMatch[1].trim();
        console.log('Contenido JSON extraído:', jsonContent);
        
        try {
          const jsonResponse = JSON.parse(jsonContent);
          
          // Asegurarse de que la respuesta tenga la estructura esperada
          const result = {
            success: true,
            message: jsonResponse.descripcion || '',
            data: jsonResponse
          };
          
          // Si hay un error en la respuesta
          if (jsonResponse.error || 
              (jsonResponse.estado !== 0 && 
               command.oper !== 'ListaNominal')) { // Para ListaNominal, estado 3 significa éxito
            result.success = false;
            result.message = jsonResponse.error || jsonResponse.descripcion || 'Unknown error';
          }
          
          // Caso especial para ListaNominal donde estado 3 indica éxito (vigente)
          if (command.oper === 'ListaNominal' && jsonResponse.estado === 3) {
            result.success = true;
            result.message = jsonResponse.descripcion || 'INE vigente como medio de identificación';
          }
          
          console.log('Respuesta parseada:', JSON.stringify(result));
          return result as T;
        } catch (jsonError) {
          console.error('Error al parsear JSON:', jsonError);
          throw new ValidationError(`Failed to parse JSON: ${(jsonError as Error).message}`);
        }
      } catch (parseError) {
        console.error('Error al procesar la respuesta XML:', parseError);
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
        console.error('Error de Axios:', {
          message: axiosError.message,
          code: axiosError.code,
          hasResponse: !!axiosError.response,
          hasRequest: !!axiosError.request
        });
        
        if (axiosError.response) {
          throw new ValidationServiceUnavailableError(
            `Service returned status ${axiosError.response.status}: ${axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new ValidationServiceUnavailableError('No response received from validation service');
        }
      }
      
      console.error('Error inesperado en el servicio SOAP:', error);
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
  async validateCurp(curp: string): Promise<CurpValidationResult> {
    if (!curp) {
      throw new ValidationInvalidDataError('CURP is required for validation');
    }

    const command = {
      oper: 'ValidaCurp',
      ...this.credentials,
      referencia: 'Prueba',
      curp,
    };

    return this.makeRequest<CurpValidationResult>(command);
  }
}