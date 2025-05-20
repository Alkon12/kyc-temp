import { injectable } from 'inversify'
import { DocusealApiTemplate } from '@domain/docuseal/DocusealSyncService'

export interface DocusealFieldValue {
  uuid: string;
  value: string;
}

export interface DocusealSubmissionData {
  submitter_uuid: string;
  values: DocusealFieldValue[] | Record<string, string>;
  email?: string;
  phone?: string;
  name?: string;
  redirect_url?: string;
  metadata?: Record<string, any>;
}

@injectable()
export class DocusealApiService {
  private readonly docusealApiUrl: string
  private readonly docusealToken: string

  constructor() {
    this.docusealApiUrl = process.env.DOCUSEAL_API_URL || ''
    this.docusealToken = process.env.DOCUSEAL_TOKEN || ''

    if (!this.docusealApiUrl || !this.docusealToken) {
      throw new Error('DOCUSEAL_API_URL and DOCUSEAL_TOKEN must be defined in environment variables')
    }
  }

  /**
   * Obtiene los detalles de una plantilla específica de Docuseal por su ID
   * Si no se especifica un ID o la plantilla no existe, intenta obtener la primera plantilla disponible
   * @param templateId ID de la plantilla en Docuseal
   * @returns Información completa de la plantilla
   */
  async getTemplateById(templateId: string): Promise<DocusealApiTemplate> {
    try {
      console.log(`[DocusealApiService] Obteniendo plantilla con ID: ${templateId}`);
      
      if (!templateId || templateId === 'undefined' || templateId === 'null') {
        console.log('[DocusealApiService] No se proporcionó un ID válido, obteniendo la primera plantilla disponible');
        return await this.getFirstTemplate();
      }
      
      const url = `${this.docusealApiUrl}/api/templates/${templateId}`;
      
      console.log(`[DocusealApiService] URL de la petición: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': `${this.docusealToken}`
        }
      });

      if (!response.ok) {
        // Si es un 404, intentar obtener la primera plantilla disponible
        if (response.status === 404) {
          console.log(`[DocusealApiService] Plantilla con ID ${templateId} no encontrada, intentando obtener la primera plantilla`);
          return await this.getFirstTemplate();
        }
        
        const errorText = await response.text().catch(() => 'No response text available');
        console.error(`[DocusealApiService] Error en respuesta HTTP: ${response.status} ${response.statusText}`);
        console.error(`[DocusealApiService] Detalles del error: ${errorText}`);
        throw new Error(`Failed to fetch template: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`[DocusealApiService] Plantilla obtenida correctamente: ID=${data.id}, Nombre=${data.name}`);
      return data as DocusealApiTemplate;
    } catch (error) {
      console.error(`[DocusealApiService] Error al obtener plantilla ${templateId}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtiene la primera plantilla disponible en Docuseal
   * @returns La primera plantilla disponible
   */
  async getFirstTemplate(): Promise<DocusealApiTemplate> {
    try {
      console.log('[DocusealApiService] Obteniendo lista de plantillas para encontrar la primera disponible');
      const url = `${this.docusealApiUrl}/api/templates`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': `${this.docusealToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response text available');
        console.error(`[DocusealApiService] Error al obtener plantillas: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // Verificar si hay plantillas disponibles
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('No hay plantillas disponibles en Docuseal');
      }
      
      // Obtener la primera plantilla
      const firstTemplate = data.data[0];
      console.log(`[DocusealApiService] Primera plantilla encontrada: ID=${firstTemplate.id}, Nombre=${firstTemplate.name}`);
      
      return firstTemplate;
    } catch (error) {
      console.error('[DocusealApiService] Error al obtener la primera plantilla:', error);
      throw error;
    }
  }

  /**
   * Crea una solicitud de firma con valores prellenados
   * @param templateId ID de la plantilla (docusealTemplateId)
   * @param submissionData Datos para la solicitud de firma
   * @returns Información sobre la solicitud creada
   */
  async createSubmissionWithPrefill(
    templateId: string, 
    submissionData: DocusealSubmissionData
  ): Promise<any> {
    try {
      console.log(`[DocusealApiService] Creando submission para plantilla: ${templateId}`);
      const url = `${this.docusealApiUrl}/api/submissions`;
      
      console.log(`[DocusealApiService] URL de la petición: ${url}`);
      
      // Convertir los valores del formato de array al formato de objeto que espera Docuseal
      let valuesObject: Record<string, string> = {};
      
      if (Array.isArray(submissionData.values)) {
        // Convertir de array de {uuid, value} a objeto {uuid: value}
        submissionData.values.forEach(field => {
          valuesObject[field.uuid] = field.value;
        });
      } else {
        // Ya es un objeto
        valuesObject = submissionData.values;
      }
      
      // Crear el payload con el formato correcto
      const payload = {
        template_id: templateId,
        submitters: [{
          submitter_uuid: submissionData.submitter_uuid,
          values: valuesObject,
          email: submissionData.email,
          phone: submissionData.phone,
          name: submissionData.name,
          redirect_url: submissionData.redirect_url,
          metadata: submissionData.metadata
        }]
      };
      
      console.log(`[DocusealApiService] Datos de envío:`, payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': `${this.docusealToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response text available');
        console.error(`[DocusealApiService] Error en respuesta HTTP al crear submission: ${response.status} ${response.statusText}`);
        console.error(`[DocusealApiService] Detalles del error: ${errorText}`);
        
        // Si es error 404, intentar obtener la plantilla para diagnosticar el problema
        if (response.status === 404) {
          try {
            console.log(`[DocusealApiService] Verificando si existe la plantilla ${templateId}...`);
            await this.getTemplateById(templateId);
            // Si no lanza excepción es que la plantilla existe pero hay otro problema con la API
            console.log(`[DocusealApiService] ✅ La plantilla ${templateId} sí existe pero hay otro problema con la API`);
          } catch (templateError) {
            console.error(`[DocusealApiService] ❌ La plantilla ${templateId} no existe. Detalles:`, templateError);
          }
        }
        
        throw new Error(`Failed to create submission: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[DocusealApiService] Submission creada correctamente:`, data);
      return data;
    } catch (error) {
      console.error(`[DocusealApiService] Error al crear submission para plantilla ${templateId}:`, error);
      throw error;
    }
  }
  
  /**
   * Busca campos en una plantilla que coincidan con nombres específicos
   * @param templateId ID de la plantilla
   * @param fieldNames Nombres de campos a buscar
   * @returns Mapa de campos encontrados con su UUID
   */
  async findMatchingFields(templateId: string, fieldNames: string[]): Promise<Map<string, string>> {
    const template = await this.getTemplateById(templateId)
    const matchingFields = new Map<string, string>()
    
    if (!template.fields || !Array.isArray(template.fields)) {
      return matchingFields
    }
    
    for (const field of template.fields) {
      const fieldNameLower = field.name.toLowerCase()
      
      for (const searchName of fieldNames) {
        if (fieldNameLower === searchName.toLowerCase()) {
          matchingFields.set(searchName, field.uuid)
        }
      }
    }
    
    return matchingFields
  }
} 