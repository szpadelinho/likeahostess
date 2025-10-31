-- CreateEnum
CREATE TYPE "public"."BuffetType" AS ENUM ('Beverage', 'Meal');

-- CreateTable
CREATE TABLE "public"."Buffet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Nothing to see here',
    "type" "public"."BuffetType" NOT NULL,

    CONSTRAINT "Buffet_pkey" PRIMARY KEY ("id")
);
