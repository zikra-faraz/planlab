/*
  Warnings:

  - You are about to drop the `UserOAuthAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserOAuthAccount" DROP CONSTRAINT "UserOAuthAccount_userId_fkey";

-- DropTable
DROP TABLE "UserOAuthAccount";
