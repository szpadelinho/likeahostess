/*
  Warnings:

  - You are about to drop the column `userId` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `userClubId` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EffectType" AS ENUM ('DRAGON_OF_DOJIMA', 'LIFELINE_OF_KAMUROCHO', 'DRAGON_OF_KANSAI', 'SAFEKEEPER_OF_THE_TOJO_CLAN', 'FIGHTING_VIPER');

-- DropForeignKey
ALTER TABLE "public"."Loan" DROP CONSTRAINT "Loan_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Loan" DROP COLUMN "userId",
ADD COLUMN     "userClubId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Effect" (
    "id" TEXT NOT NULL,
    "userClubId" TEXT NOT NULL,
    "type" "public"."EffectType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Effect_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_userClubId_fkey" FOREIGN KEY ("userClubId") REFERENCES "public"."UserClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Effect" ADD CONSTRAINT "Effect_userClubId_fkey" FOREIGN KEY ("userClubId") REFERENCES "public"."UserClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;
