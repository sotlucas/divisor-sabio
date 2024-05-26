"use client";

import { CompleteEvento } from "@/lib/db/schema/eventos";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const columns: ColumnDef<CompleteEvento>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "fechaInicio",
    header: "Fecha",
    cell: ({ row }) => {
      return format(row.original.fechaInicio as any, "dd/MM/yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

function Actions({ row }: any) {
  const pathname = usePathname();
  const basePath = pathname.includes("eventos")
    ? pathname
    : pathname + "/eventos/";

  return (
    <Link href={basePath + "/" + row.original.id}>
      <Button size="icon" variant="outline">
        <Eye className="h-4 w-4" />
      </Button>
    </Link>
  );
}
