/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_taskId_fkey";

-- DropTable
DROP TABLE "Document";
