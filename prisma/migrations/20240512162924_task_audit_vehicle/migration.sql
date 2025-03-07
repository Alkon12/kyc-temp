-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_productId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "color" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "vin" TEXT;

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "dismissible" BOOLEAN NOT NULL DEFAULT false,
    "dismissedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "flaggedAt" TIMESTAMP(3),
    "relevance" INTEGER NOT NULL,
    "assignedToUserId" TEXT,
    "userId" TEXT,
    "offerId" TEXT,
    "quoteId" TEXT,
    "applicationId" TEXT,
    "leasingId" TEXT,
    "vehicleId" TEXT,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskGroup" (
    "taskId" TEXT NOT NULL,
    "groupId" VARCHAR(40) NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "TaskGroup_pkey" PRIMARY KEY ("taskId","groupId")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "userId" TEXT,
    "taskId" TEXT,
    "offerId" TEXT,
    "quoteId" TEXT,
    "applicationId" TEXT,
    "leasingId" TEXT,
    "vehicleId" TEXT,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_leasingId_fkey" FOREIGN KEY ("leasingId") REFERENCES "Leasing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskGroup" ADD CONSTRAINT "TaskGroup_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskGroup" ADD CONSTRAINT "TaskGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_leasingId_fkey" FOREIGN KEY ("leasingId") REFERENCES "Leasing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
