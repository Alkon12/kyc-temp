-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "addressId" TEXT;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "extNumber" TEXT NOT NULL,
    "intNumber" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    
    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable to add new columns
ALTER TABLE "Address" ADD COLUMN "real_time_latitude" TEXT;
ALTER TABLE "Address" ADD COLUMN "real_time_longitude" TEXT;