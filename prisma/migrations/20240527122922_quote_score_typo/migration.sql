/*
  Warnings:

  - You are about to drop the column `scoreResult` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "scoreResult",
ADD COLUMN     "scoreResolution" TEXT;
