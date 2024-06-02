-- AlterTable
ALTER TABLE "Gasto" ADD COLUMN     "esDeudaPagada" BOOLEAN NOT NULL DEFAULT false;
UPDATE "Gasto" SET "esDeudaPagada" = false WHERE "nombre" = 'Deuda pagada';
