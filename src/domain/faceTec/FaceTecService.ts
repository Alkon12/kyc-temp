export interface FaceTecSessionResult {
  matchLevel: number
  livenessScore: number
  confidenceScore: number
  faceScanSecurityLevel: string
  auditTrailImage?: string
  lowQualityAuditTrailImage?: string
  fullResponse: any
}

export interface FaceTecService {
  createSession(verificationId: string): Promise<{ sessionId: string }>
  processResults(sessionId: string, data: any): Promise<FaceTecSessionResult>
  getSessionStatus(sessionId: string): Promise<string>
}
