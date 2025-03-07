-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_quoteId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
