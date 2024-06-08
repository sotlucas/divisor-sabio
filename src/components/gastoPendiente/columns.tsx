"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CompleteGasto } from "@/lib/db/schema/gastos";
import Modal from "../shared/Modal";
import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/eventos/[eventoId]/useOptimisticGastoPendiente";
import GastoPendienteForm from "./GastoPendienteForm";
import { GastoPendiente } from "@/lib/db/schema/gastoPendiente";

export const createColumns = (
  participantes: any,
  sessionUserId: string,
  isOwner: Boolean
): ColumnDef<CompleteGasto>[] => {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "monto",
      header: "Monto",
      cell: ({ row }) => {
        return `$ ${row.original.monto.toFixed(2)}`;
      },
    },
    {
      accessorKey: "responsable.name",
      header: "Responsable",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        if (sessionUserId !== row.original.pagadorId && !isOwner) return null;
        return <Actions row={row} participantes={participantes} />;
      },
    },
  ];
};

function Actions({ row, participantes }: any) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: GastoPendiente) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticGasto, setOptimisticGasto] = useOptimistic(row.original);
  const updateGasto: TAddOptimistic = (input) =>
    setOptimisticGasto({ ...input.data });

  return (
    <div className="flex space-x-2">
      <Modal open={open} setOpen={setOpen} title="Editar gasto pendiente">
        <GastoPendienteForm
          participantes={participantes}
          gastoPendiente={optimisticGasto}
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
