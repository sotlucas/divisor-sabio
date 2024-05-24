"use client";

import { DataTable } from "../shared/DataTable";
import { createColumns } from "./columns";

export default function DeudaList({ deudas, evento, participantes }: { deudas: any; evento: any; participantes: any }) {
  return (
    <div className="mt-5">
      <DataTable columns={createColumns(evento, participantes)} data={deudas} />
    </div>
  );
}
