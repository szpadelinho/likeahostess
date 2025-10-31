/*
  Warnings:

  - Added the required column `cover` to the `Performer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Performer" ADD COLUMN     "cover" TEXT NOT NULL;
