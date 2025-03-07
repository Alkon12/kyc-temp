/*
  Warnings:

  - You are about to drop the column `scoringResolution` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "scoringResolution" TEXT;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "scoringResolution";
