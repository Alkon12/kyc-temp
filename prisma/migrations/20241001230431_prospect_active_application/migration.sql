-- AlterTable
ALTER TABLE "Prospect" ADD COLUMN     "activeApplicationId" TEXT;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_activeApplicationId_fkey" FOREIGN KEY ("activeApplicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
