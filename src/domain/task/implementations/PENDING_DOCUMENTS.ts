import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '@domain/task/models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { UUID } from '@domain/shared/UUID'

export const PENDING_DOCUMENTS: TaskTypeConfig = {
  validation: (args, services) => {
    const application = args.task.getApplication()
    if (!application) return new DispatchValidationError('Application inexistent or inactive')
    if (!application.getQuote()?.getScoringComplete())
      return new DispatchValidationError('Quote with scoring incomplete')

    return null
  },
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const applicationId = application.getId()._value;

    const checklistEntries = await services.prisma.applicationChecklist.findMany({
      where: {
        applicationId,
        checklistId: { in: ["UBER_DRIVER", "UBER_VEHICLE"] },
      },
      orderBy: { id: 'asc' },
    });

    const checklistEntryDriver = checklistEntries.find(entry => entry.checklistId === "UBER_DRIVER");
    const checklistEntryVehicle = checklistEntries.find(entry => entry.checklistId === "UBER_VEHICLE");

    if (!checklistEntryDriver || !checklistEntryVehicle) {
      throw new DispatchValidationError('Checklist entry not found for the required types.');
    }

    const checklistIdDriver = new UUID(checklistEntryDriver.id);
    const checklistIdVehicle = new UUID(checklistEntryVehicle.id);

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.VEHICLE_DOCUMENTATION,
    });
    
    await services.taskService.create(
      {
        taskTypeId: TaskType.UBER_DRIVER_CONTRACT,
        applicationId: application.getId(),
        applicationChecklistId: checklistIdDriver,
      },
      [GroupId.BACKOFFICE],
    );

    await services.taskService.create(
      {
        taskTypeId: TaskType.UBER_VEHICLE_REGISTRATION,
        applicationId: application.getId(),
        applicationChecklistId: checklistIdVehicle,
      },
      [GroupId.BACKOFFICE],
    );

    await services.prisma.applicationChecklist.updateMany({
      where: {
        applicationId,
        checklistId: { in: ["UBER_DRIVER", "UBER_VEHICLE"] },
      },
      data: {
        startedAt: new Date(),
      },
    });

    return true
  },
}
