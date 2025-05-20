import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { SignedDocumentId } from '@domain/signedDocument/models/SignedDocumentId'
import { SignedDocumentEntity } from '@domain/signedDocument/models/SignedDocumentEntity'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'
import { StringValue } from '@domain/shared/StringValue'
import { JsonValue } from '@domain/shared/JsonValue'
import AbstractSignedDocumentService from '@domain/signedDocument/SignedDocumentService'
import { CreateSignedDocumentArgs } from '@domain/signedDocument/interfaces/CreateSignedDocumentArgs'
import { DocumentSigningService } from '@service/DocumentSigningService'
import {
  QueryGetSignedDocumentByIdArgs,
  QueryGetSignedDocumentsByVerificationIdArgs,
  QueryGetSignedDocumentsByStatusArgs,
  MutationCreateSignedDocumentArgs,
  MutationUpdateSignedDocumentStatusArgs,
  MutationUpdateSignedDocumentSubmissionIdArgs,
  MutationUpdateSignedDocumentUrlArgs
} from '../app.schema.gen'

// Define tipos adicionales que no están en app.schema.gen
interface QueryGetDocusealTemplateIdArgs {
  signedDocumentId: string;
}

interface QueryGetDocumentsToSignByVerificationIdArgs {
  verificationId: string;
}

interface MutationSendDocumentForSigningArgs {
  documentId: string;
  data?: Record<string, any>;
}

@injectable()
export class SignedDocumentResolvers {
  build() {
    return {
      Query: {
        getSignedDocumentById: this.getSignedDocumentById,
        getSignedDocumentsByVerificationId: this.getSignedDocumentsByVerificationId,
        getSignedDocumentsByStatus: this.getSignedDocumentsByStatus,
        getDocusealTemplateId: this.getDocusealTemplateId,
        getDocumentsToSignByVerificationId: this.getDocumentsToSignByVerificationId,
      },
      Mutation: {
        createSignedDocument: this.createSignedDocument,
        updateSignedDocumentStatus: this.updateSignedDocumentStatus,
        updateSignedDocumentSubmissionId: this.updateSignedDocumentSubmissionId,
        updateSignedDocumentUrl: this.updateSignedDocumentUrl,
        sendDocumentForSigning: this.sendDocumentForSigning,
      },
    }
  }

  getSignedDocumentById = async (_parent: unknown, { signedDocumentId }: QueryGetSignedDocumentByIdArgs): Promise<DTO<SignedDocumentEntity>> => {
    const signedDocumentService = container.get<AbstractSignedDocumentService>(DI.SignedDocumentService)
    
    const signedDocument = await signedDocumentService.getById(new SignedDocumentId(signedDocumentId))
    
    return signedDocument.toDTO()
  }

  getSignedDocumentsByVerificationId = async (_parent: unknown, { verificationId }: QueryGetSignedDocumentsByVerificationIdArgs): Promise<DTO<SignedDocumentEntity>[]> => {
    const signedDocumentService = container.get<AbstractSignedDocumentService>(DI.SignedDocumentService)
    
    const signedDocuments = await signedDocumentService.getByVerificationId(new KycVerificationId(verificationId))
    
    return signedDocuments.map(doc => doc.toDTO())
  }

  getSignedDocumentsByStatus = async (_parent: unknown, { status }: QueryGetSignedDocumentsByStatusArgs): Promise<DTO<SignedDocumentEntity>[]> => {
    const signedDocumentService = container.get<AbstractSignedDocumentService>(DI.SignedDocumentService)
    
    const signedDocuments = await signedDocumentService.getByStatus(status)
    
    return signedDocuments.map(doc => doc.toDTO())
  }

  createSignedDocument = async (_parent: unknown, args: MutationCreateSignedDocumentArgs): Promise<DTO<SignedDocumentEntity>> => {
    const signedDocumentService = container.get<AbstractSignedDocumentService>(DI.SignedDocumentService)
    
    const createArgs: CreateSignedDocumentArgs = {
      verificationId: new KycVerificationId(args.verificationId),
      templateId: new DocusealTemplateId(args.templateId),
      docusealSubmissionId: args.docusealSubmissionId ? new StringValue(args.docusealSubmissionId) : undefined,
      status: args.status ? new StringValue(args.status) : undefined,
      signerEmail: args.signerEmail ? new StringValue(args.signerEmail) : undefined,
      signerPhone: args.signerPhone ? new StringValue(args.signerPhone) : undefined,
      documentUrl: args.documentUrl ? new StringValue(args.documentUrl) : undefined,
      additionalData: args.additionalData ? new JsonValue(args.additionalData) : undefined,
    }
    
    const signedDocument = await signedDocumentService.create(createArgs)
    
    return signedDocument.toDTO()
  }

  updateSignedDocumentStatus = async (_parent: unknown, { signedDocumentId, status }: MutationUpdateSignedDocumentStatusArgs): Promise<DTO<SignedDocumentEntity>> => {
    const signedDocumentService = container.get<AbstractSignedDocumentService>(DI.SignedDocumentService)
    
    const signedDocument = await signedDocumentService.updateStatus(new SignedDocumentId(signedDocumentId), status)
    
    return signedDocument.toDTO()
  }

  updateSignedDocumentSubmissionId = async (_parent: unknown, { signedDocumentId, submissionId }: MutationUpdateSignedDocumentSubmissionIdArgs): Promise<DTO<SignedDocumentEntity>> => {
    const signedDocumentService = container.get<AbstractSignedDocumentService>(DI.SignedDocumentService)
    
    const signedDocument = await signedDocumentService.updateDocusealSubmissionId(new SignedDocumentId(signedDocumentId), submissionId)
    
    return signedDocument.toDTO()
  }

  updateSignedDocumentUrl = async (_parent: unknown, { signedDocumentId, url }: MutationUpdateSignedDocumentUrlArgs): Promise<DTO<SignedDocumentEntity>> => {
    const signedDocumentService = container.get<AbstractSignedDocumentService>(DI.SignedDocumentService)
    
    const signedDocument = await signedDocumentService.updateDocumentUrl(new SignedDocumentId(signedDocumentId), url)
    
    return signedDocument.toDTO()
  }

  getDocusealTemplateId = async (_parent: unknown, { signedDocumentId }: QueryGetDocusealTemplateIdArgs): Promise<string | null> => {
    try {
      const documentSigningService = container.get<DocumentSigningService>(DI.DocumentSigningService);
      
      const templateId = await documentSigningService.getDocusealTemplateId(signedDocumentId);
      
      return templateId?.toDTO() || null;
    } catch (error) {
      console.error('Error getting docuseal template ID:', error);
      return null;
    }
  }
  
  getDocumentsToSignByVerificationId = async (_parent: unknown, { verificationId }: QueryGetDocumentsToSignByVerificationIdArgs): Promise<any[]> => {
    try {
      const documentSigningService = container.get<DocumentSigningService>(DI.DocumentSigningService);
      
      const documents = await documentSigningService.getDocumentsToSign(verificationId);
      
      return documents;
    } catch (error) {
      console.error('Error getting documents to sign:', error);
      return [];
    }
  }
  
  sendDocumentForSigning = async (_parent: unknown, { documentId, data }: MutationSendDocumentForSigningArgs): Promise<any> => {
    try {
      const documentSigningService = container.get<DocumentSigningService>(DI.DocumentSigningService);
      
      const result = await documentSigningService.sendDocumentForSigning(documentId, data);
      
      return {
        success: true,
        message: "Documento enviado correctamente",
        documentId: documentId,
        submissionId: result?.id || null
      };
    } catch (error) {
      console.error('Error sending document for signing:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al enviar documento",
        documentId: documentId,
        submissionId: null
      };
    }
  }
} 