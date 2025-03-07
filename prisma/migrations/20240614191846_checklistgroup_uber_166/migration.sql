-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_applicationId_fkey";

-- AlterTable
ALTER TABLE "Checklist" ADD COLUMN     "checklistGroupId" VARCHAR(150),
ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "checklistId" TEXT;

-- CreateTable
CREATE TABLE "ChecklistGroup" (
    "id" VARCHAR(150) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ChecklistGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_checklistGroupId_fkey" FOREIGN KEY ("checklistGroupId") REFERENCES "ChecklistGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
