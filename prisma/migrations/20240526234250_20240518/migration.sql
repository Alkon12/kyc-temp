/*
  Warnings:

  - You are about to drop the column `meetLink` on the `Slot` table. All the data in the column will be lost.
  - Added the required column `meetLink` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "meetLink" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "meetLink";
