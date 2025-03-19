import { KycPersonEntity } from './models/KycPersonEntity'
import { KycPersonId } from './models/KycPersonId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

export default interface KycPersonRepository {
  getById(id: KycPersonId): Promise<KycPersonEntity>
  getByVerificationId(verificationId: KycVerificationId): Promise<KycPersonEntity[]>
  create(person: KycPersonEntity): Promise<KycPersonEntity>
  save(person: KycPersonEntity): Promise<KycPersonEntity>
  delete(id: KycPersonId): Promise<boolean>
}