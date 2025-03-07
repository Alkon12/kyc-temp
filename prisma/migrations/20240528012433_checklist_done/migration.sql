-- AlterTable
ALTER TABLE "ApplicationChecklist" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedAt" TIMESTAMP(3);
