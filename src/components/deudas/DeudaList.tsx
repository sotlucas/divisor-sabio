"use client";

import { DataTable } from "../shared/DataTable";
import { columns } from "./columns";

export default function DeudaList({ deudas }: { deudas: any[] }) {
  return (
    <div className="mt-5">
      <DataTable columns={columns} data={deudas} />
    </div>
  );
}
