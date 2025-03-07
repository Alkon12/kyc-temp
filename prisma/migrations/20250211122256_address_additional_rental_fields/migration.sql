-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "hasGarage" BOOLEAN,
ADD COLUMN     "isBillingAddress" BOOLEAN,
ADD COLUMN     "isRental" BOOLEAN,
ADD COLUMN     "rentalAmount" DOUBLE PRECISION,
ADD COLUMN     "timeLivingIn" TEXT;
