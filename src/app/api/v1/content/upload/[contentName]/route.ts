import { NextRequest, NextResponse } from 'next/server'
import container from '@infrastructure/inversify.config'
import { AuthService } from '@/application/service/AuthService'
import { DI } from '@infrastructure'
import { UnauthorizedError, ValidationError } from '@domain/error'
import { TaskService } from '@service/TaskService'
import { TaskAction } from '@domain/task/models/TaskAction'
import { ContentService } from '@/application/service/ContentService'
import { TaskType } from '@domain/task/models/TaskType'
import { ContentQueueService } from '@service/ContentQueueService'
import { ContentProvider } from '@domain/content/ContentProvider'
import { UUID } from '@domain/shared/UUID'
import { ContentNature } from '@domain/content/ContentNature'

export async function POST(request: NextRequest, { params }: { params: { contentName: string } }) {
  const contentNature = new ContentNature(params.contentName.toUpperCase())

  const userId = await container.get<AuthService>(DI.AuthService).getUserId(request)
  if (!userId) {
    throw new UnauthorizedError('no auth provided for this upload endpoint')
  }
  const taskService = container.get<TaskService>(DI.TaskService)
  const contentService = container.get<ContentService>(DI.ContentService)
  const contentQueueService = container.get<ContentQueueService>(DI.ContentQueueService)

  const formData = await request.formData()

  const taskId = formData.get('taskId')?.toString()
  if (!taskId || taskId === '') {
    throw new ValidationError('TaskId is missing')
  }

  const file = formData.get('document') as File
  if (!file) {
    throw new ValidationError('File is missing')
  }

  let originTask = await taskService.getById(new UUID(taskId))
  if (!originTask) {
    throw new ValidationError('Origin task is missing')
  }

  if (ContentNature.ADDRESS_PROOF.sameValueAs(contentNature)) {
    const pendingAddressProofTask = await taskService.getPendingByTypeAndApplication(originTask.getApplicationId()!, [
      TaskType.KYC_ADDRESS_PROOF_UPLOAD,
    ])
    originTask = pendingAddressProofTask[0]
    //taskId = originTask.getId().toDTO()
  }

  if (ContentNature.IDENTIFICATION_CARD_REVERSE.sameValueAs(contentNature)) {
    const pendingIdentificationCardTask = await taskService.getPendingByTypeAndApplication(
      originTask.getApplicationId()!,
      [TaskType.KYC_IDENTIFICATION_CARD_REVERSE_UPLOAD],
    )
    originTask = pendingIdentificationCardTask[0]
    //taskId = originTask.getId().toDTO()
  }

  if (ContentNature.DRIVERS_LICENSE_REVERSE.sameValueAs(contentNature)) {
    const pendingDriversLicenseTask = await taskService.getPendingByTypeAndApplication(originTask.getApplicationId()!, [
      TaskType.KYC_DRIVERS_LICENSE_REVERSE_UPLOAD,
    ])
    originTask = pendingDriversLicenseTask[0]
    //taskId = originTask.getId().toDTO()
  }

  if (originTask.isDone()) {
    throw new ValidationError('Origin task has been done already')
  }

  const jobTaskType = _getJobTaskTypeForContentNature(contentNature)
  if (!jobTaskType) {
    throw new ValidationError('Related Task type for job not found')
  }

  const jobId = await contentService.save(file, contentNature)

  const jobTask = await taskService.create({
    taskTypeId: jobTaskType,
    applicationId: originTask.getApplicationId(),
    applicationChecklistId: originTask.getApplicationChecklistId(),
  })

  await contentQueueService.create({
    taskId: jobTask.getId(),
    contentProvider: ContentProvider.PAPERLESS_TEST, // TODO multiple provider
    referenceKey: jobId,
  })

  //if(!ContentNature.ADDRESS_PROOF.sameValueAs(contentNature)){
  await taskService.move({
    userId,
    taskId: originTask.getId(),
    taskAction: TaskAction.ACCEPT,
  })

  return NextResponse.json({
    status: 200,
    contentName: contentNature.toDTO(),
  })
}

function _getJobTaskTypeForContentNature(contentNature?: ContentNature): TaskType | null {
  if (!contentNature) {
    return null
  }

  if (contentNature.sameValueAs(ContentNature.IDENTIFICATION_CARD)) {
    return TaskType.KYC_IDENTIFICATION_CARD_JOB
  }

  if (contentNature.sameValueAs(ContentNature.IDENTIFICATION_CARD_REVERSE)) {
    return TaskType.KYC_IDENTIFICATION_CARD_REVERSE_JOB
  }

  if (contentNature.sameValueAs(ContentNature.SELFIE_PICTURE)) {
    return TaskType.KYC_SELFIE_PICTURE_JOB
  }

  if (contentNature.sameValueAs(ContentNature.DRIVERS_LICENSE)) {
    return TaskType.KYC_DRIVERS_LICENSE_JOB
  }

  if (contentNature.sameValueAs(ContentNature.DRIVERS_LICENSE_REVERSE)) {
    return TaskType.KYC_DRIVERS_LICENSE_REVERSE_JOB
  }

  if (contentNature.sameValueAs(ContentNature.INCOME_STATEMENT)) {
    return TaskType.KYC_INCOME_STATEMENT_JOB
  }

  if (contentNature.sameValueAs(ContentNature.INACTIVITY_STATEMENT)) {
    return TaskType.KYC_INACTIVITY_STATEMENT_JOB
  }

  if (contentNature.sameValueAs(ContentNature.TAX_IDENTIFICATION)) {
    return TaskType.KYC_TAX_IDENTIFICATION_JOB
  }

  if (contentNature.sameValueAs(ContentNature.ADDRESS_PROOF)) {
    return TaskType.KYC_ADDRESS_PROOF_JOB
  }

  return null
}
