/*
  Warnings:

  - Made the column `prospectStatusId` on table `Prospect` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Prospect" ALTER COLUMN "prospectStatusId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProspectActivity" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
