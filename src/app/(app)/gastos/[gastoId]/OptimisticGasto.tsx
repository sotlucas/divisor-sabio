"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/gastos/useOptimisticGastos";
import { type Gasto } from "@/lib/db/schema/gastos";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import GastoForm from "@/components/gastos/GastoForm";
import { type Evento, type EventoId } from "@/lib/db/schema/eventos";

export default function OptimisticGasto({
  gasto,
  eventos,
  eventoId,
}: {
  gasto: Gasto;
  eventos: Evento[];
  eventoId?: EventoId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Gasto) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticGasto, setOptimisticGasto] = useOptimistic(gasto);
  const updateGasto: TAddOptimistic = (input) =>
    setOptimisticGasto({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <GastoForm
          gasto={optimisticGasto}
          eventos={eventos}
          eventoId={eventoId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateGasto}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticGasto.nombre}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticGasto.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticGasto, null, 2)}
      </pre>
    </div>
  );
}
