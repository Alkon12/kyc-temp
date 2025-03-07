-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "slotId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
