/*
  Warnings:

  - You are about to drop the column `address` on the `KycPerson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KycPerson" DROP COLUMN "address",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "colony" TEXT,
ADD COLUMN     "curp" TEXT,
ADD COLUMN     "secondLastName" TEXT,
ADD COLUMN     "secondName" TEXT,
ADD COLUMN     "street" TEXT;
