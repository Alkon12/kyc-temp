-- DropForeignKey
ALTER TABLE "ContentQueue" DROP CONSTRAINT "ContentQueue_taskId_fkey";

-- AlterTable
ALTER TABLE "ContentQueue" ALTER COLUMN "taskId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ContentQueue" ADD CONSTRAINT "ContentQueue_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
