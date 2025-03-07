/*
  Warnings:

  - The values [NEW,QUALIFIED,DISQUALIFIED,OPPORTUNITY,CLOSED_WON,CLOSED_LOST,FOLLOW_UP_REQUIRED] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('ARRIVED', 'CONTACTED', 'DISMISSED', 'CONVERTED');
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "LeadStatus_old";
COMMIT;
