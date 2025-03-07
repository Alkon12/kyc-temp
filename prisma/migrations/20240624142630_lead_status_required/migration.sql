/*
  Warnings:

  - Made the column `status` on table `Lead` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "status" SET NOT NULL;
