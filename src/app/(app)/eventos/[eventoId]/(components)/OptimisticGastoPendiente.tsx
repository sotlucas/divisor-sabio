"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/eventos/[eventoId]/useOptimisticGastoPendiente";
import { type GastoPendiente } from "@/lib/db/schema/gastoPendiente";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import GastoPendienteForm from "@/components/gastoPendiente/GastoPendienteForm";

export default function OptimisticGastoPendiente({
  gastoPendiente,
}: {
  gastoPendiente: GastoPendiente;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: GastoPendiente) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticGastoPendiente, setOptimisticGastoPendiente] =
    useOptimistic(gastoPendiente);
  const updateGastoPendiente: TAddOptimistic = (input) =>
    setOptimisticGastoPendiente({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <GastoPendienteForm
          gastoPendiente={optimisticGastoPendiente}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateGastoPendiente}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {optimisticGastoPendiente.nombre}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticGastoPendiente.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticGastoPendiente, null, 2)}
      </pre>
    </div>
  );
}
