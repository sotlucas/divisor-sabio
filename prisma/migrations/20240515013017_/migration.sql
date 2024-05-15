-- CreateTable
CREATE TABLE "_EventoToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventoToUser_AB_unique" ON "_EventoToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EventoToUser_B_index" ON "_EventoToUser"("B");

-- AddForeignKey
ALTER TABLE "_EventoToUser" ADD CONSTRAINT "_EventoToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventoToUser" ADD CONSTRAINT "_EventoToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
