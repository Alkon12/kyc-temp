-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "redirectUrl" TEXT;

-- AlterTable
ALTER TABLE "DocusealTemplate" ADD COLUMN     "documents" JSONB,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "fields" JSONB,
ADD COLUMN     "folderName" TEXT,
ADD COLUMN     "schema" JSONB,
ADD COLUMN     "submitters" JSONB;
