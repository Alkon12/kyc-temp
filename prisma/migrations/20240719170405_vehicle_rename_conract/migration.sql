/*
  Warnings:

  - You are about to drop the column `assetContractId` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "assetContractId",
ADD COLUMN     "contractId" TEXT;
