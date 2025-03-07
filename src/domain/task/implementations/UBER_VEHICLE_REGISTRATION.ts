import { ChecklistId } from '@domain/checklist/models/ChecklistId';
import { TaskTypeConfig } from '../TaskManager';
import { DispatchValidationError } from '../models/DispatchValidationError';
import { TaskType } from '../models/TaskType';
import { GroupId } from '@domain/user/models/GroupId';
import { UUID } from '@domain/shared/UUID';

export const UBER_VEHICLE_REGISTRATION: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) throw new DispatchValidationError('Application inexistent or inactive');

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.UBER_VEHICLE,
    });

    const applicationId = application.getId()._value;

    
    return true;
  },
  decline: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) throw new DispatchValidationError('Application inexistent or inactive');

    return true;
  },
};