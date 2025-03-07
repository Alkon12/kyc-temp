-- AlterTable
ALTER TABLE "User" ADD COLUMN     "curp" TEXT,
ADD COLUMN     "driverLicenseNumber" TEXT,
ADD COLUMN     "driverLicensePermanent" BOOLEAN,
ADD COLUMN     "driverLicenseValidity" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "rfc" TEXT,
ADD COLUMN     "secondLastName" TEXT;
