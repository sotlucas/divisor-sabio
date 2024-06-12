-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "eventoId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
