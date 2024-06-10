/*
  Warnings:

  - You are about to drop the column `userId` on the `GastoPendiente` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GastoPendiente" DROP CONSTRAINT "GastoPendiente_userId_fkey";

-- AlterTable
ALTER TABLE "GastoPendiente" DROP COLUMN "userId",
ADD COLUMN     "ResponsableId" TEXT;

-- AddForeignKey
ALTER TABLE "GastoPendiente" ADD CONSTRAINT "GastoPendiente_ResponsableId_fkey" FOREIGN KEY ("ResponsableId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
