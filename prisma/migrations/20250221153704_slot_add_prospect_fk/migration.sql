-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
