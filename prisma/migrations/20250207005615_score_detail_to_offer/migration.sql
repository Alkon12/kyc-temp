/*
  Warnings:

  - You are about to drop the `QuoteScoreDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuoteScoreDetail" DROP CONSTRAINT "QuoteScoreDetail_quoteId_fkey";

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "scoringDetails" TEXT;

-- DropTable
DROP TABLE "QuoteScoreDetail";
