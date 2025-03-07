/*
  Warnings:

  - Made the column `prospectId` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "prospectId" SET NOT NULL;
