-- AlterTable
ALTER TABLE "ApplicationChecklist" ADD COLUMN     "dismissedAt" TIMESTAMP(3),
ADD COLUMN     "dismissedBy" TEXT,
ADD COLUMN     "dismissedMessage" TEXT,
ADD COLUMN     "dismissible" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "ApplicationChecklist" ADD CONSTRAINT "ApplicationChecklist_dismissedBy_fkey" FOREIGN KEY ("dismissedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
