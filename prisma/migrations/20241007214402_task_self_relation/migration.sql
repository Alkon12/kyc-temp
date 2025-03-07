-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_originTaskId_fkey" FOREIGN KEY ("originTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
