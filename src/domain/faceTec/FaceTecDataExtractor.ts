/**
 * Types for FaceTec document data
 */
interface FaceTecField {
  fieldKey: string;
  value: string;
  uiFieldType?: string;
  nonMRZValue?: string;
}

interface FaceTecGroup {
  groupKey: string;
  groupFriendlyName?: string;
  fields: FaceTecField[];
}

/**
 * Utility class to extract document information from FaceTec results
 */
export class FaceTecDataExtractor {
  /**
   * Extracts specific data from a FaceTec fullResponse JSON
   */
  static extractFromFullResponse(jsonResponse: string): {
    curp?: string;
    mrzLine1?: string;
    documentData?: any;
    error?: string;
  } {
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonResponse);
      
      // Check if we have document data
      if (!parsedResponse.documentData) {
        return { error: 'No document data found in FaceTec response' };
      }
      
      // Parse the document data which is a string
      const documentData = JSON.parse(parsedResponse.documentData);
      
      // Extract required information
      let result: { curp?: string; mrzLine1?: string; documentData?: any; error?: string } = {
        documentData
      };
      
      // Find CURP (usually in idNumber2)
      try {
        const idGroups = documentData.scannedValues?.groups || [];
        const idInfoGroup = idGroups.find((g: FaceTecGroup) => g.groupKey === 'idInfo');
        
        if (idInfoGroup && idInfoGroup.fields) {
          // Try to find the CURP field
          const curpField = idInfoGroup.fields.find((f: FaceTecField) => 
            f.fieldKey === 'idNumber2' && 
            f.value && 
            f.value.length === 18
          );
          
          if (curpField) {
            result.curp = curpField.value;
          }
          
          // Find MRZ Line 1
          const mrzLine1Field = idInfoGroup.fields.find((f: FaceTecField) => f.fieldKey === 'mrzLine1');
          if (mrzLine1Field) {
            result.mrzLine1 = mrzLine1Field.value;
          }
        }
      } catch (error) {
        console.error('Error extracting CURP or MRZ from document data:', error);
      }
      
      return result;
    } catch (error) {
      console.error('Error parsing FaceTec response:', error);
      return { error: `Error parsing FaceTec response: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  /**
   * Extract CURP from FaceTec response
   */
  static extractCurp(jsonResponse: string): string | null {
    const result = this.extractFromFullResponse(jsonResponse);
    return result.curp || null;
  }

  /**
   * Extract MRZ Line 1 from FaceTec response
   */
  static extractMrzLine1(jsonResponse: string): string | null {
    const result = this.extractFromFullResponse(jsonResponse);
    return result.mrzLine1 || null;
  }
} 