import { ColumnDef } from "@tanstack/react-table";
import Modal from "../shared/Modal";
import { Button } from "../ui/button";
import DeudaForm from "./DeudaForm";
import { useState } from "react";
import { CompleteDeuda } from "prisma/zod/deuda";
import { Receipt } from "lucide-react";
import { ro } from "date-fns/locale";

export const createColumns = (
  evento: any[],
  participantes: any[]
): ColumnDef<CompleteDeuda>[] => {
  return [
    {
      accessorKey: "deudor",
      header: "Deudor",
    },
    {
      accessorKey: "receptor",
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
        return <Actions row={row} evento={evento} participantes={participantes} />;
      },
    },
  ]
}


function Actions({ row, evento, participantes }: any) {
  const [open, setOpen] = useState(false);

  const { deudor, receptor, monto } = row.original;

  const deudorId = participantes.find((p: { name: any; }) => p.name === deudor)?.id;
  const receptorId = participantes.find((p: { name: any; }) => p.name === receptor)?.id;

  return (
    <div className="flex space-x-2">
      <>
        <Modal open={open} setOpen={setOpen} title="Liquidar deudas">
          <DeudaForm
            participantes={participantes}
            eventoId={evento.id}
            deudor={deudor}
            deudorId={deudorId}
            receptor={receptor}
            receptorId={receptorId}
            monto={monto.toString()}
            liquidatingEntireDeuda={true}
            closeModal={() => setOpen(false)}
          />
        </Modal>
        <Button size="icon" variant="outline" onClick={() => setOpen(true)}>
          <Receipt className="h-5 w-5" />
        </Button>
      </>
    </div>
  );
}
