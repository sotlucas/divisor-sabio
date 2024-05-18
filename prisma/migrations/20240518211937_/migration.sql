-- DropForeignKey
ALTER TABLE "Deuda" DROP CONSTRAINT "Deuda_gastoId_fkey";

-- AddForeignKey
ALTER TABLE "Deuda" ADD CONSTRAINT "Deuda_gastoId_fkey" FOREIGN KEY ("gastoId") REFERENCES "Gasto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
