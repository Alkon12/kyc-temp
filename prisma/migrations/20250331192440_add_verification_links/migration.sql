-- CreateTable
CREATE TABLE "VerificationLink" (
    "id" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "expiresAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationLink_token_key" ON "VerificationLink"("token");

-- CreateIndex
CREATE INDEX "idx_verification_links_verification" ON "VerificationLink"("verificationId");

-- CreateIndex
CREATE INDEX "idx_verification_links_token" ON "VerificationLink"("token");

-- AddForeignKey
ALTER TABLE "VerificationLink" ADD CONSTRAINT "VerificationLink_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "KycVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
