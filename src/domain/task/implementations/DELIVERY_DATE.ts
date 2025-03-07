import { ChecklistId } from '@domain/checklist/models/ChecklistId';
import { TaskTypeConfig } from '../TaskManager';
import { DispatchValidationError } from '../models/DispatchValidationError';
import { NotificationChannel } from '@domain/shared/NotificationChannel';
import { StringValue } from '@domain/shared/StringValue';
import { messaging } from '../../../infrastructure/auth/firebase/firebase-admin-config';
import { TaskType } from '@domain/task/models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { UUID } from '@domain/shared/UUID'

export const DELIVERY_DATE: TaskTypeConfig = {
  validation: (args, services) => {
    const application = args.task.getApplication();
    if (!application) return new DispatchValidationError('Application inexistent or inactive');
    if (!application.getQuote()?.getScoringComplete())
      return new DispatchValidationError('Quote with scoring incomplete');

    return null;
  },
  accept: async (args, services) => {
    const application = args.task.getApplication();
    if (!application) throw new DispatchValidationError('Application inexistent or inactive');

    const applicationId = application.getId()._value;

    const checklistEntries = await services.prisma.applicationChecklist.findMany({
      where: {
        applicationId,
        checklistId: { in: ["VEHICLE_DOCUMENTATION"] },
      },
      orderBy: { id: 'asc' },
    });

    const checklistEntryVehicleDocs = checklistEntries.find(entry => entry.checklistId === "VEHICLE_DOCUMENTATION");

    if (!checklistEntryVehicleDocs) {
      throw new DispatchValidationError('Checklist entry not found for VEHICLE_DOCUMENTATION.');
    }

    const checklistIdVehicleDocs = new UUID(checklistEntryVehicleDocs.id);

    await services.taskService.create(
      {
        taskTypeId: TaskType.PENDING_DOCUMENTS,
        applicationId: application.getId(),
        applicationChecklistId: checklistIdVehicleDocs,
      },
      [GroupId.BACKOFFICE],
    );

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.KYC_GOOD_TO_GO,
    });

    await services.notificationService.sendToUser(application.getUserId(), {
      channel: [NotificationChannel.EMAIL],
      title: new StringValue('Cita de entrega'),
      content: new StringValue('¡Felicidades!🥳🎉🎊, tu vehículo será entregado, ingresa a la App para ver los datos de tu cita.'),
    });

    await sendFirebaseNotification(application.getUserId()?._value, 'Cita de entrega', '¡Felicidades!🥳🎉🎊, tu vehículo será entregado, ingresa a la App para ver los datos de tu cita.', services);

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
