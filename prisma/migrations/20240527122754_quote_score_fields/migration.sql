/*
  Warnings:

  - You are about to drop the column `scoringResult` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "scoringResult",
ADD COLUMN     "scoreMark" TEXT,
ADD COLUMN     "scoreResult" TEXT,
ADD COLUMN     "scoringError" BOOLEAN NOT NULL DEFAULT false;
