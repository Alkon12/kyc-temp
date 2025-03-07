-- CreateTable
CREATE TABLE "QuoteScoreDetail" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "segmentResult" TEXT NOT NULL,

    CONSTRAINT "QuoteScoreDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuoteScoreDetail" ADD CONSTRAINT "QuoteScoreDetail_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
