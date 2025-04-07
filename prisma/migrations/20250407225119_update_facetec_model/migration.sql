/*
  Warnings:

  - You are about to drop the column `auditTrailImage` on the `FacetecResult` table. All the data in the column will be lost.
  - You are about to drop the column `confidenceScore` on the `FacetecResult` table. All the data in the column will be lost.
  - You are about to drop the column `faceScanSecurityLevel` on the `FacetecResult` table. All the data in the column will be lost.
  - You are about to drop the column `livenessScore` on the `FacetecResult` table. All the data in the column will be lost.
  - You are about to drop the column `lowQualityAuditTrailImage` on the `FacetecResult` table. All the data in the column will be lost.
  - You are about to drop the column `manualReviewReason` on the `FacetecResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FacetecResult" DROP COLUMN "auditTrailImage",
DROP COLUMN "confidenceScore",
DROP COLUMN "faceScanSecurityLevel",
DROP COLUMN "livenessScore",
DROP COLUMN "lowQualityAuditTrailImage",
DROP COLUMN "manualReviewReason",
ADD COLUMN     "enrollmentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "livenessStatus" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "matchLevel" DROP NOT NULL,
ALTER COLUMN "fullResponse" DROP NOT NULL;
