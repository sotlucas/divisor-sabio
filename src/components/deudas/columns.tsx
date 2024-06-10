import { ColumnDef } from "@tanstack/react-table";
import Modal from "../shared/Modal";
import { Button } from "../ui/button";
import DeudaForm from "./DeudaForm";
import { useState } from "react";
import { CompleteDeuda } from "prisma/zod/deuda";
import { Receipt } from "lucide-react";
import { Tooltip } from "@/components/shared/Tooltip";

export const createColumns = (
  evento: any[],
  participantes: any[]
): ColumnDef<CompleteDeuda>[] => {
  return [
    {
      accessorKey: "deudor.nombre",
      header: "Deudor",
    },
    {
      accessorKey: "receptor.nombre",
      header: "Receptor",
    },
    {
      accessorKey: "monto",
      header: "Monto",
      cell: ({ row }: any) => {
        return `$ ${row.original.monto.toFixed(2)}`;
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        return (
          <Actions row={row} evento={evento} participantes={participantes} />
        );
      },
    },
  ];
};

function Actions({ row, evento, participantes }: any) {
  const [open, setOpen] = useState(false);

  const { deudor, receptor, monto } = row.original;

  return (
    <div className="flex space-x-2">
      <>
        <Modal open={open} setOpen={setOpen} title="Liquidar deudas">
          <DeudaForm
            participantes={participantes}
            eventoId={evento.id}
            deudorId={deudor.id}
            receptorId={receptor.id}
            monto={monto.toString()}
            liquidatingEntireDeuda={true}
            closeModal={() => setOpen(false)}
          />
        </Modal>
        <Tooltip text="Liquidar deuda">
          <Button size="icon" variant="outline" onClick={() => setOpen(true)}>
            <Receipt className="h-4 w-4" />
          </Button>
        </Tooltip>
      </>
    </div>
  );
}
