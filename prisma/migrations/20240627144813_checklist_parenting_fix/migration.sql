/*
  Warnings:

  - You are about to alter the column `parentId` on the `Checklist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.

*/
-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_parentId_fkey";

-- AlterTable
ALTER TABLE "Checklist" ALTER COLUMN "parentId" SET DATA TYPE VARCHAR(150);

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Checklist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
