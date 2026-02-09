-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('INQUIRY_START', 'INQUIRY_SERVICE', 'INQUIRY_END', 'CASINO', 'MASSAGE', 'ACTIVITY', 'LOAN', 'EFFECT');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "GameAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ActionType" NOT NULL,
    "status" "ActionStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),

    CONSTRAINT "GameAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameAction" ADD CONSTRAINT "GameAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
