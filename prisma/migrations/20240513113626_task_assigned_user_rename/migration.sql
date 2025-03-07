/*
  Warnings:

  - You are about to drop the column `assignedToUserId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedToUserId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignedToUserId",
ADD COLUMN     "assignedUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
