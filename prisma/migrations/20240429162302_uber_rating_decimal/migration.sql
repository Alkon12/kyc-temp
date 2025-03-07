/*
  Warnings:

  - You are about to alter the column `uberRating` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(2,1)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uberRating" SET DATA TYPE DECIMAL(2,1);
