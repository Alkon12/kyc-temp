import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import PendingDocumentsRepository from '@domain/pendingDocuments/PendingDocumentsRepository'
import { PendingDocumentsEntity } from '@domain/pendingDocuments/PendingDocumentsEntity'
import AbstractPendingDocumentsService from '@domain/pendingDocuments/AbstractPendingDocumentsService'

@injectable()
export class PendingDocumentsService implements AbstractPendingDocumentsService {
  constructor(
    @inject(DI.PendingDocumentsRepository)
    private readonly pendingDocumentsRepository: PendingDocumentsRepository,
  ) {}

  async fetchPendingDocuments(numeroDeSerie: string): Promise<PendingDocumentsEntity[]> {
    return this.pendingDocumentsRepository.fetchPendingDocuments(numeroDeSerie)
  }
}
