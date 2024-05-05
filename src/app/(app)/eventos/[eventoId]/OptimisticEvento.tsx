"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/eventos/useOptimisticEventos";
import { type Evento } from "@/lib/db/schema/eventos";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import EventoForm from "@/components/eventos/EventoForm";

export default function OptimisticEvento({ evento }: { evento: Evento }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Evento) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticEvento, setOptimisticEvento] = useOptimistic(evento);
  const updateEvento: TAddOptimistic = (input) =>
    setOptimisticEvento({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen} title="Editar evento">
        <EventoForm
          evento={optimisticEvento}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateEvento}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticEvento.nombre}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Editar
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticEvento.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticEvento, null, 2)}
      </pre>
    </div>
  );
}
