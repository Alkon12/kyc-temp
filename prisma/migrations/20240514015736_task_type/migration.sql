/*
  Warnings:

  - Added the required column `taskTypeId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "taskTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TaskType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dismissible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TaskType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "TaskType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
