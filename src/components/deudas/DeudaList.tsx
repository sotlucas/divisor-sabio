"use client";

import { DataTable } from "../shared/DataTable";
import { createColumns } from "./columns";

export default function DeudaList({
  deudas,
  evento,
  participantes,
}: {
  deudas: any;
  evento: any;
  participantes: any;
}) {
  return (
    <div className="mt-5">
      {deudas?.length === 0 ? (
        <div className="text-center">
          <p className="mt-1 text-sm text-muted-foreground">
            Todas las deudas fueron saldadas 🥳
          </p>
        </div>
      ) : (
        <DataTable
          columns={createColumns(evento, participantes)}
          data={deudas}
        />
      )}
    </div>
  );
}
