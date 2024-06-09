"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Edit, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import Modal from "../shared/Modal";
import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/eventos/[eventoId]/useOptimisticGastoPendiente";
import GastoPendienteForm from "./GastoPendienteForm";
import {
  CompleteGastoPendiente,
  GastoPendiente,
} from "@/lib/db/schema/gastoPendiente";
import GastoForm from "../gastos/GastoForm";

export const createColumns = (
  participantes: any
): ColumnDef<CompleteGastoPendiente>[] => {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      id: "actions_create_gasto",
      cell: ({ row }) => {
        return <ActionsCreateGasto row={row} participantes={participantes} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <Actions row={row} />;
      },
    },
  ];
};

function ActionsCreateGasto({ row, participantes, id }: any) {
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
      <Modal open={open} setOpen={setOpen} title="Crear gasto">
        <GastoForm
          eventoId={row.original.eventoId}
          participantes={participantes}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateGasto}
          gasto_pendiente={{ id: row.original.id, nombre: row.original.nombre }}
        />
      </Modal>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <Receipt className="h-4 w-4" />
      </Button>
    </div>
  );
}


function Actions({ row }: any) {
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
