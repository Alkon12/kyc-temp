/*
  Warnings:

  - The values [ACTIVE,CANCEL,FINISHED] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `idUser` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `idUserAssign` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED', 'RESCHEDULED');
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "AppointmentStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_idUser_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "idUser",
ADD COLUMN     "idUserAssign" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_idUserAssign_fkey" FOREIGN KEY ("idUserAssign") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
