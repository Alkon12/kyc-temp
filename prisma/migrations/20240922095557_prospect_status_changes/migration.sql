-- AlterTable
ALTER TABLE "ProspectStatus" ADD COLUMN     "manualAssignable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "order" INTEGER;
