/*
  Warnings:

  - You are about to drop the `UserClubHostess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserClubHostess" DROP CONSTRAINT "UserClubHostess_hostessId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserClubHostess" DROP CONSTRAINT "UserClubHostess_userClubId_fkey";

-- DropTable
DROP TABLE "public"."UserClubHostess";
