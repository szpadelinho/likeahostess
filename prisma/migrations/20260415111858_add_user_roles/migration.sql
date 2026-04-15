-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('MANAGER', 'HOST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "RoleType" NOT NULL DEFAULT 'HOST';
