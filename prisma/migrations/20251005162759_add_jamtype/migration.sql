-- CreateEnum
CREATE TYPE "public"."JamType" AS ENUM ('Club', 'Profile', 'Auth', 'Selection', 'Tutorial', 'Casino', 'Loan', 'NewSerena');

-- AlterTable
ALTER TABLE "public"."Jam" ADD COLUMN     "type" "public"."JamType" NOT NULL DEFAULT 'Club';
