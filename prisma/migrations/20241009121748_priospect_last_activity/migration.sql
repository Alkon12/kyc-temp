-- AlterTable
ALTER TABLE "Prospect" ADD COLUMN     "lastActivityUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_lastActivityUserId_fkey" FOREIGN KEY ("lastActivityUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
