/*
  Warnings:

  - You are about to drop the column `cost` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `fatigue` on the `Hostess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Club" DROP COLUMN "cost";

-- AlterTable
ALTER TABLE "public"."Hostess" DROP COLUMN "fatigue";

-- CreateTable
CREATE TABLE "public"."UserHostess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hostessId" TEXT NOT NULL,
    "fatigue" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserHostess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserHostess_userId_hostessId_key" ON "public"."UserHostess"("userId", "hostessId");

-- AddForeignKey
ALTER TABLE "public"."UserHostess" ADD CONSTRAINT "UserHostess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserHostess" ADD CONSTRAINT "UserHostess_hostessId_fkey" FOREIGN KEY ("hostessId") REFERENCES "public"."Hostess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
