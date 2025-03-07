/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `TaskTypeGroup` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `TaskTypeGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TaskTypeGroup" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";
