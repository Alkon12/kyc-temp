/*
  Warnings:

  - You are about to drop the column `checklistGroupId` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the `ChecklistGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_checklistGroupId_fkey";

-- AlterTable
ALTER TABLE "Checklist" DROP COLUMN "checklistGroupId";

-- DropTable
DROP TABLE "ChecklistGroup";
