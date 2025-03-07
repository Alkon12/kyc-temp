/*
  Warnings:

  - Added the required column `quoteId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "quoteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
