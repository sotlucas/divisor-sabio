"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Evento, CompleteEvento } from "@/lib/db/schema/eventos";
import Modal from "@/components/shared/Modal";

import { useOptimisticEventos } from "@/app/(app)/eventos/useOptimisticEventos";
import { Button } from "@/components/ui/button";
import EventoForm from "./EventoForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (evento?: Evento) => void;

export default function EventoList({
  eventos,
   
}: {
  eventos: CompleteEvento[];
   
}) {
  const { optimisticEventos, addOptimisticEvento } = useOptimisticEventos(
    eventos,
     
  );
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
        title={activeEvento ? "Edit Evento" : "Create Evento"}
      >
        <EventoForm
          evento={activeEvento}
          addOptimistic={addOptimisticEvento}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticEventos.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticEventos.map((evento) => (
            <Evento
              evento={evento}
              key={evento.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Evento = ({
  evento,
  openModal,
}: {
  evento: CompleteEvento;
  openModal: TOpenModal;
}) => {
  const optimistic = evento.id === "optimistic";
  const deleting = evento.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("eventos")
    ? pathname
    : pathname + "/eventos/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{evento.nombre}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + evento.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No eventos
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new evento.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Eventos </Button>
      </div>
    </div>
  );
};
