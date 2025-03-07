-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "hasAttachedApplication" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "hasAttachedApplication" BOOLEAN NOT NULL DEFAULT false;
