/*
  Warnings:

  - You are about to drop the column `idUserAssign` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `idUserCust` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_idUserAssign_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "idUserAssign",
ADD COLUMN     "idUserCust" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_idUserCust_fkey" FOREIGN KEY ("idUserCust") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
