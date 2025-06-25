import { ApolloClient, gql } from '@apollo/client';
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId';

// Consulta para obtener FaceTecResult por verification ID
const GET_FACETEC_RESULTS = gql`
  query GetFacetecResultsByVerificationId($verificationId: String!) {
    getFacetecResultsByVerificationId(verificationId: $verificationId) {
      id
      verificationId
      sessionId
      livenessStatus
      enrollmentStatus
      matchLevel
      fullResponse
      manualReviewRequired
      createdAt
    }
  }
`;

// Interfaces para los datos de FaceTec
export interface PersonalData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  idNumber?: string;
  idNumber2?: string;
  dateOfExpiration?: string;
  dateOfIssue?: string;
  mrzLine1?: string;
  mrzLine2?: string;
  mrzLine3?: string;
  address?: string;
  sex?: string;
  [key: string]: any;
}

interface DocumentField {
  fieldKey: string;
  value: string;
}

interface DocumentGroup {
  groupKey: string;
  fields: DocumentField[];
}

interface DocumentData {
  userConfirmedValues: {
    groups: DocumentGroup[];
  };
}

export class FacetecDataExtractor {
  private apolloClient: ApolloClient<any>;

  constructor(apolloClient: ApolloClient<any>) {
    this.apolloClient = apolloClient;
  }

  /**
   * Extrae datos personales a partir de la respuesta completa de FaceTec
   * 
   * @param fullResponseStr Respuesta completa de FaceTec (string o objeto)
   * @returns Objeto con datos personales extraídos o null si hay error
   */
  public extractPersonalDataFromFaceTecResult(fullResponseStr: any): PersonalData | null {
    try {
      // Primer parseo - convertir la respuesta principal a un objeto JavaScript
      const parsedResponse = typeof fullResponseStr === 'string' 
        ? JSON.parse(fullResponseStr)
        : fullResponseStr;

      // Asegurar que exista documentData
      if (!parsedResponse || !parsedResponse.documentData) {
        console.error('No se encontró documentData en la respuesta de FaceTec');
        return null;
      }

      // Segundo parseo - convertir el campo documentData (que es un string JSON escapado) a un objeto JavaScript
      const documentData: DocumentData = typeof parsedResponse.documentData === 'string'
        ? JSON.parse(parsedResponse.documentData)
        : parsedResponse.documentData;

      // Extraer los datos personales en un objeto más simple
      const personalData: PersonalData = {};
      
      // Función auxiliar para buscar un campo por su clave en un grupo
      const findFieldValue = (group: DocumentGroup | undefined, key: string): string | null => {
        if (!group || !group.fields) return null;
        const field = group.fields.find(f => f.fieldKey === key);
        return field ? field.value : null;
      };
      
      // Extraer datos básicos (grupo userInfo)
      const userInfoGroup = documentData.userConfirmedValues?.groups?.find(g => g.groupKey === "userInfo");
      if (userInfoGroup) {
        personalData.firstName = findFieldValue(userInfoGroup, "firstName") || undefined;
        personalData.middleName = findFieldValue(userInfoGroup, "middleName") || undefined;
        personalData.lastName = findFieldValue(userInfoGroup, "lastName") || undefined;
        personalData.dateOfBirth = findFieldValue(userInfoGroup, "dateOfBirth") || undefined;
      }
      
      // Extraer datos del ID (grupo idInfo)
      const idInfoGroup = documentData.userConfirmedValues?.groups?.find(g => g.groupKey === "idInfo");
      if (idInfoGroup) {
        personalData.idNumber = findFieldValue(idInfoGroup, "idNumber") || undefined;
        personalData.idNumber2 = findFieldValue(idInfoGroup, "idNumber2") || undefined;
        personalData.dateOfExpiration = findFieldValue(idInfoGroup, "dateOfExpiration") || undefined;
        personalData.dateOfIssue = findFieldValue(idInfoGroup, "dateOfIssue") || undefined;
        personalData.mrzLine1 = findFieldValue(idInfoGroup, "mrzLine1") || undefined;
        personalData.mrzLine2 = findFieldValue(idInfoGroup, "mrzLine2") || undefined;
        personalData.mrzLine3 = findFieldValue(idInfoGroup, "mrzLine3") || undefined;
      }
      
      // Extraer dirección (grupo addressInfo)
      const addressGroup = documentData.userConfirmedValues?.groups?.find(g => g.groupKey === "addressInfo");
      if (addressGroup && addressGroup.fields) {
        personalData.address1 = findFieldValue(addressGroup, "address1") || undefined;
        personalData.address2 = findFieldValue(addressGroup, "address2") || undefined;
        personalData.address3 = findFieldValue(addressGroup, "address3") || undefined;
      }
      
      // Extraer datos físicos (grupo secondaryUserInfo)
      const secondaryInfoGroup = documentData.userConfirmedValues?.groups?.find(g => g.groupKey === "secondaryUserInfo");
      if (secondaryInfoGroup) {
        personalData.sex = findFieldValue(secondaryInfoGroup, "sex") || undefined;
      }
      console.log("personalData",personalData);
      return personalData;
    } catch (error) {
      console.error('Error al procesar datos de FaceTec:', error);
      return null;
    }
  }

  /**
   * Obtiene los resultados de FaceTec para una verificación específica
   * y extrae los datos personales del documento
   * 
   * @param verificationId ID de la verificación
   * @returns Promise con los datos personales extraídos o null si hay error
   */
  public async getPersonalDataFromVerification(verificationId: string): Promise<PersonalData | null> {
    try {
      // Obtener resultados de FaceTec
      const response = await this.apolloClient.query({
        query: GET_FACETEC_RESULTS,
        variables: { verificationId }
      });

      // Verificar si hay resultados
      if (!response.data?.getFacetecResultsByVerificationId || 
          response.data.getFacetecResultsByVerificationId.length === 0) {
        console.warn('No se encontraron resultados de FaceTec para la verificación:', verificationId);
        return null;
      }

      // Usar el resultado más reciente
      const latestResult = response.data.getFacetecResultsByVerificationId[0];
      
      // Verificar si hay fullResponse
      if (!latestResult.fullResponse) {
        console.warn('No se encontró fullResponse en el resultado de FaceTec');
        return null;
      }

      // Extraer y devolver datos personales
      return this.extractPersonalDataFromFaceTecResult(latestResult.fullResponse);
    } catch (error) {
      console.error('Error al obtener datos personales de la verificación:', error);
      return null;
    }
  }
}

export default FacetecDataExtractor; 