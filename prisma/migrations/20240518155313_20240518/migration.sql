-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_idUser_fkey";

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
