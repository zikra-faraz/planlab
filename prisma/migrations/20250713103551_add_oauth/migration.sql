-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('google');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "salt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserOAuthAccount" (
    "userId" TEXT NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOAuthAccount_pkey" PRIMARY KEY ("providerAccountId","provider")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOAuthAccount_providerAccountId_key" ON "UserOAuthAccount"("providerAccountId");

-- AddForeignKey
ALTER TABLE "UserOAuthAccount" ADD CONSTRAINT "UserOAuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
