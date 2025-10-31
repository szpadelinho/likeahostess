/*
  Warnings:

  - Added the required column `image` to the `Buffet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Buffet" ADD COLUMN     "image" TEXT NOT NULL;
