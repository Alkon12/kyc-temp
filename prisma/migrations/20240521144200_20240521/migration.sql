/*
  Warnings:

  - You are about to drop the column `idUserCust` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `applicationId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_idUserCust_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "idUserCust",
ADD COLUMN     "applicationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
