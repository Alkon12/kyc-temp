-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_addressId_fkey";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
