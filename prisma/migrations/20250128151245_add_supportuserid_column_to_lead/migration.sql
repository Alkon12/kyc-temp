-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "addressProof" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "supportUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_supportUserId_fkey" FOREIGN KEY ("supportUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
