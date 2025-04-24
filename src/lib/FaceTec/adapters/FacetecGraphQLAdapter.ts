import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

/**
 * Adapter to store FaceTec results via GraphQL mutations
 */
export class FacetecGraphQLAdapter {
  private client: ApolloClient<any>
  private resultCache: Map<string, string> = new Map(); // Cache to track verification results by verification ID
  
  constructor() {
    // Create a new Apollo Client instance
    this.client = new ApolloClient({
      uri: '/api/graphql',
      cache: new InMemoryCache(),
    })
  }

  /**
   * Gets the verification ID from a token by querying the verification link
   * @param token The token used to identify the verification
   * @returns The verification ID
   */
  private async getVerificationIdFromToken(token: string): Promise<string> {
    try {
      const GET_VERIFICATION_LINK = gql`
        query GetVerificationLinkByToken($token: String!) {
          getVerificationLinkByToken(token: $token) {
            verificationId
          }
        }
      `
      
      const { data } = await this.client.query({
        query: GET_VERIFICATION_LINK,
        variables: { token },
        fetchPolicy: 'no-cache' // Don't use cache for this sensitive operation
      })
      
      if (data?.getVerificationLinkByToken?.verificationId) {
        return data.getVerificationLinkByToken.verificationId
      }
      
      throw new Error('Verification ID not found for token')
    } catch (error) {
      console.error('Error retrieving verification ID from token:', error)
      throw error
    }
  }
  
  /**
   * Resolves the verification ID from either a direct UUID or a token
   * @param tokenOrId Either a verification ID or token to resolve
   * @returns A valid verification ID
   */
  private async resolveVerificationId(tokenOrId: string): Promise<string> {
    // Check if the tokenOrId is already a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    
    if (uuidRegex.test(tokenOrId)) {
      return tokenOrId // It's already a UUID, return as is
    }
    
    // It's not a UUID, so attempt to resolve it from the verification link
    try {
      return await this.getVerificationIdFromToken(tokenOrId)
    } catch (error) {
      console.error('Failed to resolve verification ID:', error)
      throw new Error(`Invalid verification token or ID: ${tokenOrId}`)
    }
  }

  /**
   * Get facetec results for a verification ID
   * @param verificationId The verification ID
   * @returns The facetec results or null if not found
   */
  private async getFacetecResultsByVerificationId(verificationId: string): Promise<any[]> {
    try {
      const GET_FACETEC_RESULTS = gql`
        query GetFacetecResultsByVerificationId($verificationId: String!) {
          getFacetecResultsByVerificationId(verificationId: $verificationId) {
            id
            verificationId
            sessionId
            livenessStatus
            enrollmentStatus
            matchLevel
            manualReviewRequired
            createdAt
          }
        }
      `
      
      const { data } = await this.client.query({
        query: GET_FACETEC_RESULTS,
        variables: { verificationId },
        fetchPolicy: 'no-cache' // Don't use cache for this sensitive operation
      })
      
      if (data?.getFacetecResultsByVerificationId) {
        return data.getFacetecResultsByVerificationId
      }
      
      return []
    } catch (error) {
      console.error('Error retrieving FaceTec results:', error)
      return []
    }
  }

  /**
   * Extracts only the essential OCR data from the full response
   * @param responseJSON The full API response
   * @returns The extracted OCR data
   */
  private extractOCRData(responseJSON: any): any {
    if (!responseJSON) return null
    
    // Extract only what we need from the response
    const extractedData: any = {}
    
    // For document data (ID scans)
    if (responseJSON.documentData) {
      // Cuando documentData es un string JSON, lo mantenemos como string
      extractedData.documentData = responseJSON.documentData
    }
    
    // For match level
    if (responseJSON.matchLevel !== undefined) {
      extractedData.matchLevel = responseJSON.matchLevel
    }
    
    // For status information
    if (responseJSON.wasProcessed !== undefined) {
      extractedData.wasProcessed = responseJSON.wasProcessed
    }
    
    if (responseJSON.error !== undefined) {
      extractedData.error = responseJSON.error
    }
    
    if (responseJSON.isMatch !== undefined) {
      extractedData.isMatch = responseJSON.isMatch
    }
    
    return extractedData
  }

  /**
   * Convierte un valor mixto a Float para matchLevel
   */
  private normalizeMatchLevel(matchLevel: any): number | null {
    if (matchLevel === null || matchLevel === undefined) {
      return null;
    }
    
    // Si ya es un número, simplemente lo devolvemos
    if (typeof matchLevel === 'number') {
      return matchLevel;
    }
    
    // Si es un string, intentamos convertirlo a número
    if (typeof matchLevel === 'string') {
      const parsed = parseFloat(matchLevel);
      return isNaN(parsed) ? null : parsed;
    }
    
    return null;
  }

  /**
   * Stores liveness check results from LivenessCheckProcessor
   * @param verificationToken The verification token to identify the verification
   * @param sessionResult The session result from FaceTec
   * @param responseJSON The API response from FaceTec server
   */
  async storeLivenessCheckResult(
    verificationToken: string,
    sessionResult: any,
    responseJSON: any,
  ): Promise<void> {
    try {
      // First resolve the verification ID from the token
      const verificationId = await this.resolveVerificationId(verificationToken)
      
      // Check if we already have a result for this verification
      const existingResults = await this.getFacetecResultsByVerificationId(verificationId)
      const existingResult = existingResults.length > 0 ? existingResults[0] : null
      
      // Extract needed data from session result and response
      const sessionId = sessionResult.sessionId || `liveness-${Date.now()}` // Ensure we always have a valid sessionId
      const livenessStatus = responseJSON.wasProcessed === true && responseJSON.error === false 
        ? 'passed' 
        : 'failed'
      
      // Extract only essential data from the response
      const extractedData = this.extractOCRData(responseJSON)
      
      if (existingResult) {
        // Update existing record
        await this.updateFacetecResult(existingResult.id, {
          livenessStatus: livenessStatus,
          // Preserve the existing matchLevel if exists
          matchLevel: extractedData?.matchLevel !== undefined ? 
            this.normalizeMatchLevel(extractedData.matchLevel) : 
            (existingResult.matchLevel || null),
          // Only update fullResponse if it's the final step or if it's not set yet
          ...(extractedData && (!existingResult.fullResponse || responseJSON.isCompletelyDone) 
            ? { fullResponse: extractedData } 
            : {}),
        })
        console.log('Updated existing FaceTec result with liveness data')
      } else {
        // Create new record
        const input = {
          verificationId: verificationId,
          sessionId: sessionId,
          livenessStatus: livenessStatus,
          enrollmentStatus: 'pending', // Initial state for liveness check
          // Solo incluir matchLevel si existe
          ...(extractedData?.matchLevel !== undefined ? 
            { matchLevel: this.normalizeMatchLevel(extractedData.matchLevel) } : 
            {}),
          fullResponse: extractedData, // Store the extracted data only
          manualReviewRequired: false, // Default to false
        }
        
        // Call GraphQL mutation
        const result = await this.createFacetecResult(input)
        // Save the ID in the cache for future updates
        if (result && result.id) {
          this.resultCache.set(verificationId, result.id)
        }
        console.log('Created new FaceTec result for liveness check')
      }
    } catch (error) {
      console.error('Error storing liveness check result via GraphQL:', error)
      throw error
    }
  }

  /**
   * Stores enrollment results from PhotoIDMatchProcessor
   * @param verificationToken The verification token to identify the verification
   * @param sessionResult The session result from FaceTec
   * @param responseJSON The API response from FaceTec server
   */
  async storeEnrollmentResult(
    verificationToken: string,
    sessionResult: any,
    responseJSON: any,
  ): Promise<void> {
    try {
      // First resolve the verification ID from the token
      const verificationId = await this.resolveVerificationId(verificationToken)
      
      // Get cached result ID or fetch from API
      let resultId = this.resultCache.get(verificationId)
      if (!resultId) {
        const existingResults = await this.getFacetecResultsByVerificationId(verificationId)
        if (existingResults.length > 0) {
          resultId = existingResults[0].id
          if (resultId) { // Asegúrate de que resultId no sea undefined
            this.resultCache.set(verificationId, resultId)
          }
        }
      }
      
      // Extract needed data from session result and response
      const sessionId = sessionResult.sessionId || `enrollment-${Date.now()}` // Ensure we always have a valid sessionId
      const livenessStatus = responseJSON.wasProcessed === true && responseJSON.error === false 
        ? 'passed' 
        : 'failed'
      const enrollmentStatus = responseJSON.wasProcessed === true && responseJSON.error === false 
        ? 'success' 
        : 'failed'
      
      // Extract only essential data from the response
      const extractedData = this.extractOCRData(responseJSON)
      
      if (resultId) {
        // Fetch existing result to get current data
        const existingResults = await this.getFacetecResultsByVerificationId(verificationId)
        const existingResult = existingResults.length > 0 ? existingResults[0] : null
        
        // Update existing record
        await this.updateFacetecResult(resultId, {
          livenessStatus: livenessStatus,
          enrollmentStatus: enrollmentStatus,
          // Preserve the existing matchLevel if exists
          matchLevel: extractedData?.matchLevel !== undefined ? 
            this.normalizeMatchLevel(extractedData.matchLevel) : 
            (existingResult?.matchLevel || null),
          // Only update fullResponse if it contains new information
          ...(extractedData ? { fullResponse: extractedData } : {}),
        })
        console.log('Updated existing FaceTec result with enrollment data')
      } else {
        // Create new record
        const input = {
          verificationId: verificationId,
          sessionId: sessionId,
          livenessStatus: livenessStatus,
          enrollmentStatus: enrollmentStatus,
          // Solo incluir matchLevel si existe
          ...(extractedData?.matchLevel !== undefined ? 
            { matchLevel: this.normalizeMatchLevel(extractedData.matchLevel) } : 
            {}),
          fullResponse: extractedData, // Store the extracted data only
          manualReviewRequired: false, // Default to false
        }
        
        // Call GraphQL mutation
        const result = await this.createFacetecResult(input)
        // Save the ID in the cache for future updates
        if (result && result.id) {
          this.resultCache.set(verificationId, result.id)
        }
        console.log('Created new FaceTec result for enrollment')
      }
    } catch (error) {
      console.error('Error storing enrollment result via GraphQL:', error)
      throw error
    }
  }

  /**
   * Stores ID scan match results from PhotoIDMatchProcessor
   * @param verificationToken The verification token to identify the verification
   * @param sessionResult The session result from FaceTec
   * @param idScanResult The ID scan result from FaceTec
   * @param responseJSON The API response from FaceTec server
   */
  async storeIDScanMatchResult(
    verificationToken: string,
    sessionResult: any,
    idScanResult: any,
    responseJSON: any,
  ): Promise<void> {
    try {
      // First resolve the verification ID from the token
      const verificationId = await this.resolveVerificationId(verificationToken)
      
      console.log('ID Scan result input:', JSON.stringify({
        verificationId,
        matchLevel: responseJSON.matchLevel,
        isCompletelyDone: responseJSON.isCompletelyDone
      }));
      
      // Get cached result ID or fetch from API
      let resultId = this.resultCache.get(verificationId)
      if (!resultId) {
        const existingResults = await this.getFacetecResultsByVerificationId(verificationId)
        if (existingResults.length > 0) {
          resultId = existingResults[0].id
          if (resultId) { // Asegúrate de que resultId no sea undefined
            this.resultCache.set(verificationId, resultId)
          }
        }
      }
      
      // Extract needed data from session result and response
      const sessionId = idScanResult.sessionId || `idscan-${Date.now()}` // Ensure we always have a valid sessionId
      
      // Only proceed if this is the final step
      const isFinalStep = responseJSON.isCompletelyDone === true
      
      // Extract match level if available - aseguramos que sea un número
      const rawMatchLevel = responseJSON.matchLevel !== undefined ? responseJSON.matchLevel : null
      const matchLevel = this.normalizeMatchLevel(rawMatchLevel)
      
      console.log('ID Scan matchLevel processing:', {
        raw: rawMatchLevel,
        normalized: matchLevel,
        type: typeof matchLevel
      });
      
      // Determine if manual review is required based on match level
      // Typically if match level is below a certain threshold
      const manualReviewRequired = matchLevel !== null && matchLevel < 80
      
      // Extract only essential data from the response, particularly OCR data
      const extractedData = this.extractOCRData(responseJSON)
      
      if (resultId) {
        // Fetch existing result to get current data
        const existingResults = await this.getFacetecResultsByVerificationId(verificationId)
        const existingResult = existingResults.length > 0 ? existingResults[0] : null
        
        // Only update if this is the final step or contains important data
        if (isFinalStep || extractedData?.documentData) {
          console.log('Updating FaceTec result with matchLevel:', matchLevel);
          
          const updateFields = {
            livenessStatus: 'passed', // Assume passed at this stage
            enrollmentStatus: 'success', // Assume success at this stage
            matchLevel: matchLevel,
            manualReviewRequired: manualReviewRequired,
            fullResponse: extractedData // Update with the extracted OCR data
          };
          
          // Si existingResult tiene un matchLevel y el nuevo es null, mantener el existente
          if (existingResult?.matchLevel && matchLevel === null) {
            updateFields.matchLevel = existingResult.matchLevel;
          }
          
          await this.updateFacetecResult(resultId, updateFields)
          console.log('Updated existing FaceTec result with ID scan data')
        }
      } else {
        // Create new record only if we don't have one yet
        const input = {
          verificationId: verificationId,
          sessionId: sessionId,
          livenessStatus: 'passed', // Assume liveness passed if we got to ID scan
          enrollmentStatus: 'success', // Assume enrollment succeeded if we got to ID scan
          matchLevel: matchLevel,
          fullResponse: extractedData, // Store the extracted OCR data
          manualReviewRequired: manualReviewRequired,
        }
        
        console.log('Creating FaceTec result with matchLevel:', matchLevel);
        
        // Call GraphQL mutation
        const result = await this.createFacetecResult(input)
        // Save the ID in the cache for future updates
        if (result && result.id) {
          this.resultCache.set(verificationId, result.id)
        }
        console.log('Created new FaceTec result for ID scan')
      }
    } catch (error) {
      console.error('Error storing ID scan match result via GraphQL:', error)
      throw error
    }
  }

  /**
   * Updates an existing FaceTec result with new data
   * @param id The ID of the FaceTec result to update
   * @param updates The updates to apply
   */
  async updateFacetecResult(id: string, updates: any): Promise<void> {
    try {
      // Debug log para ver exactamente qué se está enviando
      console.log('Sending update to FaceTec result:', {
        id,
        updates: {
          ...updates,
          fullResponse: updates.fullResponse ? 'present' : 'not present',
          matchLevel: updates.matchLevel !== undefined ? updates.matchLevel : 'undefined'
        }
      });
      
      const UPDATE_FACETEC_RESULT = gql`
        mutation UpdateFacetecResult($input: UpdateFacetecResultInput!) {
          updateFacetecResult(input: $input) {
            id
            livenessStatus
            enrollmentStatus
            matchLevel
            manualReviewRequired
          }
        }
      `
      
      await this.client.mutate({
        mutation: UPDATE_FACETEC_RESULT,
        variables: {
          input: {
            id,
            ...updates,
          },
        },
      })
    } catch (error) {
      console.error('Error updating FaceTec result via GraphQL:', error)
      console.error('Update input that caused error:', { id, ...updates })
      throw error
    }
  }

  /**
   * Creates a new FaceTec result
   * @param input The input data for creating a FaceTec result
   */
  private async createFacetecResult(input: any): Promise<any> {
    // Debug log para ver exactamente qué se está enviando
    console.log('Creating new FaceTec result:', {
      ...input,
      fullResponse: input.fullResponse ? 'present' : 'not present',
      matchLevel: input.matchLevel !== undefined ? input.matchLevel : 'undefined'
    });
    
    const CREATE_FACETEC_RESULT = gql`
      mutation CreateFacetecResult($input: CreateFacetecResultInput!) {
        createFacetecResult(input: $input) {
          id
          verificationId
          sessionId
          livenessStatus
          enrollmentStatus
          matchLevel
          manualReviewRequired
          createdAt
        }
      }
    `
    
    const { data } = await this.client.mutate({
      mutation: CREATE_FACETEC_RESULT,
      variables: {
        input,
      },
    })
    
    return data.createFacetecResult
  }

  /**
   * Gets the verification type (bronze, silver, gold) for a given token
   * @param token The token of the verification link
   * @returns The verification type or null if not found
   */
  async getVerificationType(token: string): Promise<string | null> {
    try {
      const GET_VERIFICATION_TYPE = gql`
        query GetVerificationTypeByToken($token: String!) {
          getVerificationLinkByToken(token: $token) {
            kycVerification {
              verificationType
            }
          }
        }
      `
      
      const { data } = await this.client.query({
        query: GET_VERIFICATION_TYPE,
        variables: { token },
        fetchPolicy: 'no-cache' // No usar caché para esta operación sensible
      })
      
      if (data?.getVerificationLinkByToken?.kycVerification?.verificationType) {
        return data.getVerificationLinkByToken.kycVerification.verificationType
      }
      
      console.warn('Verification type not found for token:', token)
      return null
    } catch (error) {
      console.error('Error retrieving verification type:', error)
      return null
    }
  }
}

export default FacetecGraphQLAdapter 