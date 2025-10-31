/*
  Warnings:

  - Added the required column `cover` to the `Hostess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Hostess" ADD COLUMN     "cover" TEXT NOT NULL;
