-- AlterTable to add new columns
ALTER TABLE "Address" ADD COLUMN IF NOT EXISTS "real_time_latitude" TEXT;
ALTER TABLE "Address" ADD COLUMN IF NOT EXISTS "real_time_longitude" TEXT;