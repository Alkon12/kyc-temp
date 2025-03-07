/*
  Warnings:

  - You are about to drop the column `end_time` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `idSchedule` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `idUser` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `slotType` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_idSlot_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_idSchedule_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_idUser_fkey";

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "end_time",
DROP COLUMN "idSchedule",
DROP COLUMN "idUser",
DROP COLUMN "start_time",
DROP COLUMN "status",
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "free" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "guestUserId" TEXT,
ADD COLUMN     "hostUserId" TEXT,
ADD COLUMN     "slotType" TEXT NOT NULL,
ADD COLUMN     "startsAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "Schedule";

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_guestUserId_fkey" FOREIGN KEY ("guestUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
