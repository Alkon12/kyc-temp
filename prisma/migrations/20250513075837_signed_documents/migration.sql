-- AlterTable
ALTER TABLE "KycVerification" ADD COLUMN     "requiresDocumentSigning" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DocusealTemplate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "docusealTemplateId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocusealTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignedDocument" (
    "id" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "docusealSubmissionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "signerEmail" TEXT,
    "signerPhone" TEXT,
    "documentUrl" TEXT,
    "additionalData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SignedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocusealTemplate_docusealTemplateId_key" ON "DocusealTemplate"("docusealTemplateId");

-- CreateIndex
CREATE INDEX "idx_docuseal_templates_company" ON "DocusealTemplate"("companyId");

-- CreateIndex
CREATE INDEX "idx_docuseal_templates_type" ON "DocusealTemplate"("documentType");

-- CreateIndex
CREATE UNIQUE INDEX "SignedDocument_docusealSubmissionId_key" ON "SignedDocument"("docusealSubmissionId");

-- CreateIndex
CREATE INDEX "idx_signed_documents_verification" ON "SignedDocument"("verificationId");

-- CreateIndex
CREATE INDEX "idx_signed_documents_status" ON "SignedDocument"("status");

-- AddForeignKey
ALTER TABLE "DocusealTemplate" ADD CONSTRAINT "DocusealTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignedDocument" ADD CONSTRAINT "SignedDocument_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "KycVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignedDocument" ADD CONSTRAINT "SignedDocument_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "DocusealTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
