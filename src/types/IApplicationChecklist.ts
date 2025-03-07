import { ApplicationChecklist } from '@prisma/client'
import { IApplication } from './IApplication'
import { ITask } from './ITask'
import { IChecklist } from './Ichecklist'

export type IApplicationChecklist = Omit<
  ApplicationChecklist,
  'application' | 'checklist' | 'createdAt' | 'updatedAt' | 'completedAt' | 'startedAt' | 'tasks' | 'childs' | 'parent'
> & {
  checklist: IChecklist
  createdAt: string
  updatedAt: string
  completedAt: string
  startedAt: string
  application: IApplication
  tasks: ITask[]
  parent: IApplicationChecklist
  childs: IApplicationChecklist[]
}
