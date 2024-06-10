/*
  Warnings:

  - You are about to drop the column `ResponsableId` on the `GastoPendiente` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GastoPendiente" DROP CONSTRAINT "GastoPendiente_ResponsableId_fkey";

-- AlterTable
ALTER TABLE "GastoPendiente" DROP COLUMN "ResponsableId",
ADD COLUMN     "responsableId" TEXT;

-- AddForeignKey
ALTER TABLE "GastoPendiente" ADD CONSTRAINT "GastoPendiente_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
