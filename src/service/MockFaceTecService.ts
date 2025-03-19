import { injectable } from 'inversify'
import { FaceTecService, FaceTecSessionResult } from '@domain/faceTec/FaceTecService'

@injectable()
export class MockFaceTecService implements FaceTecService {
  async createSession(verificationId: string): Promise<{ sessionId: string }> {
    // Simular un retraso para emular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return { 
      sessionId: `mock-session-${verificationId}-${Date.now()}` 
    }
  }

  async processResults(sessionId: string, data: any): Promise<FaceTecSessionResult> {
    // Simular un retraso para emular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 200))
    
    console.log("Datos recibidos en MockFaceTecService:", data);
    
    // Usar los puntajes enviados desde la interfaz si están disponibles
    const matchLevel = data.matchScore || 70 + Math.random() * 30;
    const livenessScore = data.livenessScore || 70 + Math.random() * 30;
    const confidenceScore = data.confidenceScore || 70 + Math.random() * 30;
    
    return {
      matchLevel,
      livenessScore,
      confidenceScore,
      faceScanSecurityLevel: 'high',
      auditTrailImage: 'data:image/jpeg;base64,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',
      lowQualityAuditTrailImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAwADADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAQL/xAAnEAACAQMDAwMFAAAAAAAAAAABAgMABBEFEiEGMUETUZEHFCIyYf/EABcBAAMBAAAAAAAAAAAAAAAAAAIDBAX/xAAeEQACAgIDAQEAAAAAAAAAAAAAAQIRAyEEEjETQf/aAAwDAQACEQMRAD8A+iaK01G6FjYzXJGRGnA9z2H71J61mMWnJPn8YHEj+y55/nFebnnWNsqxxuTpCuv9TxaYpiii9e6IyFJwqfJrlbvX9Z1stOzlI884wAPgUhBZz3V1vXOXOXdjkk+9O006CNzNKneolnTdLouWJVSZHwRzglnYs3tk1SWVnPIvqwwswQZJ8VUQadbXABCYNP7a0jgiyFAOOK7jFb0Ik/wh2Oh3d1CJzIkKsMgMOaCafxQVaE/TMdIQgkHII5rgvrJrc2fTyInPr3aD7YfsTjL/AAOfmkmi6xcWwaOJyAV2lff3zWT9UXo1HVLONiGS3t/UkA8Fmb/OD8VzmWDeSvoujF/TvoSpG0tyysAE7BieBS7UPWnQbQm46VmPSDKUkf8A7kAP4PwR+tQWt6kbK1RsnKRhAB7CtLO4juAqpgEdqqUY9dsmuzm72e81DTYQQFyCfwP40UG1XYoDjjFFdaK0f//Z',
      fullResponse: { /* Datos completos de la respuesta */ }
    }
  }

  async getSessionStatus(sessionId: string): Promise<string> {
    // Simular un retraso para emular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 50))
    
    return 'completed'
  }
}
