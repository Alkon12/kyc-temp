import { Config } from "public/Config";
import container from '@infrastructure/inversify.config';
import { DI } from '@infrastructure';
import { FaceTecDocumentService } from '@service/FaceTecDocumentService';
import FacetecGraphQLAdapter from '../adapters/FacetecGraphQLAdapter';
import { SoapValidationService } from '@infrastructure/repositories/soap/SoapValidationService';
import * as crypto from 'crypto';

declare const FaceTecSDK: any;

/**
 * Genera un UUID v4 de manera compatible con todos los navegadores
 * Alternativa a crypto.randomUUID() que no está disponible en todos los entornos
 */
function generateUUID(): string {
  // Si la API randomUUID está disponible, usarla directamente
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Implementación de respaldo utilizando getRandomValues que tiene mejor soporte
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => {
      const n = Number(c);
      return (n ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> n / 4).toString(16);
    });
  }
  
  // Última alternativa usando Math.random (menos segura pero es un fallback)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//
// This is an example self-contained class to perform Photo ID Scans with the FaceTec SDK.
// You may choose to further componentize parts of this in your own Apps based on your specific requirements.
//
class PhotoIDMatchProcessor {
  private cancelledDueToNetworkError: boolean;
  public latestNetworkRequest: XMLHttpRequest = new XMLHttpRequest();
  public latestSessionResult: any | null;
  public latestIDScanResult: any | null;
  private facetecGraphQLAdapter: FacetecGraphQLAdapter;

  // Agregar flags para controlar si ya se subieron las imágenes
  private frontImageUploaded: boolean = false;
  private backImageUploaded: boolean = false;
  private selfieUploaded: boolean = false;
  
  // Servicio de validación para sellado de tiempo
  private soapValidationService: SoapValidationService | null = null;

  //
  // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
  //
  public success: boolean;
  public sampleAppControllerReference: any;
  public externalDatabaseRefID: string;
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
    this.latestIDScanResult = null;
    this.cancelledDueToNetworkError = false;
    this.externalDatabaseRefID = generateUUID();
    this.facetecGraphQLAdapter = new FacetecGraphQLAdapter();
    
    // Obtener el token actual de la URL
    try {
      const url = new URL(window.location.href);
      this.verificationToken = url.searchParams.get('token') || '';
      
      // Obtener el servicio de documentos y de validación del contenedor
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

    // In v9.2.2+, configure the messages that will be displayed to the User in each of the possible cases.
    // Based on the internal processing and decision logic about how the flow gets advanced, the FaceTec SDK will use the appropriate, configured message.
    FaceTecSDK.FaceTecCustomization.setIDScanUploadMessageOverrides(
      "Subiendo<br/>Documento<br/>Cifrado", // Comienza la subida del frente del documento
      "Sigue Subiendo...<br/>Conexión Lenta", // La subida del frente del documento sigue en proceso después de un tiempo extendido
      "Subida Completada", // La subida del frente del documento al servidor está completa
      "Procesando<br/>Documento", // La subida del frente del documento está completa y estamos esperando que el servidor termine de procesar y responda
      "Subiendo<br/>Reverso<br/>Cifrado", // Comienza la subida del reverso del documento
      "Sigue Subiendo...<br/>Conexión Lenta", // La subida del reverso del documento sigue en proceso después de un tiempo extendido
      "Subida Completada", // La subida del reverso del documento al servidor está completa
      "Procesando<br/>Reverso", // La subida del reverso del documento está completa y estamos esperando que el servidor termine de procesar y responda
      "Subiendo<br/>Información Confirmada", // Comienza la subida de la información confirmada por el usuario
      "Sigue Subiendo...<br/>Conexión Lenta", // La subida de la información confirmada sigue en proceso después de un tiempo extendido
      "Información Guardada", // La subida de la información confirmada al servidor está completa
      "Procesando" // La subida de la información confirmada está completa y estamos esperando que el servidor termine de procesar y responda
    );

    //
    // Part 1:  Starting the FaceTec Session
    //
    // Required parameters:
    // - FaceTecIDScanProcessor:  A class that implements FaceTecIDScanProcessor, which handles the IDScan when the User completes an ID Scan.  In this example, "this" implements the class.
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

  private async saveDocumentUsingAPI(documentType: string, imageData: string, additionalData: any = null): Promise<any> {
    try {
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

  // Guardar la imagen de la selfie inmediatamente después del escáner facial
  private async saveSelfie() {
    if (!this.verificationToken || !this.latestSessionResult || this.selfieUploaded) {
      return;
    }
    
    try {
      // Extraer la selfie del resultado del escaneo facial
      let selfieImage = this.latestSessionResult.auditTrail[0];
      
      // Si la imagen no tiene el prefijo data:image, añadirlo
      if (selfieImage && !selfieImage.startsWith('data:image')) {
        console.log('Añadiendo prefijo data:image/jpeg;base64, a la imagen selfie');
        selfieImage = `data:image/jpeg;base64,${selfieImage}`;
      }
      
      // Marcar como subida para evitar duplicados
      this.selfieUploaded = true;
      
      // Datos adicionales para análisis
      const faceTecData: any = {
        sessionId: this.latestSessionResult.sessionId,
        status: this.latestSessionResult.status,
        faceScan: this.latestSessionResult.faceScan ? true : false // Solo enviamos un flag, no el objeto completo
      };
      
      // Verificar si es una verificación Silver o Gold para aplicar sellado de tiempo
      const isHighLevelVerification = await this.isHighLevelVerification();
      
      // Si es verificación Silver o Gold, obtener sello de tiempo
      let timestampData = null;
      if (isHighLevelVerification) {
        console.log('Verificación Silver o Gold detectada, aplicando sellado de tiempo a selfie...');
        timestampData = await this.getTimestampSeal(selfieImage);
        
        // Si se obtuvo el sello de tiempo, agregarlo a los datos
        if (timestampData) {
          faceTecData.timestampHash = timestampData.hash;
          faceTecData.timestampSeal = timestampData.timestamp;
          console.log('Sello de tiempo aplicado correctamente a selfie');
        } else {
          console.warn('No se pudo obtener sello de tiempo para selfie, continuando sin él');
        }
      }
      
      // Guardar la selfie usando la API
      console.log("Guardando selfie inmediatamente después del escaneo facial...");
      this.saveDocumentUsingAPI('SELFIE', selfieImage, faceTecData)
        .then((data) => {
          console.log('Selfie guardada correctamente después del escaneo facial:', data);
        })
        .catch((error) => {
          console.error('Error al guardar selfie después del escaneo facial:', error);
          // Si falla, permitir otro intento
          this.selfieUploaded = false;
        });
    } catch (error) {
      console.error('Error al procesar la selfie después del escaneo facial:', error);
      // Si falla, permitir otro intento
      this.selfieUploaded = false;
    }
  }
  
  // Guardar las imágenes de la identificación inmediatamente después del escaneo del ID
  private async saveIDImages() {
    if (!this.verificationToken || !this.latestIDScanResult) {
      return;
    }
    
    try {
      // Verificar si es una verificación Silver o Gold para aplicar sellado de tiempo
      const isHighLevelVerification = await this.isHighLevelVerification();
      
      // Extraer imágenes del ID escaneado
      if (this.latestIDScanResult.frontImages && 
          this.latestIDScanResult.frontImages.length > 0 && 
          !this.frontImageUploaded) {
          
        let idFrontImage = this.latestIDScanResult.frontImages[0];
        
        // Si la imagen no tiene el prefijo data:image, añadirlo
        if (idFrontImage && !idFrontImage.startsWith('data:image')) {
          idFrontImage = `data:image/jpeg;base64,${idFrontImage}`;
        }
        
        // Marcar como subida para evitar duplicados
        this.frontImageUploaded = true;
        
        // Datos adicionales para el documento frontal
        const frontDocData: any = {
          scanSessionId: this.latestIDScanResult.sessionId
        };
        
        // Si es verificación Silver o Gold, obtener sello de tiempo
        if (isHighLevelVerification) {
          console.log('Aplicando sellado de tiempo a frente de ID...');
          const timestampData = await this.getTimestampSeal(idFrontImage);
          
          // Si se obtuvo el sello de tiempo, agregarlo a los datos
          if (timestampData) {
            frontDocData.timestampHash = timestampData.hash;
            frontDocData.timestampSeal = timestampData.timestamp;
            console.log('Sello de tiempo aplicado correctamente a frente de ID');
          } else {
            console.warn('No se pudo obtener sello de tiempo para frente de ID, continuando sin él');
          }
        }
        
        // Guardar imagen frontal del ID
        console.log("Guardando frente del ID inmediatamente después del escaneo...");
        this.saveDocumentUsingAPI('ID_FRONT', idFrontImage, frontDocData)
          .then((data) => {
            console.log('Frente del ID guardado correctamente:', data);
          })
          .catch((error) => {
            console.error('Error al guardar frente del ID:', error);
            // Si falla, permitir otro intento
            this.frontImageUploaded = false;
          });
      }
      
      // Si hay imagen trasera, guardarla también
      if (this.latestIDScanResult.backImages && 
          this.latestIDScanResult.backImages.length > 0 && 
          !this.backImageUploaded) {
          
        let idBackImage = this.latestIDScanResult.backImages[0];
        
        // Si la imagen no tiene el prefijo data:image, añadirlo
        if (idBackImage && !idBackImage.startsWith('data:image')) {
          idBackImage = `data:image/jpeg;base64,${idBackImage}`;
        }
        
        // Marcar como subida para evitar duplicados
        this.backImageUploaded = true;
        
        // Datos adicionales para el documento trasero
        const backDocData: any = {
          scanSessionId: this.latestIDScanResult.sessionId
        };
        
        // Si es verificación Silver o Gold, obtener sello de tiempo
        if (isHighLevelVerification) {
          console.log('Aplicando sellado de tiempo a reverso de ID...');
          const timestampData = await this.getTimestampSeal(idBackImage);
          
          // Si se obtuvo el sello de tiempo, agregarlo a los datos
          if (timestampData) {
            backDocData.timestampHash = timestampData.hash;
            backDocData.timestampSeal = timestampData.timestamp;
            console.log('Sello de tiempo aplicado correctamente a reverso de ID');
          } else {
            console.warn('No se pudo obtener sello de tiempo para reverso de ID, continuando sin él');
          }
        }
        
        // Guardar imagen trasera del ID
        console.log("Guardando reverso del ID inmediatamente después del escaneo...");
        this.saveDocumentUsingAPI('ID_BACK', idBackImage, backDocData)
          .then((data) => {
            console.log('Reverso del ID guardado correctamente:', data);
          })
          .catch((error) => {
            console.error('Error al guardar reverso del ID:', error);
            // Si falla, permitir otro intento
            this.backImageUploaded = false;
          });
      }
    } catch (error) {
      console.error('Error al procesar imágenes del ID después del escaneo:', error);
      // Si falla completamente, permitir otro intento para ambas imágenes
      this.frontImageUploaded = false;
      this.backImageUploaded = false;
    }
  }

  //
  // Part 2:  Handling the Result of a FaceScan - First part of the Photo ID Scan
  //
  public processSessionResultWhileFaceTecSDKWaits = (sessionResult: any, faceScanResultCallback: any): void => {
    this.latestSessionResult = sessionResult;

    //
    // Part 3:  Handles early exit scenarios where there is no FaceScan to handle -- i.e. User Cancellation, Timeouts, etc.
    //
    if (sessionResult.status !== FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
      this.latestNetworkRequest.abort();
      faceScanResultCallback.cancel();
      return;
    }

    // IMPORTANTE: Guardar la selfie inmediatamente después del escaneo facial exitoso
    this.saveSelfie();

    // IMPORTANT:  FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully DOES NOT mean the Enrollment was Successful.
    // It simply means the User completed the Session and a 3D FaceScan was created.  You still need to perform the Enrollment on your Servers.

    //
    // Part 4:  Get essential data off the FaceTecSessionResult
    //
    var parameters = {
      faceScan: sessionResult.faceScan,
      auditTrailImage: sessionResult.auditTrail[0],
      lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
      sessionId: sessionResult.sessionId,
      externalDatabaseRefID: this.externalDatabaseRefID
    };

    //
    // Part 5:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
    //
    this.latestNetworkRequest = new XMLHttpRequest();
    this.latestNetworkRequest.open("POST", Config.BaseURL + "/enrollment-3d");
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

          // Store the enrollment result via GraphQL
          if (this.verificationToken) {
            this.facetecGraphQLAdapter.storeEnrollmentResult(
              this.verificationToken,
              sessionResult,
              responseJSON
            ).catch(error => {
              console.error('Error storing enrollment result:', error);
            });
          }

          // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
          // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
          if (responseJSON.wasProcessed === true && responseJSON.error === false) {
            // Demonstrates dynamically setting the Success Screen Message.
            FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage("Rostro Escaneado\nLiveness 3D Verificado");

            // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
            // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
            faceScanResultCallback.proceedToNextStep(scanResultBlob);
          }
          else {
            // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.
            this.cancelDueToNetworkError("Unexpected API response, cancelling out.", faceScanResultCallback);
          }
        }
        catch {
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
  // Part 10:  Handling the Result of a IDScan
  //
  public processIDScanResultWhileFaceTecSDKWaits = (idScanResult: any, idScanResultCallback: any): void => {
    this.latestIDScanResult = idScanResult;

    //
    // Part 11:  Handles early exit scenarios where there is no IDScan to handle -- i.e. User Cancellation, Timeouts, etc.
    //
    if (idScanResult.status !== FaceTecSDK.FaceTecIDScanStatus.Success) {
      this.latestNetworkRequest.abort();
      this.latestNetworkRequest = new XMLHttpRequest();
      idScanResultCallback.cancel();
      return;
    }

    // IMPORTANTE: Guardar las imágenes del ID inmediatamente después del escaneo exitoso
    this.saveIDImages();

    // IMPORTANT:  FaceTecSDK.FaceTecIDScanStatus.Success DOES NOT mean the IDScan was Successful.
    // It simply means the User completed the Session and a 3D IDScan was created.  You still need to perform the ID-Check on your Servers.

    // minMatchLevel allows Developers to specify a Match Level that they would like to target in order for success to be true in the response.
    // minMatchLevel cannot be set to 0.
    // minMatchLevel setting does not affect underlying Algorithm behavior.
    const MinMatchLevel = 3;

    //
    // Part 12:  Get essential data off the FaceTecIDScanResult
    //
    var parameters: any = {
      idScan: idScanResult.idScan,
      sessionId: idScanResult.sessionId,
      externalDatabaseRefID: this.externalDatabaseRefID,
      minMatchLevel: MinMatchLevel
    };

    //
    // Sending up front and back images are non-essential, but are useful for auditing purposes, and are required in order for the FaceTec Server Dashboard to render properly.
    //
    if (idScanResult.frontImages && idScanResult.frontImages[0]) {
      parameters.frontImages = idScanResult.frontImages;
    }

    if (idScanResult.backImages && idScanResult.backImages[0]) {
      parameters.backImages = idScanResult.backImages;
    }

    //
    // Part 13:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
    //
    this.latestNetworkRequest = new XMLHttpRequest();
    this.latestNetworkRequest.open("POST", Config.BaseURL + "/match-3d-2d-idscan");
    this.latestNetworkRequest.setRequestHeader("Content-Type", "application/json");

    this.latestNetworkRequest.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
    this.latestNetworkRequest.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(idScanResult.sessionId as string));

    this.latestNetworkRequest.onreadystatechange = (): void => {
      //
      // Part 14:  In our Sample, we evaluate a boolean response and treat true as was successfully processed and should proceed to next step,
      // and handle all other responses by cancelling out.
      // You may have different paradigms in your own API and are free to customize based on these.
      //

      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        try {
          const responseJSON = JSON.parse(this.latestNetworkRequest.responseText);
          const scanResultBlob = responseJSON.scanResultBlob;

          // Store the ID scan match result via GraphQL
          if (this.verificationToken) {
            this.facetecGraphQLAdapter.storeIDScanMatchResult(
              this.verificationToken,
              this.latestSessionResult,
              idScanResult,
              responseJSON
            ).catch(error => {
              console.error('Error storing ID scan match result:', error);
            });
          }

          // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
          // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
          if (responseJSON.wasProcessed === true && responseJSON.error === false) {

            // Dynamically set the success message based on whether la verificación fue exitosa o no
              const successMessage = responseJSON.isMatch
                ? "Your 3D Face<br/>Matched Your ID"
                : "Your 3D Face<br/>Did Not Match Your ID";

            FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage(successMessage);

            // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
            // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
            idScanResultCallback.proceedToNextStep(scanResultBlob);
          }
          else {
            // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.
            console.log("Unexpected API response, cancelling out.");
            idScanResultCallback.cancel();
          }
        }
        catch {
          // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
          console.log("Exception while handling API response, cancelling out.");
          idScanResultCallback.cancel();
        }
      }
    };

    this.latestNetworkRequest.onerror = (): void => {
      // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
      console.log("XHR error, cancelling.");
      idScanResultCallback.cancel();
    };

    //
    // Part 15:  Demonstrates updating the Progress Bar based on the progress event.
    //
    this.latestNetworkRequest.upload.onprogress = (event: ProgressEvent): void => {
      var progress = event.loaded / event.total;
      idScanResultCallback.uploadProgress(progress);
    };

    //
    // Part 16:  Actually send the request.
    //
    var jsonStringToUpload = JSON.stringify(parameters);
    this.latestNetworkRequest.send(jsonStringToUpload);

    //
    // Part 17:  For better UX, update the User if the upload is taking a while.  You are free to customize and enhance this behavior to your liking.
    //
    window.setTimeout(() => {
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        return;
      }

      idScanResultCallback.uploadMessageOverride("Still Uploading...");
    }, 6000);
  };

  //
  // Part 18:  This function gets called after the FaceTec SDK is completely done.  There are no parameters because you have already been passed all data in the processSessionWhileFaceTecSDKWaits function and have already handled all of your own results.
  //
  public onFaceTecSDKCompletelyDone = (): void => {
    //
    // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after you signal the FaceTec SDK with success() or cancel().
    // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
    //
    this.success = this.latestIDScanResult!.isCompletelyDone;
    
    // Ya no necesitamos guardar aquí, lo hacemos justo después de cada escaneo exitoso
    if (this.success) {
      console.log("ID Match Process Completed Successfully");
    }

    this.sampleAppControllerReference.onComplete(
      this.latestSessionResult,
      this.latestIDScanResult,
      this.latestNetworkRequest.status
    );
  };

  // Helper function to ensure the session is only cancelled once
  public cancelDueToNetworkError = (networkErrorMessage: string, faceTecScanResultCallback: any): void => {
    if (this.cancelledDueToNetworkError === false) {
      console.log(networkErrorMessage);
      this.cancelledDueToNetworkError = true;
      faceTecScanResultCallback.cancel();
    }
  };

  //
  // DEVELOPER NOTE:  This public convenience method is for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In your code, you may not even want or need to do this.
  //
  public isSuccess = (): boolean => {
    return this.success;
  };
}

export default PhotoIDMatchProcessor;
