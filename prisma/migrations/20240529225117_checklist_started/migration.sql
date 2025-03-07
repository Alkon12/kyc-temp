/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_applicationId_fkey";

-- AlterTable
ALTER TABLE "ApplicationChecklist" ADD COLUMN     "started" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Document";
