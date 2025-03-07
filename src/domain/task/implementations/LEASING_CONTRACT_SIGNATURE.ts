import { signIn } from 'next-auth/react'
import { UUID } from '@domain/shared/UUID'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { DateTimeValue } from '@domain/shared/DateTime'
import { LeasingEntity } from '@domain/leasing/LeasingEntity'
import type LeasingRepository from '@domain/leasing/LeasingRepository'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { PrismaLeasingRepository } from '../../../infrastructure/repositories/prisma/PrismaLeasingRepository'
import { TaskTypeConfig } from '../TaskManager'
import { UserId } from '@domain/user/models/UserId'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'
import { ProspectActivityTypeId } from '@domain/prospect/models/ProspectActivityTypeId'
import { ContractService } from '@service/ContractService'
const getUUID = (errorMsg: string, id?: { toDTO: () => string }): UUID => {
  const dto = id?.toDTO()
  if (!dto) throw new DispatchValidationError(errorMsg)
  return new UUID(dto)
}

const getDefaultEndDate = (): DateTimeValue => {
  return new DateTimeValue(new Date('2025-12-31'))
}

export const LEASING_CONTRACT_SIGNATURE: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const leasingRepository = services.leasingRepository as PrismaLeasingRepository

    const signIn = services.contractService as ContractService
    const apiKey = process.env.SMARTIT_API_SECRET_KEY || ''
    await signIn.sign(apiKey, Number(application.getContractId()))
    const vehicleId = application.getVehicleId?.()
    const vehicleUUID = vehicleId ? getUUID('Vehicle ID not available', vehicleId) : undefined

    const userId = application.getUserId?.()
    const userUUID = userId ? getUUID('User ID not available', userId) : undefined

    if (!vehicleUUID || !userUUID) {
      throw new DispatchValidationError('User ID or Vehicle ID is missing')
    }

    const existingLeasing = await leasingRepository.findActiveLeasing(userUUID, vehicleUUID)
    if (existingLeasing) {
      throw new DispatchValidationError('An active leasing already exists for this user and vehicle.')
    }

    const locationUUID = application.getAddressId?.()
      ? getUUID('Invalid address ID', application.getAddressId())
      : undefined

    const newLeasing = new LeasingEntity({
      id: new UUID(),
      userId: new UserId(userUUID.toDTO()),
      vehicleId: vehicleUUID,
      startDate: new DateTimeValue(new Date()),
      endDate: getDefaultEndDate(),
      createdAt: new DateTimeValue(new Date()),
      locationId: locationUUID,
      expiredAt: undefined,
    })

    await leasingRepository.save(newLeasing)

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.VEHICLE_HANDOFF,
    })

    await services.prospectService.logActivity({
      userId,
      prospectId: application.getProspectId(),
      prospectActivityTypeId: ProspectActivityTypeId.PROSPECT_CONVERTED,
    })

    await services.prospectService.updateStatus({
      userId,
      prospectId: application.getProspectId(),
      prospectStatusId: ProspectStatusId.PROSPECT_CLOSED,
    })

    return true
  },

  decline: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    return true
  },
}
