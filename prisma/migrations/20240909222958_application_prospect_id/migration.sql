-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "prospectId" TEXT;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
