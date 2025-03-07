/*
  Warnings:

  - A unique constraint covering the columns `[friendlyId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[friendlyId]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[friendlyId]` on the table `Leasing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[friendlyId]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "contractDate" TIMESTAMP(3),
ADD COLUMN     "contractId" TEXT,
ADD COLUMN     "friendlyId" TEXT,
ALTER COLUMN "idpersona" SET DATA TYPE TEXT,
ALTER COLUMN "quoteSmartItId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "friendlyId" TEXT;

-- AlterTable
ALTER TABLE "Leasing" ADD COLUMN     "friendlyId" TEXT;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "friendlyId" TEXT;

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "friendlyId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prospectStatusId" TEXT,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProspectStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProspectStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProspectActivity" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "prospectActivityTypeId" TEXT NOT NULL,
    "notes" TEXT,
    "createdByUserId" TEXT,

    CONSTRAINT "ProspectActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProspectActivityType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProspectActivityType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_friendlyId_key" ON "Prospect"("friendlyId");

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_userId_key" ON "Prospect"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_friendlyId_key" ON "Application"("friendlyId");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_friendlyId_key" ON "Lead"("friendlyId");

-- CreateIndex
CREATE UNIQUE INDEX "Leasing_friendlyId_key" ON "Leasing"("friendlyId");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_friendlyId_key" ON "Quote"("friendlyId");

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_prospectStatusId_fkey" FOREIGN KEY ("prospectStatusId") REFERENCES "ProspectStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProspectActivity" ADD CONSTRAINT "ProspectActivity_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProspectActivity" ADD CONSTRAINT "ProspectActivity_prospectActivityTypeId_fkey" FOREIGN KEY ("prospectActivityTypeId") REFERENCES "ProspectActivityType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProspectActivity" ADD CONSTRAINT "ProspectActivity_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
