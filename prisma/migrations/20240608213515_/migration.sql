-- CreateTable
CREATE TABLE "GastoPendiente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "responsableId" TEXT,
    "eventoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GastoPendiente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GastoPendiente" ADD CONSTRAINT "GastoPendiente_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GastoPendiente" ADD CONSTRAINT "GastoPendiente_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
