-- AddForeignKey
ALTER TABLE "ProspectActivity" ADD CONSTRAINT "ProspectActivity_prospectStatusId_fkey" FOREIGN KEY ("prospectStatusId") REFERENCES "ProspectStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
