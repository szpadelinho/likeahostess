/*
  Warnings:

  - You are about to drop the column `description` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Activity" DROP COLUMN "description",
ALTER COLUMN "media" SET NOT NULL,
ALTER COLUMN "media" SET DATA TYPE TEXT;
