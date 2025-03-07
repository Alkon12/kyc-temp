-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_applicationId_checklistId_fkey" FOREIGN KEY ("applicationId", "checklistId") REFERENCES "ApplicationChecklist"("applicationId", "checklistId") ON DELETE SET NULL ON UPDATE CASCADE;
