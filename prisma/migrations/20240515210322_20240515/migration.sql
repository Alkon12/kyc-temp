/*
  Warnings:

  - You are about to drop the column `advisorId` on the `ScheduleSlot` table. All the data in the column will be lost.
  - You are about to drop the `Advisor` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ScheduleSlot" DROP COLUMN "advisorId";

-- DropTable
DROP TABLE "Advisor";
