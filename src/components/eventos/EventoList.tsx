"use client";

import { useState } from "react";
import { type Evento, CompleteEvento } from "@/lib/db/schema/eventos";
import Modal from "@/components/shared/Modal";

import { useOptimisticEventos } from "@/app/(app)/eventos/useOptimisticEventos";
import { Button } from "@/components/ui/button";
import EventoForm from "./EventoForm";
import { PlusIcon } from "lucide-react";
import { DataTable } from "../shared/DataTable";
import { columns } from "./columns";

type TOpenModal = (evento?: Evento) => void;

export default function EventoList({ eventos }: { eventos: CompleteEvento[] }) {
  const { optimisticEventos, addOptimisticEvento } =
    useOptimisticEventos(eventos);
  const [open, setOpen] = useState(false);
  const [activeEvento, setActiveEvento] = useState<Evento | null>(null);
  const openModal = (evento?: Evento) => {
    setOpen(true);
    evento ? setActiveEvento(evento) : setActiveEvento(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeEvento ? "Editar evento" : "Crear evento"}
      >
        <EventoForm
          evento={activeEvento}
          addOptimistic={addOptimisticEvento}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant="default" size="icon">
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      {optimisticEventos.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable columns={columns} data={optimisticEventos} />
      )}
    </div>
  );
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No hay eventos
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Empezá creando un nuevo evento.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> Nuevo Evento{" "}
        </Button>
      </div>
    </div>
  );
};
