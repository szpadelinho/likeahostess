/*
  Warnings:

  - You are about to drop the column `cover` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `Club` table. All the data in the column will be lost.
  - Added the required column `exterior` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Activity" ALTER COLUMN "cost" SET DEFAULT 1000;

-- AlterTable
ALTER TABLE "public"."Club" DROP COLUMN "cover",
DROP COLUMN "popularity",
ADD COLUMN     "exterior" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Host" ALTER COLUMN "surname" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Hostess" ALTER COLUMN "surname" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Performer" ALTER COLUMN "surname" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."UserClub" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "money" INTEGER NOT NULL DEFAULT 100000,
    "popularity" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "UserClub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserClub_userId_clubId_key" ON "public"."UserClub"("userId", "clubId");

-- AddForeignKey
ALTER TABLE "public"."UserClub" ADD CONSTRAINT "UserClub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserClub" ADD CONSTRAINT "UserClub_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "public"."Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
