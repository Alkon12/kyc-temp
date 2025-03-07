/*
  Warnings:

  - You are about to drop the `UserSlot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `meetLink` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('ACTIVE', 'CANCEL', 'FINISHED');

-- DropForeignKey
ALTER TABLE "UserSlot" DROP CONSTRAINT "UserSlot_idSlot_fkey";

-- DropForeignKey
ALTER TABLE "UserSlot" DROP CONSTRAINT "UserSlot_idUser_fkey";

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "meetLink" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserSlot";

-- DropEnum
DROP TYPE "UserSlotStatus";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "idSlot" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_idSlot_fkey" FOREIGN KEY ("idSlot") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
