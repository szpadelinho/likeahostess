-- AlterTable
ALTER TABLE "public"."Buffet" ADD COLUMN     "icon" TEXT NOT NULL DEFAULT 'UtensilsCrossed';

-- AlterTable
ALTER TABLE "public"."Hostess" ADD COLUMN     "fatigue" INTEGER NOT NULL DEFAULT 0;
