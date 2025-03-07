-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_idSlot_fkey" FOREIGN KEY ("idSlot") REFERENCES "Slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
