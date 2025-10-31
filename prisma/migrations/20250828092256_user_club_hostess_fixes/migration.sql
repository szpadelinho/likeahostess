/*
  Warnings:

  - You are about to drop the column `hostessId` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `interior` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the `_ClubHostesses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ClubHostesses" DROP CONSTRAINT "_ClubHostesses_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClubHostesses" DROP CONSTRAINT "_ClubHostesses_B_fkey";

-- AlterTable
ALTER TABLE "public"."Club" DROP COLUMN "hostessId",
DROP COLUMN "interior";

-- DropTable
DROP TABLE "public"."_ClubHostesses";

-- CreateTable
CREATE TABLE "public"."UserClubHostess" (
    "id" TEXT NOT NULL,
    "userClubId" TEXT NOT NULL,
    "hostessId" TEXT NOT NULL,

    CONSTRAINT "UserClubHostess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserClubHostess_userClubId_hostessId_key" ON "public"."UserClubHostess"("userClubId", "hostessId");

-- AddForeignKey
ALTER TABLE "public"."UserClubHostess" ADD CONSTRAINT "UserClubHostess_userClubId_fkey" FOREIGN KEY ("userClubId") REFERENCES "public"."UserClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserClubHostess" ADD CONSTRAINT "UserClubHostess_hostessId_fkey" FOREIGN KEY ("hostessId") REFERENCES "public"."Hostess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
