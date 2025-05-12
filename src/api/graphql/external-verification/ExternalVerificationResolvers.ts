import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { ExternalVerificationService } from '@domain/externalVerification/ExternalVerificationService'
import { GraphQLScalarType, Kind } from 'graphql'
import { JsonValue } from '@domain/shared/JsonValue'
import { ExternalVerificationFactory } from '@domain/externalVerification/ExternalVerificationFactory'

export const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'A scalar that can represent any JSON value',
  serialize(value) {
    return value
  },
  parseValue(value) {
    return value
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value)
      case Kind.OBJECT:
        // @ts-ignore
        const value = Object.create(null)
        // @ts-ignore
        ast.fields.forEach((field) => {
          // @ts-ignore
          value[field.name.value] = parseLiteral(field.value)
        })
        return value
      case Kind.INT:
        return parseInt(ast.value, 10)
      case Kind.FLOAT:
        return parseFloat(ast.value)
      case Kind.BOOLEAN:
        return ast.value
      default:
        return null
    }
  },
})

function parseLiteral(ast: any) {
  switch (ast.kind) {
    case Kind.STRING:
      return ast.value
    case Kind.INT:
      return parseInt(ast.value, 10)
    case Kind.FLOAT:
      return parseFloat(ast.value)
    case Kind.BOOLEAN:
      return ast.value
    default:
      return null
  }
}

@injectable()
export class ExternalVerificationResolvers {
  constructor(
    @inject(DI.ExternalVerificationService)
    private readonly externalVerificationService: ExternalVerificationService
  ) {}

  build() {
    return {
      Query: this.Query,
      Mutation: this.Mutation,
      ExternalVerification: this.ExternalVerification,
      ExternalVerificationType: this.ExternalVerificationType,
      JSON: this.JSON,
    }
  }

  Query = {
    externalVerification: async (_: any, { id }: { id: string }) => {
      try {
        const externalVerification = await this.externalVerificationService.findById(id)
        return externalVerification.toDTO()
      } catch (error) {
        console.error('Error fetching external verification:', error)
        return null
      }
    },
    externalVerificationsByKycId: async (_: any, { kycVerificationId }: { kycVerificationId: string }) => {
      try {
        const externalVerifications = await this.externalVerificationService.findByKycVerificationId(kycVerificationId)
        return externalVerifications.map((ev) => ev.toDTO())
      } catch (error) {
        console.error('Error fetching external verifications by KYC ID:', error)
        return []
      }
    },
  }

  Mutation = {
    createExternalVerification: async (_: any, { input }: { input: any }) => {
      try {
        const externalVerification = await this.externalVerificationService.create(input)
        return externalVerification.toDTO()
      } catch (error: any) {
        console.error('Error creating external verification:', error)
        throw new Error(`Failed to create external verification: ${error.message}`)
      }
    },
    updateExternalVerificationStatus: async (_: any, { id, status }: { id: string; status: string }) => {
      try {
        await this.externalVerificationService.updateStatus(id, status)
        return true
      } catch (error) {
        console.error('Error updating external verification status:', error)
        return false
      }
    },
    updateExternalVerificationResponse: async (_: any, { id, responseData }: { id: string; responseData: any }) => {
      try {
        await this.externalVerificationService.updateResponseData(id, responseData)
        return true
      } catch (error) {
        console.error('Error updating external verification response data:', error)
        return false
      }
    },
    updateExternalVerificationRequest: async (_: any, { id, requestData }: { id: string; requestData: any }) => {
      try {
        const externalVerification = await this.externalVerificationService.findById(id)
        externalVerification.updateRequestData(new JsonValue(requestData))
        await this.externalVerificationService.create({
          id: externalVerification.getId().toDTO(),
          verificationId: externalVerification.getVerificationId().toDTO(),
          provider: externalVerification.getProvider().toDTO(),
          verificationType: externalVerification.getVerificationType().toDTO(),
          status: externalVerification.getStatus().toDTO(),
          requestData: requestData,
          responseData: externalVerification.getResponseData()?.getJson()
        })
        return true
      } catch (error) {
        console.error('Error updating external verification request data:', error)
        return false
      }
    },
    deleteExternalVerification: async (_: any, { id }: { id: string }) => {
      try {
        await this.externalVerificationService.delete(id)
        return true
      } catch (error) {
        console.error('Error deleting external verification:', error)
        return false
      }
    },
  }

  // Field resolvers
  ExternalVerification = {
    kycVerification: async (parent: any) => {
      // This is a placeholder - if you need to implement relation resolvers, you would add them here
      return parent.kycVerification
    },
  }

  // Enum resolvers
  ExternalVerificationType = {
    IDENTITY: 'identity',
    DOCUMENT: 'document',
    ADDRESS: 'address',
    BIOMETRIC: 'biometric',
    AML: 'aml',
  }

  // Scalar resolver
  JSON = JSONScalar
} 