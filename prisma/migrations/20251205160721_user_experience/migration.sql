/*
  Warnings:

  - You are about to drop the column `money` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "money",
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0;
