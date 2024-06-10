"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CompleteGasto, Gasto } from "@/lib/db/schema/gastos";
import Modal from "../shared/Modal";
import GastoForm from "./GastoForm";
import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/eventos/[eventoId]/useOptimisticGastos";
import { TooltipContent, TooltipProvider, Tooltip, TooltipTrigger } from "../ui/tooltip";

export const createColumns = (
  participantes: any[],
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
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => {
        return format(row.original.fecha as any, "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "pagador.name",
      header: "Pagado por",
    },
    {
      accessorKey: "deudas",
      header: "Deudores",
      cell: ({ row }) => {
        const deudas = (row.original as any).deudas;
        return deudas
          ?.map((deuda: any) => {
            return deuda.deudor.name;
          })
          .join(", ");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        // if (sessionUserId !== row.original.pagadorId && !isOwner) return null
        return <Actions row={row} participantes={participantes} />;
      },
    },
  ];
};

function Actions({ row, participantes }: any) {
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
          participantes={participantes}
          gasto={optimisticGasto}
          eventoId={row.original.eventoId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateGasto}
        />
      </Modal>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
