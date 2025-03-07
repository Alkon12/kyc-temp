-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "browserName" TEXT,
ADD COLUMN     "browserVersion" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "deviceModel" TEXT,
ADD COLUMN     "deviceType" TEXT,
ADD COLUMN     "deviceVendor" TEXT,
ADD COLUMN     "engineName" TEXT,
ADD COLUMN     "engineVersion" TEXT,
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false;
