/*
  Warnings:

  - You are about to drop the column `scoringResult` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "scoringResult",
ADD COLUMN     "scoringVerdict" TEXT;
