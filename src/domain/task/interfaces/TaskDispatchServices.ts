import { NotificationService } from '@/application/service/NotificationService'
import { ApplicationChecklistService } from '@service/ApplicationChecklistService'
import AbstractTaskService from '../TaskService'
import type LeasingRepository from '@domain/leasing/LeasingRepository'
import AbstractProspectService from '@domain/prospect/ProspectService'
import AbstractSlotService from '@domain/slot/SlotService'
import { PrismaClient } from '@prisma/client'
import AbstractContractService from '@domain/contract/AbstractContractService'

export interface TaskDispatchServices {
  prisma: PrismaClient
  taskService: AbstractTaskService
  notificationService: NotificationService
  applicationChecklistService: ApplicationChecklistService
  leasingRepository: LeasingRepository
  prospectService: AbstractProspectService
  slotService: AbstractSlotService
  contractService: AbstractContractService
}
