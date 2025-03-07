-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uberLastMonthEarnings" INTEGER,
ADD COLUMN     "uberLastMonthTripCount" INTEGER,
ADD COLUMN     "uberTenureMonths" INTEGER,
ADD COLUMN     "uberTier" TEXT;
