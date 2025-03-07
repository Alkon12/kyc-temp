/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `idToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccountId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `sessionState` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_account_id` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_provider_providerAccountId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "accessToken",
DROP COLUMN "expiresAt",
DROP COLUMN "idToken",
DROP COLUMN "providerAccountId",
DROP COLUMN "refreshToken",
DROP COLUMN "sessionState",
DROP COLUMN "tokenType",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" INTEGER,
ADD COLUMN     "id_token" TEXT,
ADD COLUMN     "provider_account_id" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "session_state" TEXT,
ADD COLUMN     "token_type" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "Account"("provider", "provider_account_id");
