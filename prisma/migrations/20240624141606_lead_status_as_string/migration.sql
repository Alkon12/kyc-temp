/*
  Warnings:

  - The `status` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "status",
ADD COLUMN     "status" TEXT;

-- DropEnum
DROP TYPE "LeadStatus";
