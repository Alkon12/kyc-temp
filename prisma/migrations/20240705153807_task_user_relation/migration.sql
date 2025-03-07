-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_acceptedBy_fkey" FOREIGN KEY ("acceptedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_declinedBy_fkey" FOREIGN KEY ("declinedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_dismissedBy_fkey" FOREIGN KEY ("dismissedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
