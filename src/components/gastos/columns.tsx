"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CompleteGasto, Gasto } from "@/lib/db/schema/gastos";
import Modal from "../shared/Modal";
import GastoForm from "./GastoForm";
import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/gastos/useOptimisticGastos";

export const columns: ColumnDef<CompleteGasto>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "monto",
    header: "Monto",
    cell: ({ row }) => {
      return `$ ${row.original.monto}`;
    },
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      return format(row.original.fecha as any, "MM/dd/yyyy");
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
  const [open, setOpen] = useState(false);
  const openModal = (_?: Gasto) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticGasto, setOptimisticGasto] = useOptimistic(row.original);
  const updateGasto: TAddOptimistic = (input) =>
    setOptimisticGasto({ ...input.data });

  return (
    <div className="flex space-x-2">
      <Modal open={open} setOpen={setOpen} title="Editar gasto">
        <GastoForm
          gasto={optimisticGasto}
          eventos={[]}
          eventoId={row.original.eventoId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateGasto}
        />
      </Modal>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
}
