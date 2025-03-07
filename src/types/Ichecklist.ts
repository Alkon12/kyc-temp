import { Checklist } from '@prisma/client'
import { IApplication } from './IApplication'
import { ITask } from './ITask'

export type IChecklist = Omit<Checklist, 'applications' | 'tasks'> & {
  applications: IApplication[]
  tasks: ITask[]
}
