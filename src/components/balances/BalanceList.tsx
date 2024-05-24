"use client";

import { DataTable } from "../shared/DataTable";
import { columns } from "./columns";

export default function BalanceList({ balances }: { balances: any[] }) {
  return (
    <div className="mt-5">
      <DataTable columns={columns} data={balances} />
    </div>
  );
}
