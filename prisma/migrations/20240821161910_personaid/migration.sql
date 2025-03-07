/*
  Warnings:

  - You are about to alter the column `estimatedAcceleration` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `DoublePrecision`.
  - You are about to alter the column `liters` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "idpersona" INTEGER;
ALTER TABLE "Application" ADD COLUMN     "quoteSmartItId" INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "estimatedAcceleration" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "liters" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "trackerDeviceImei" TEXT;
