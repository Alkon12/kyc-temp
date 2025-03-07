import { ChecklistDispatchServices } from '@domain/applicationChecklist/interfaces/ChecklistDispatchServices'
import { CompleteChecklistArgs } from '@domain/applicationChecklist/interfaces/CompleteChecklistArgs'
import { DismissChecklistArgs } from '@domain/applicationChecklist/interfaces/DismissChecklistArgs'
import { StartChecklistArgs } from '@domain/applicationChecklist/interfaces/StartChecklistArgs'

export type ChecklistConfig = {
  onStart?: (args: StartChecklistArgs, services: ChecklistDispatchServices) => Promise<boolean>
  onComplete?: (args: CompleteChecklistArgs, services: ChecklistDispatchServices) => Promise<boolean>
  onDismiss?: (args: DismissChecklistArgs, services: ChecklistDispatchServices) => Promise<boolean>
}
