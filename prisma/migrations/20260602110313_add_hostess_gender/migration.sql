-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Hostess" ADD COLUMN     "gender" "GenderType" NOT NULL DEFAULT 'FEMALE';
