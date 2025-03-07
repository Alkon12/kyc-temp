import { ChecklistId } from '@domain/checklist/models/ChecklistId';
import { TaskTypeConfig } from '../TaskManager';
import { DispatchValidationError } from '../models/DispatchValidationError';
import { TaskType } from '../models/TaskType';
import { StringValue } from '@domain/shared/StringValue';
import { NotificationChannel } from '@domain/shared/NotificationChannel';
import { UUID } from '@domain/shared/UUID';
import { GroupId } from '@domain/user/models/GroupId';
import { messaging } from '../../../infrastructure/auth/firebase/firebase-admin-config';
import { BooleanValue } from '@domain/shared/BooleanValue';

export const KYC_DRIVERS_LICENSE_VERIFICATION: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) throw new DispatchValidationError('Application inexistent or inactive');

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.DRIVERS_LICENSE_VERIFICATION,
    });

    return true;
  },
  decline: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) throw new DispatchValidationError('Application inexistent or inactive');

    const applicationId = application.getId();

    const checklistEntry = await services.prisma.applicationChecklist.findFirst({
      where: {
        applicationId: applicationId._value,
        checklistId: "DRIVERS_LICENSE",
      },
      orderBy: { id: 'asc' },
    });

    if (!checklistEntry) {
      throw new DispatchValidationError('No se encontraron entradas en la tabla ApplicationChecklist para la aplicación especificada.');
    }

    if (checklistEntry?.completedAt !== null) {
      const verification = await services.prisma.applicationChecklist.findFirst({
        where: {
          applicationId: applicationId._value,
          checklistId: "DRIVERS_LICENSE_VERIFICATION",
        },
        orderBy: { id: 'asc' },
      });

      const checklistId = new UUID(verification?.id);

      await services.taskService.create(
        {
          taskTypeId: TaskType.KYC_DRIVERS_LICENSE_VERIFICATION,
          applicationId: application.getId(),
          applicationChecklistId: checklistId,
        },
        [GroupId.BACKOFFICE]
      );
    }

    await services.prisma.applicationChecklist.updateMany({
      where: {
        applicationId: applicationId._value,
        checklistId: "DRIVERS_LICENSE",
      },
      data: {
        completedAt: null,
      },
    });

    const checklistId = new UUID(checklistEntry.id);
    await services.taskService.create({
      taskTypeId: TaskType.KYC_DRIVERS_LICENSE_UPLOAD,
      applicationId: application.getId(),
      assignedUserId: application.getUserId(),
      applicationChecklistId: checklistId,
      originTaskId: args.task.getId(),
    });

    await services.taskService.create({
      taskTypeId: TaskType.KYC_DRIVERS_LICENSE_REVERSE_UPLOAD,
      applicationId: application.getId(),
      assignedUserId: undefined, // TODO: Asign to user, must sync with app release
      applicationChecklistId: checklistId,
      originTaskId: args.task.getId(),
      optional: new BooleanValue(true)
    });

    await services.notificationService.sendToUser(application.getUserId(), {
      channel: [NotificationChannel.EMAIL],
      title: new StringValue('Necesitamos que vuelvas a cargar tu licencia de conducir'),
      content: new StringValue(`Motivo: ${args.metadata?.message?.toDTO() ?? 'sin especificar'}`),
    });

    await sendFirebaseNotification(application.getUserId()?._value, 'Necesitamos que vuelvas a cargar tu licencia de conducir', `Motivo: ${args.metadata?.message?.toDTO() ?? 'sin especificar'}`, services);

    return true;
  },
};

async function sendFirebaseNotification(userId: string, title: string, body: string, services: any) {
  const deviceTokens = await services.prisma.deviceToken.findMany({
    where: {
      userId: userId,
    },
  });

  if (deviceTokens && deviceTokens.length > 0) {
    for (const tokenRecord of deviceTokens) {
      const message = {
        notification: {
          title,
          body,
        },
        token: tokenRecord.token,
      };

      try {
        await messaging.send(message);
        console.log(`Notificación de Firebase enviada correctamente al token: ${tokenRecord.token}`);
      } catch (error) {
        console.error(`Error al enviar la notificación al token ${tokenRecord.token}:`, error);
      }
    }
  } else {
    console.error('No se encontraron tokens de dispositivo para el usuario:', userId);
  }
}