-- DropForeignKey
ALTER TABLE "ProspectActivity" DROP CONSTRAINT "ProspectActivity_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "Prospect" ADD COLUMN     "supportUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_supportUserId_fkey" FOREIGN KEY ("supportUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProspectActivity" ADD CONSTRAINT "ProspectActivity_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
