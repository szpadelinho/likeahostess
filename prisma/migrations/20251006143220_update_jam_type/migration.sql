/*
  Warnings:

  - The values [NewSerena] on the enum `JamType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."JamType_new" AS ENUM ('Club', 'Profile', 'Auth', 'Selection', 'Tutorial', 'Casino', 'Loan', 'Bar');
ALTER TABLE "public"."Jam" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."Jam" ALTER COLUMN "type" TYPE "public"."JamType_new" USING ("type"::text::"public"."JamType_new");
ALTER TYPE "public"."JamType" RENAME TO "JamType_old";
ALTER TYPE "public"."JamType_new" RENAME TO "JamType";
DROP TYPE "public"."JamType_old";
ALTER TABLE "public"."Jam" ALTER COLUMN "type" SET DEFAULT 'Club';
COMMIT;
