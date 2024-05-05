"use client";

import { CompleteEvento } from "@/lib/db/schema/eventos";
import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      return format(row.original.fechaInicio, "MM/dd/yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      const pathname = usePathname();
      const basePath = pathname.includes("eventos")
        ? pathname
        : pathname + "/eventos/";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={basePath + "/" + row.original.id}>Ver evento</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
