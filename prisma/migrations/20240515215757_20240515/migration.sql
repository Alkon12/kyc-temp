/*
  Warnings:

  - You are about to drop the `ScheduleSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('AVAIBLE', 'UNAVAIBLE');

-- CreateEnum
CREATE TYPE "UserSlotStatus" AS ENUM ('ACTIVE', 'CANCEL', 'FINISHED');

-- DropTable
DROP TABLE "ScheduleSlot";

-- DropTable
DROP TABLE "ScheduleStatus";

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "idSchedule" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "status" "SlotStatus" NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSlot" (
    "id" TEXT NOT NULL,
    "idSlot" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "status" "UserSlotStatus" NOT NULL,

    CONSTRAINT "UserSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_idSchedule_fkey" FOREIGN KEY ("idSchedule") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSlot" ADD CONSTRAINT "UserSlot_idSlot_fkey" FOREIGN KEY ("idSlot") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSlot" ADD CONSTRAINT "UserSlot_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
