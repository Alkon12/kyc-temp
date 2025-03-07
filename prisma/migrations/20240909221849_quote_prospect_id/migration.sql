-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "prospectId" TEXT;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
