/*
  Warnings:

  - You are about to drop the column `monto` on the `GastoPendiente` table. All the data in the column will be lost.
  - You are about to drop the column `responsableId` on the `GastoPendiente` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GastoPendiente" DROP CONSTRAINT "GastoPendiente_responsableId_fkey";

-- AlterTable
ALTER TABLE "GastoPendiente" DROP COLUMN "monto",
DROP COLUMN "responsableId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "GastoPendiente" ADD CONSTRAINT "GastoPendiente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
