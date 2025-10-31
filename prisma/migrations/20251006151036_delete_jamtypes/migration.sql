/*
  Warnings:

  - You are about to drop the column `type` on the `Jam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Jam" DROP COLUMN "type";

-- DropEnum
DROP TYPE "public"."JamType";
