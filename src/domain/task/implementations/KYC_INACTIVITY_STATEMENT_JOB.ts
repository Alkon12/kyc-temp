import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskManager, TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import container from '@infrastructure/inversify.config'
import ApplicationRepository from '@domain/application/ApplicationRepository'
import { DI } from '@infrastructure'
import { TaskType } from '../models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { UUID } from '@domain/shared/UUID'

export const KYC_INACTIVITY_STATEMENT_JOB: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) throw new DispatchValidationError('Application inexistent or inactive');

    const contentKey = TaskManager.getContentKeyFromTaskMetadata(args.metadata);
    if (contentKey) {
      application.setInactivityStatement(contentKey);

      const applicationRepository = container.get<ApplicationRepository>(DI.ApplicationRepository);
      await applicationRepository.save(application);
    }

    const applicationId = application.getId();

    const checklistEntry = await services.prisma.applicationChecklist.findFirst({
      where: {
        applicationId: applicationId._value,
        checklistId: "INACTIVITY_STATEMENT",
      },
    });

    if (checklistEntry?.completedAt !== null) {
      const verification = await services.prisma.applicationChecklist.findFirst({
        where: {
          applicationId: applicationId._value,
          checklistId: "INACTIVITY_STATEMENT_VERIFICATION",
        },
        orderBy: { id: 'asc' },
      });

      const checklistId = new UUID(verification?.id);
      
      await services.taskService.create(
        {
          taskTypeId: TaskType.KYC_INACTIVITY_STATEMENT_VERIFICATION,
          applicationId: application.getId(),
          applicationChecklistId: checklistId,
        },
        [GroupId.BACKOFFICE]
      );
    }

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.INACTIVITY_STATEMENT,
    });

    return true;
  },

  decline: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) throw new DispatchValidationError('Application inexistent or inactive');

    await services.taskService.create({
      taskTypeId: TaskType.KYC_INACTIVITY_STATEMENT_UPLOAD,
      applicationId: application.getId(),
      assignedUserId: application.getUserId(),
      applicationChecklistId: args.task.getApplicationChecklistId(),
      originTaskId: args.task.getId(),
    });

    return true;
  },
};