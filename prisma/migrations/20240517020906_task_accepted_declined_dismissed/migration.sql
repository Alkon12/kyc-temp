-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "acceptedBy" TEXT,
ADD COLUMN     "declinedAt" TIMESTAMP(3),
ADD COLUMN     "declinedBy" TEXT,
ADD COLUMN     "dismissedBy" TEXT;
