/*
  Warnings:

  - You are about to drop the column `category` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `currentStep` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `requestingVehicleId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `uberProfileImageSrc` on the `Application` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_requestingVehicleId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "category",
DROP COLUMN "currentStep",
DROP COLUMN "requestingVehicleId",
DROP COLUMN "title",
DROP COLUMN "uberProfileImageSrc",
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "vehicleId" TEXT;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
