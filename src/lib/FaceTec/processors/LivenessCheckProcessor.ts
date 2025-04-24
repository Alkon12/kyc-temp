import { Config } from "public/Config";
import container from '@infrastructure/inversify.config';
import { DI } from '@infrastructure';
import { FaceTecDocumentService } from '@service/FaceTecDocumentService';
import FacetecGraphQLAdapter from '../adapters/FacetecGraphQLAdapter';
import { SoapValidationService } from '@infrastructure/repositories/soap/SoapValidationService';
import * as crypto from 'crypto';

declare const FaceTecSDK: any;

//
// This is an example self-contained class to perform Liveness Checks with the FaceTec SDK.
// You may choose to further componentize parts of this in your own Apps based on your specific requirements.
//
class LivenessCheckProcessor {
  private cancelledDueToNetworkError: boolean;
  public latestNetworkRequest: XMLHttpRequest = new XMLHttpRequest();
  public latestSessionResult: any | null;
  private facetecGraphQLAdapter: FacetecGraphQLAdapter;

  // Agregar flag para controlar si ya se subió la selfie
  private selfieUploaded: boolean = false;
  
  // Servicio de validación para sellado de tiempo
  private soapValidationService: SoapValidationService | null = null;

  //
  // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
  //
  private success: boolean;
  private sampleAppControllerReference: any;
  private verificationToken: string = '';
  private faceTecDocumentService: FaceTecDocumentService | null = null;

  constructor(sessionToken: string, sampleAppControllerReference: any) {
    //
    // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
    // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
    //
    this.success = false;
    this.sampleAppControllerReference = sampleAppControllerReference;
    this.latestSessionResult = null;
    this.cancelledDueToNetworkError = false;
    this.facetecGraphQLAdapter = new FacetecGraphQLAdapter();
    
    // Obtener el token actual de la URL
    try {
      const url = new URL(window.location.href);
      this.verificationToken = url.searchParams.get('token') || '';
      
      // Obtener el servicio de documentos y validación del contenedor
      if (container) {
        try {
          this.faceTecDocumentService = container.get<FaceTecDocumentService>(DI.FaceTecDocumentService);
          this.soapValidationService = container.get<SoapValidationService>(DI.ValidationService);
        } catch (e) {
          console.error('Error al obtener servicios del contenedor:', e);
        }
      }
    } catch (e) {
      console.error('Error al obtener token:', e);
    }

    //
    // Part 1:  Starting the FaceTec Session
    //
    // Required parameters:
    // - FaceTecFaceScanProcessor:  A class that implements FaceTecFaceScanProcessor, which handles the FaceScan when the User completes a Session.  In this example, "this" implements the class.
    // - sessionToken:  A valid Session Token you just created by calling your API to get a Session Token from the Server SDK.
    //
    new FaceTecSDK.FaceTecSession(
      this,
      sessionToken
    );
  }

  /**
   * Genera un hash SHA256 para una imagen en formato base64
   * @param imageBase64 Imagen en formato base64
   * @returns Hash en formato base64
   */
  private generateImageHash(imageBase64: string): string {
    try {
      // Limpiar el prefijo de la imagen base64 si existe
      let cleanImage = imageBase64;
      if (cleanImage.includes('data:image')) {
        cleanImage = cleanImage.replace(/^data:image\/\w+;base64,/, '');
      }
      
      // Crear un buffer desde los datos base64
      const buffer = Buffer.from(cleanImage, 'base64');
      
      // Generar el hash SHA256
      const hash = crypto.createHash('sha256').update(buffer).digest('base64');
      
      console.log('Hash generado para la imagen:', hash);
      return hash;
    } catch (error) {
      console.error('Error al generar hash de la imagen:', error);
      return '';
    }
  }

  /**
   * Obtiene el sello de tiempo para una imagen
   * @param imageBase64 Imagen en formato base64
   * @returns Objeto con el hash y el sello de tiempo, o null si falla
   */
  private async getTimestampSeal(imageBase64: string): Promise<{hash: string, timestamp: any} | null> {
    try {
      // Generar el hash de la imagen
      const hash = this.generateImageHash(imageBase64);
      if (!hash) {
        console.error('No se pudo generar el hash de la imagen');
        return null;
      }
      
      console.log('Solicitando sello de tiempo para hash:', hash);
      
      // En lugar de usar directamente el servicio SOAP, usamos nuestro propio endpoint
      // que manejará la solicitud al servicio SOAP desde el backend
      try {
        const response = await fetch('/api/v1/timestamp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hash: hash,
            token: this.verificationToken
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error en la solicitud de sello de tiempo: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificar que los datos de respuesta sean correctos
        if (!data.success) {
          throw new Error(data.message || 'Error al obtener sello de tiempo');
        }
        
        console.log('Sello de tiempo obtenido correctamente');
        
        return {
          hash,
          timestamp: data.data
        };
      } catch (error) {
        console.error('Error al obtener sello de tiempo:', error);
        return null;
      }
    } catch (error) {
      console.error('Error general al procesar sello de tiempo:', error);
      return null;
    }
  }

  private async saveSelfie() {
    if (!this.verificationToken) {
      console.error('No se puede guardar la selfie: token inválido');
      return;
    }
    
    if (!this.latestSessionResult) {
      console.error('No hay resultados de escaneo para guardar');
      return;
    }
    
    // Evitar subidas duplicadas
    if (this.selfieUploaded) {
      console.log('La selfie ya fue subida previamente, omitiendo duplicado...');
      return;
    }
    
    try {
      // Extraer información de los resultados
      // Asegurarnos de que la imagen esté en formato base64 correcto con el prefijo data:image
      let selfieImage = this.latestSessionResult.auditTrail[0]; // Primera imagen del audit trail (selfie)
      
      // Si la imagen no tiene el prefijo data:image, añadirlo
      if (selfieImage && !selfieImage.startsWith('data:image')) {
        console.log('Añadiendo prefijo data:image/jpeg;base64, a la imagen selfie');
        selfieImage = `data:image/jpeg;base64,${selfieImage}`;
      }
      
      // Marcar como subida para evitar duplicados
      this.selfieUploaded = true;
      
      // Datos adicionales para análisis
      const faceTecData: {
        sessionId: any;
        status: any;
        faceScan: boolean;
        timestampHash?: string;
        timestampSeal?: any;
      } = {
        sessionId: this.latestSessionResult.sessionId,
        status: this.latestSessionResult.status,
        faceScan: this.latestSessionResult.faceScan ? true : false // Solo enviamos un flag, no el objeto completo
      };
      
      // Verificar si es una verificación Silver o Gold para aplicar sellado de tiempo
      const isHighLevelVerification = await this.isHighLevelVerification();
      
      // Si es verificación Silver o Gold, obtener sello de tiempo
      let timestampData = null;
      if (isHighLevelVerification) {
        console.log('Verificación Silver o Gold detectada, aplicando sellado de tiempo...');
        timestampData = await this.getTimestampSeal(selfieImage);
        
        // Si se obtuvo el sello de tiempo, agregarlo a los datos
        if (timestampData) {
          faceTecData.timestampHash = timestampData.hash;
          faceTecData.timestampSeal = timestampData.timestamp;
          console.log('Sello de tiempo aplicado correctamente');
        } else {
          console.warn('No se pudo obtener sello de tiempo, continuando sin él');
        }
      }
      
      console.log('Intentando guardar selfie con formato correcto en Paperless...');
      
      // Mantener una copia en localStorage como respaldo (pero no descargar automáticamente)
      this.saveImageThumbnail(selfieImage);
      
      // Usar la API para guardar en Paperless primero
      this.saveDocumentUsingAPI('SELFIE', selfieImage, faceTecData)
        .then((data) => {
          console.log('Selfie guardada correctamente en API/Paperless:', data);
          
          // Si se guardó en Paperless, no necesitamos guardar localmente
          if (data && data.data && data.data.filePath && data.data.filePath.includes('paperless')) {
            console.log('Imagen guardada exitosamente en Paperless:', data.data.filePath);
          } else {
            // Si no se guardó en Paperless, guardamos localmente como respaldo
            console.log('Guardando localmente como respaldo...');
            this.triggerDownload(selfieImage, 'selfie');
          }
        })
        .catch((error) => {
          console.error('Error al guardar selfie usando API:', error);
          // Restablecer el flag en caso de error para permitir reintento
          this.selfieUploaded = false;
          
          // Si falla la API, intentar usar el servicio directo como fallback
          if (this.faceTecDocumentService) {
            console.log('Intentando guardar con servicio directo...');
            // Crear un documento solo para la selfie
            this.faceTecDocumentService.saveDocumentImage(
              selfieImage,
              'SELFIE',
              this.verificationToken
            ).then((document) => {
              if (document) {
                console.log('Selfie guardada correctamente usando servicio directo');
                
                // Guardar datos adicionales
                this.faceTecDocumentService?.saveOcrData(
                  document.getId().toDTO(),
                  faceTecData
                ).then(() => {
                  console.log('Datos OCR guardados correctamente');
                }).catch((error) => {
                  console.error('Error al guardar datos OCR:', error);
                });
              } else {
                // Si falla el servicio directo, guardamos localmente
                console.log('No se pudo guardar con servicio directo, guardando localmente...');
                this.triggerDownload(selfieImage, 'selfie');
              }
            }).catch((error) => {
              console.error('Error al guardar la selfie usando servicio directo:', error);
              // Si falla el servicio directo, guardamos localmente
              this.triggerDownload(selfieImage, 'selfie');
            });
          } else {
            // Si no hay servicio, guardamos localmente
            console.log('No se pudo guardar con API ni servicio directo, guardando localmente...');
            this.triggerDownload(selfieImage, 'selfie');
          }
        });
    } catch (error) {
      console.error('Error al procesar y guardar la selfie:', error);
      // Restablecer el flag en caso de error para permitir reintento
      this.selfieUploaded = false;
      
      // En caso de error general, intentamos guardar localmente
      if (this.latestSessionResult && this.latestSessionResult.auditTrail[0]) {
        this.triggerDownload(this.latestSessionResult.auditTrail[0], 'selfie_backup');
      }
    }
  }

  /**
   * Guarda solo una miniatura en localStorage sin descargar la imagen completa
   */
  private saveImageThumbnail(imageBase64: string) {
    try {
      console.log('Guardando miniatura en localStorage...');
      
      // Crear un elemento de imagen para procesar
      const img = new Image();
      
      img.onload = () => {
        try {
          // Crear un canvas pequeño para la miniatura
          const smallCanvas = document.createElement('canvas');
          const smallCtx = smallCanvas.getContext('2d');
          smallCanvas.width = 100; // versión pequeña
          smallCanvas.height = 100 * (img.height / img.width);
          
          if (smallCtx) {
            smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
            const smallDataUrl = smallCanvas.toDataURL('image/jpeg', 0.5);
            
            // Guardar en localStorage (limitado en tamaño)
            const timestamp = new Date().getTime();
            localStorage.setItem('kyc_last_selfie_thumbnail', smallDataUrl);
            localStorage.setItem('kyc_last_selfie_time', timestamp.toString());
            console.log('Miniatura de selfie guardada en localStorage');
          }
        } catch (e) {
          console.error('Error al crear miniatura:', e);
        }
      };
      
      img.onerror = (e) => {
        console.error('Error al cargar la imagen para miniatura:', e);
      };
      
      // Establecer la fuente de la imagen
      img.src = imageBase64;
      
    } catch (error) {
      console.error('Error al guardar miniatura:', error);
    }
  }
  
  // Versión simplificada para descargar la imagen solo cuando sea necesario
  private triggerDownload(imageBase64: string, prefix: string) {
    try {
      console.log('Descargando imagen...');
      
      // Crear un nombre de archivo único con timestamp
      const timestamp = new Date().getTime();
      const filename = `${prefix}_${timestamp}.jpg`;
      
      // Limpiar la imagen base64 si es necesario
      let base64Data = imageBase64;
      if (base64Data.includes('data:image')) {
        base64Data = base64Data.replace(/^data:image\/\w+;base64,/, '');
      }
      
      // Crear un blob desde los datos base64
      const byteString = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      
      // Crear un enlace para descargar
      const a = document.createElement('a');
      a.download = filename;
      a.href = URL.createObjectURL(blob);
      
      // Disparar clic para descargar
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Liberar el objeto URL
      setTimeout(() => URL.revokeObjectURL(a.href), 100);
      
      console.log(`Imagen descargada como: ${filename}`);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
    }
  }
  
  private async saveDocumentUsingAPI(documentType: string, imageData: string, additionalData: any = null): Promise<any> {
    try {
      console.log(`Enviando solicitud a API para guardar ${documentType}...`);
      const response = await fetch('/api/v1/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType,
          imageData,
          token: this.verificationToken,
          additionalData: additionalData
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error al guardar ${documentType}: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al guardar ${documentType} usando API:`, error);
      throw error;
    }
  }

  //
  // Part 2:  Handling the Result of a FaceScan
  //
  public processSessionResultWhileFaceTecSDKWaits = (sessionResult: any, faceScanResultCallback: any): void => {
    // Save the current sessionResult
    this.latestSessionResult = sessionResult;

    //
    // Part 3:  Handles early exit scenarios where there is no FaceScan to handle -- i.e. User Cancellation, Timeouts, etc.
    //
    if (sessionResult.status !== FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
      this.latestNetworkRequest.abort();
      faceScanResultCallback.cancel();
      return;
    }

    // IMPORTANTE: Guardar la selfie tan pronto como tengamos un escaneo exitoso
    // Esto sucede después del escaneo pero antes de enviar los datos al servidor
    this.saveSelfie();

    // IMPORTANT:  FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully DOES NOT mean the Liveness Check was Successful.
    // It simply means the User completed the Session and a 3D FaceScan was created.  You still need to perform the Liveness Check on your Servers.

    //
    // Part 4:  Get essential data off the FaceTecSessionResult
    //
    var parameters = {
      faceScan: sessionResult.faceScan,
      auditTrailImage: sessionResult.auditTrail[0],
      lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
      sessionId: sessionResult.sessionId
    };

    //
    // Part 5:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
    //
    this.latestNetworkRequest = new XMLHttpRequest();
    this.latestNetworkRequest.open("POST", Config.BaseURL + "/liveness-3d");
    this.latestNetworkRequest.setRequestHeader("Content-Type", "application/json");

    this.latestNetworkRequest.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
    this.latestNetworkRequest.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(sessionResult.sessionId as string));

    this.latestNetworkRequest.onreadystatechange = (): void => {
      //
      // Part 6:  In our Sample, we evaluate a boolean response and treat true as was successfully processed and should proceed to next step,
      // and handle all other responses by cancelling out.
      // You may have different paradigms in your own API and are free to customize based on these.
      //

      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        try {
          const responseJSON = JSON.parse(this.latestNetworkRequest.responseText);
          const scanResultBlob = responseJSON.scanResultBlob;

          // Store the FaceTec result via GraphQL
          if (this.verificationToken) {
            this.facetecGraphQLAdapter.storeLivenessCheckResult(
              this.verificationToken,
              sessionResult,
              responseJSON
            ).catch(error => {
              console.error('Error storing liveness check result:', error);
            });
          }

          // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
          // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
          if (responseJSON.wasProcessed === true && responseJSON.error === false) {
            // Demonstrates dynamically setting the Success Screen Message.
            FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage("Face Scanned\n3D Liveness Proven");

            // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
            // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
            faceScanResultCallback.proceedToNextStep(scanResultBlob);
          }
          else {
            // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.
            if (responseJSON.error === true && responseJSON.errorMessage != null) {
              this.cancelDueToNetworkError(responseJSON.errorMessage, faceScanResultCallback);
            }
            else {
              this.cancelDueToNetworkError("Unexpected API response, cancelling out.", faceScanResultCallback);
            }
          }
        }
        catch (_e) {
          // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
          this.cancelDueToNetworkError("Exception while handling API response, cancelling out.", faceScanResultCallback);
        }
      }
    };

    this.latestNetworkRequest.onerror = (): void => {
      // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
      this.cancelDueToNetworkError("XHR error, cancelling.", faceScanResultCallback);
    };

    //
    // Part 7:  Demonstrates updating the Progress Bar based on the progress event.
    //
    this.latestNetworkRequest.upload.onprogress = (event: ProgressEvent): void => {
      var progress = event.loaded / event.total;
      faceScanResultCallback.uploadProgress(progress);
    };

    //
    // Part 8:  Actually send the request.
    //
    var jsonStringToUpload = JSON.stringify(parameters);
    this.latestNetworkRequest.send(jsonStringToUpload);

    //
    // Part 9:  For better UX, update the User if the upload is taking a while.  You are free to customize and enhance this behavior to your liking.
    //
    window.setTimeout(() => {
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        return;
      }

      faceScanResultCallback.uploadMessageOverride("Still Uploading...");
    }, 6000);
  };

  //
  // Part 10:  This function gets called after the FaceTec SDK is completely done.  There are no parameters because you have already been passed all data in the processSessionWhileFaceTecSDKWaits function and have already handled all of your own results.
  //
  public onFaceTecSDKCompletelyDone = (): void => {
    //
    // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after you signal the FaceTec SDK with success() or cancel().
    // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
    //
    this.success = this.latestSessionResult!.isCompletelyDone;

    // Log success message 
    // Ya no guardamos la selfie aquí, lo hacemos inmediatamente después del escaneo
    if (this.success) {
      console.log("Liveness Confirmed");
      
      // Ya no intentamos guardar la imagen aquí para evitar subidas duplicadas
      // La imagen ya fue guardada en this.processSessionResultWhileFaceTecSDKWaits()
    }

    this.sampleAppControllerReference.onComplete(this.latestSessionResult, null, this.latestNetworkRequest.status);
  };

  // Helper function to ensure the session is only cancelled once
  public cancelDueToNetworkError = (networkErrorMessage: string, faceScanResultCallback: any): void => {
    if (this.cancelledDueToNetworkError === false) {
      console.error(networkErrorMessage);
      this.cancelledDueToNetworkError = true;
      faceScanResultCallback.cancel();
    }
  };

  //
  // DEVELOPER NOTE:  This public convenience method is for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In your code, you may not even want or need to do this.
  //
  public isSuccess = (): boolean => {
    return this.success;
  };

  /**
   * Verifica si el token corresponde a una verificación Silver o Gold
   */
  private async isHighLevelVerification(): Promise<boolean> {
    try {
      if (!this.verificationToken) return false;
      
      // Consultar el tipo de verificación mediante GraphQL
      const verificationType = await this.facetecGraphQLAdapter.getVerificationType(this.verificationToken);
      
      if (!verificationType) return false;
      
      // Verificar si es Silver o Gold
      const type = verificationType.toLowerCase();
      return type === 'silver' || type === 'gold';
    } catch (error) {
      console.error('Error al determinar el nivel de verificación:', error);
      return false;
    }
  }
}

export default LivenessCheckProcessor;
