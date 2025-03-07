-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "paperlessTaskId" TEXT,
    "paperlessDocumentId" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
