-- AlterTable
ALTER TABLE "Checklist" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Checklist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
