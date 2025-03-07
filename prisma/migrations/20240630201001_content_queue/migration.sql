-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "driversLicense" TEXT,
ADD COLUMN     "identificationCard" TEXT,
ADD COLUMN     "inactivityStatement" TEXT,
ADD COLUMN     "incomeStatement" TEXT,
ADD COLUMN     "selfiePicture" TEXT,
ADD COLUMN     "taxIdentification" TEXT;

-- CreateTable
CREATE TABLE "ContentQueue" (
    "id" TEXT NOT NULL,
    "contentProvider" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentQueue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContentQueue" ADD CONSTRAINT "ContentQueue_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
