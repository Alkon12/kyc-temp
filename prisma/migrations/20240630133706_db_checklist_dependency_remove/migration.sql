/*
  Warnings:

  - You are about to drop the `ChecklistDependency` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChecklistDependency" DROP CONSTRAINT "ChecklistDependency_checklistId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistDependency" DROP CONSTRAINT "ChecklistDependency_dependsOnId_fkey";

-- DropTable
DROP TABLE "ChecklistDependency";
