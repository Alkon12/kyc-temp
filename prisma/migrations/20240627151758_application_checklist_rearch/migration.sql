/*
  Warnings:

  - The primary key for the `ApplicationChecklist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `checklistId` on the `Task` table. All the data in the column will be lost.
  - The required column `id` was added to the `ApplicationChecklist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_applicationId_checklistId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_checklistId_fkey";

-- AlterTable
ALTER TABLE "ApplicationChecklist" DROP CONSTRAINT "ApplicationChecklist_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "parentId" VARCHAR(150),
ADD CONSTRAINT "ApplicationChecklist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "checklistId",
ADD COLUMN     "applicationChecklistId" TEXT;

-- AddForeignKey
ALTER TABLE "ApplicationChecklist" ADD CONSTRAINT "ApplicationChecklist_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ApplicationChecklist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_applicationChecklistId_fkey" FOREIGN KEY ("applicationChecklistId") REFERENCES "ApplicationChecklist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
