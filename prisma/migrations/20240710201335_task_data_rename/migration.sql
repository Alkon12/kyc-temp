/*
  Warnings:

  - You are about to drop the column `data` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "data",
ADD COLUMN     "customData" TEXT;
