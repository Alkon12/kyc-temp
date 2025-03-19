import { KycPersonEntity } from './models/KycPersonEntity'
import { KycPersonId } from './models/KycPersonId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { CreateKycPersonArgs } from './interfaces/CreateKycPersonArgs'

export default abstract class AbstractKycPersonService {
  abstract getById(id: KycPersonId): Promise<KycPersonEntity>
  abstract getByVerificationId(verificationId: KycVerificationId): Promise<KycPersonEntity[]>
  abstract create(props: CreateKycPersonArgs): Promise<KycPersonEntity>
  abstract update(id: KycPersonId, props: Partial<CreateKycPersonArgs>): Promise<KycPersonEntity>
  abstract delete(id: KycPersonId): Promise<boolean>
} 