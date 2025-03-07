import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'


export const VEHICLE_ASSURANCE: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) {
      throw new DispatchValidationError('Application inexistent or inactive');
    }

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.VEHICLE_DOCUMENTATION,
    });

    return true;
  },

  decline: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) {
      throw new DispatchValidationError('Application inexistent or inactive');
    }

    return true;
  },
};