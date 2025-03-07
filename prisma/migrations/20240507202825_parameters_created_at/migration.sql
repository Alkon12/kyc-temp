/*
  Warnings:

  - Added the required column `status` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.


prisma migrate resolve --rolled-back "20240507202825_20240507_parameters_created_at"

*/
-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'DISQUALIFIED', 'OPPORTUNITY', 'CLOSED_WON', 'CLOSED_LOST', 'FOLLOW_UP_REQUIRED');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
