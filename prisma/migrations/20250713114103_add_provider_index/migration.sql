/*
  Warnings:

  - The primary key for the `UserOAuthAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `UserOAuthAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserOAuthAccount" DROP CONSTRAINT "UserOAuthAccount_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "UserOAuthAccount_provider_providerAccountId_key" ON "UserOAuthAccount"("provider", "providerAccountId");
