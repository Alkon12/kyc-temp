/*
  Warnings:

  - You are about to drop the column `scoringEngineVersion` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "scoringEngineVersion",
ADD COLUMN     "scoringEngine" TEXT;
