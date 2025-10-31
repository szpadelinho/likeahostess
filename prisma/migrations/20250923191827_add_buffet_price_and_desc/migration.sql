-- AlterTable
ALTER TABLE "public"."Buffet" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Nothing is really known about this type of... uh... thing? I guess...',
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 5000;
