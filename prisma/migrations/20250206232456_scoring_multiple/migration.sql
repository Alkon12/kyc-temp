/*
  Warnings:

  - You are about to drop the column `requestedChecklist` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `scoreMark` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `scoreResolution` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `scoringResults` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "requestedChecklist" TEXT,
ADD COLUMN     "scoringAnalysis" TEXT,
ADD COLUMN     "scoringMark" TEXT,
ADD COLUMN     "scoringResult" TEXT;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "requestedChecklist",
DROP COLUMN "scoreMark",
DROP COLUMN "scoreResolution",
DROP COLUMN "scoringResults",
ADD COLUMN     "scoringRaw" TEXT,
ADD COLUMN     "scoringResolution" TEXT;
