import { FacetecGraphQLAdapter } from './FacetecGraphQLAdapter';

// Mock Apollo client
jest.mock('@apollo/client', () => {
  return {
    ApolloClient: jest.fn().mockImplementation(() => ({
      mutate: jest.fn().mockResolvedValue({
        data: {
          createFacetecResult: {
            id: 'mocked-id',
            verificationId: 'mocked-verification-id',
            sessionId: 'mocked-session-id',
            livenessStatus: 'passed',
            enrollmentStatus: 'success',
          }
        }
      }),
      query: jest.fn().mockImplementation((options) => {
        if (options.query.includes('GetVerificationLinkByToken')) {
          return Promise.resolve({
            data: {
              getVerificationLinkByToken: {
                verificationId: 'resolved-uuid-verification-id'
              }
            }
          });
        } else if (options.query.includes('GetFacetecResultsByVerificationId')) {
          // Simular que no se encuentra ningún resultado primero, luego uno existente
          const verificationId = options.variables.verificationId;
          if (verificationId === 'has-existing-result') {
            return Promise.resolve({
              data: {
                getFacetecResultsByVerificationId: [{
                  id: 'existing-result-id',
                  verificationId: 'has-existing-result',
                  sessionId: 'existing-session-id',
                  livenessStatus: 'pending',
                  enrollmentStatus: 'pending',
                  matchLevel: null,
                  manualReviewRequired: false,
                  createdAt: new Date().toISOString()
                }]
              }
            });
          }
          return Promise.resolve({
            data: {
              getFacetecResultsByVerificationId: []
            }
          });
        }
        return Promise.resolve({ data: {} });
      })
    })),
    InMemoryCache: jest.fn(),
    gql: jest.fn(query => query),
  };
});

describe('FacetecGraphQLAdapter', () => {
  let adapter: FacetecGraphQLAdapter;
  
  beforeEach(() => {
    adapter = new FacetecGraphQLAdapter();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('resolveVerificationId', () => {
    it('should return the ID directly if it is a valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      // @ts-ignore - accessing private method for testing
      const result = await adapter.resolveVerificationId(validUUID);
      expect(result).toBe(validUUID);
    });
    
    it('should resolve a non-UUID token to a verification ID', async () => {
      const nonUUID = 'c3bacd88849a86860f9ecdbbbd7e7ab849b0fe74b3035ddacb3407c1fa693009';
      // @ts-ignore - accessing private method for testing
      const result = await adapter.resolveVerificationId(nonUUID);
      expect(result).toBe('resolved-uuid-verification-id');
    });
  });

  describe('extractOCRData', () => {
    it('should extract only essential data from the full response', () => {
      const fullResponse = {
        wasProcessed: true,
        error: false,
        isMatch: true,
        matchLevel: 90,
        documentData: {
          firstName: 'John',
          lastName: 'Doe',
          documentNumber: '123456789'
        },
        extraData: 'this should be excluded',
        bigDataObject: { lots: 'of data that is not needed' }
      };

      // @ts-ignore - accessing private method for testing
      const extractedData = adapter.extractOCRData(fullResponse);
      
      expect(extractedData).toHaveProperty('wasProcessed', true);
      expect(extractedData).toHaveProperty('error', false);
      expect(extractedData).toHaveProperty('isMatch', true);
      expect(extractedData).toHaveProperty('matchLevel', 90);
      expect(extractedData).toHaveProperty('documentData');
      expect(extractedData.documentData).toEqual(fullResponse.documentData);
      
      // Should not include extraData
      expect(extractedData).not.toHaveProperty('extraData');
      expect(extractedData).not.toHaveProperty('bigDataObject');
    });
  });
  
  describe('storeLivenessCheckResult', () => {
    it('should create a new result when none exists', async () => {
      // Mock data
      const mockToken = 'c3bacd88849a86860f9ecdbbbd7e7ab849b0fe74b3035ddacb3407c1fa693009';
      const mockSessionResult = {
        sessionId: 'test-session-id',
        auditTrail: ['test-audit-trail'],
      };
      const mockResponseJSON = {
        wasProcessed: true,
        error: false,
        scanResultBlob: 'test-blob',
      };
      
      // Spy on the private methods
      const resolveSpy = jest.spyOn(adapter as any, 'resolveVerificationId');
      const getFacetecResultsSpy = jest.spyOn(adapter as any, 'getFacetecResultsByVerificationId');
      const createSpy = jest.spyOn(adapter as any, 'createFacetecResult');
      const updateSpy = jest.spyOn(adapter, 'updateFacetecResult');
      
      // Call method
      await adapter.storeLivenessCheckResult(
        mockToken,
        mockSessionResult,
        mockResponseJSON
      );
      
      // Assertions
      expect(resolveSpy).toHaveBeenCalledWith(mockToken);
      expect(getFacetecResultsSpy).toHaveBeenCalledWith('resolved-uuid-verification-id');
      expect(createSpy).toHaveBeenCalled();
      expect(updateSpy).not.toHaveBeenCalled();
    });
    
    it('should update an existing result when one exists', async () => {
      // Mock data for existing result
      const mockToken = 'existing-result-token';
      const mockSessionResult = {
        sessionId: 'test-session-id',
        auditTrail: ['test-audit-trail'],
      };
      const mockResponseJSON = {
        wasProcessed: true,
        error: false,
        scanResultBlob: 'test-blob',
      };
      
      // Override resolveVerificationId to return 'has-existing-result'
      jest.spyOn(adapter as any, 'resolveVerificationId').mockResolvedValueOnce('has-existing-result');
      
      // Spy on other methods
      const getFacetecResultsSpy = jest.spyOn(adapter as any, 'getFacetecResultsByVerificationId');
      const createSpy = jest.spyOn(adapter as any, 'createFacetecResult');
      const updateSpy = jest.spyOn(adapter, 'updateFacetecResult');
      
      // Call method
      await adapter.storeLivenessCheckResult(
        mockToken,
        mockSessionResult,
        mockResponseJSON
      );
      
      // Assertions
      expect(getFacetecResultsSpy).toHaveBeenCalledWith('has-existing-result');
      expect(createSpy).not.toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith('existing-result-id', expect.anything());
    });
  });
  
  describe('storeEnrollmentResult', () => {
    it('should create a new result when none exists', async () => {
      // Mock data
      const mockToken = 'c3bacd88849a86860f9ecdbbbd7e7ab849b0fe74b3035ddacb3407c1fa693009';
      const mockSessionResult = {
        sessionId: 'test-session-id',
        auditTrail: ['test-audit-trail'],
      };
      const mockResponseJSON = {
        wasProcessed: true,
        error: false,
        scanResultBlob: 'test-blob',
      };
      
      // Spy on the private methods
      const resolveSpy = jest.spyOn(adapter as any, 'resolveVerificationId');
      const getFacetecResultsSpy = jest.spyOn(adapter as any, 'getFacetecResultsByVerificationId');
      const createSpy = jest.spyOn(adapter as any, 'createFacetecResult');
      const updateSpy = jest.spyOn(adapter, 'updateFacetecResult');
      
      // Call method
      await adapter.storeEnrollmentResult(
        mockToken,
        mockSessionResult,
        mockResponseJSON
      );
      
      // Assertions
      expect(resolveSpy).toHaveBeenCalledWith(mockToken);
      expect(getFacetecResultsSpy).toHaveBeenCalledWith('resolved-uuid-verification-id');
      expect(createSpy).toHaveBeenCalled();
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
  
  describe('storeIDScanMatchResult', () => {
    it('should update an existing result with OCR data', async () => {
      // Mock data
      const mockToken = 'existing-result-token';
      const mockSessionResult = {
        sessionId: 'test-session-id',
      };
      const mockIDScanResult = {
        sessionId: 'test-id-scan-session-id',
      };
      const mockResponseJSON = {
        wasProcessed: true,
        error: false,
        scanResultBlob: 'test-blob',
        matchLevel: 90,
        documentData: {
          firstName: 'John',
          lastName: 'Doe'
        },
        isCompletelyDone: true
      };
      
      // Override resolveVerificationId to return 'has-existing-result'
      jest.spyOn(adapter as any, 'resolveVerificationId').mockResolvedValueOnce('has-existing-result');
      
      // Spy on other methods
      const getFacetecResultsSpy = jest.spyOn(adapter as any, 'getFacetecResultsByVerificationId');
      const extractSpy = jest.spyOn(adapter as any, 'extractOCRData');
      const createSpy = jest.spyOn(adapter as any, 'createFacetecResult');
      const updateSpy = jest.spyOn(adapter, 'updateFacetecResult');
      
      // Call method
      await adapter.storeIDScanMatchResult(
        mockToken,
        mockSessionResult,
        mockIDScanResult,
        mockResponseJSON
      );
      
      // Assertions
      expect(getFacetecResultsSpy).toHaveBeenCalledWith('has-existing-result');
      expect(extractSpy).toHaveBeenCalledWith(mockResponseJSON);
      expect(createSpy).not.toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith('existing-result-id', expect.objectContaining({
        livenessStatus: 'passed',
        enrollmentStatus: 'success',
        matchLevel: 90,
        manualReviewRequired: false
      }));
    });
    
    it('should only update if final step or contains document data', async () => {
      // Mock data without final step or document data
      const mockToken = 'existing-result-token';
      const mockSessionResult = {
        sessionId: 'test-session-id',
      };
      const mockIDScanResult = {
        sessionId: 'test-id-scan-session-id',
      };
      const mockResponseJSON = {
        wasProcessed: true,
        error: false,
        scanResultBlob: 'test-blob',
        isCompletelyDone: false // Not final step
      };
      
      // Override resolveVerificationId to return 'has-existing-result'
      jest.spyOn(adapter as any, 'resolveVerificationId').mockResolvedValueOnce('has-existing-result');
      
      // Spy on other methods
      const getFacetecResultsSpy = jest.spyOn(adapter as any, 'getFacetecResultsByVerificationId');
      const updateSpy = jest.spyOn(adapter, 'updateFacetecResult');
      
      // Call method
      await adapter.storeIDScanMatchResult(
        mockToken,
        mockSessionResult,
        mockIDScanResult,
        mockResponseJSON
      );
      
      // Assertions
      expect(getFacetecResultsSpy).toHaveBeenCalledWith('has-existing-result');
      expect(updateSpy).not.toHaveBeenCalled(); // Should not update since not final step and no document data
    });
  });
}); 