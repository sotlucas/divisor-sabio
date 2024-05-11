"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Gasto, CompleteGasto } from "@/lib/db/schema/gastos";
import Modal from "@/components/shared/Modal";
import { type Evento, type EventoId } from "@/lib/db/schema/eventos";
import { useOptimisticGastos } from "@/app/(app)/gastos/useOptimisticGastos";
import { Button } from "@/components/ui/button";
import GastoForm from "./GastoForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (gasto?: Gasto) => void;

export default function GastoList({
  gastos,
  eventos,
  eventoId,
}: {
  gastos: CompleteGasto[];
  eventos: Evento[];
  eventoId?: EventoId;
}) {
  const { optimisticGastos, addOptimisticGasto } = useOptimisticGastos(
    gastos,
    eventos
  );
  const [open, setOpen] = useState(false);
  const [activeGasto, setActiveGasto] = useState<Gasto | null>(null);
  const openModal = (gasto?: Gasto) => {
    setOpen(true);
    gasto ? setActiveGasto(gasto) : setActiveGasto(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeGasto ? "Edit Gasto" : "Create Gasto"}
      >
        <GastoForm
          gasto={activeGasto}
          addOptimistic={addOptimisticGasto}
          openModal={openModal}
          closeModal={closeModal}
          eventos={eventos}
          eventoId={eventoId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticGastos.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticGastos.map((gasto) => (
            <Gasto gasto={gasto} key={gasto.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Gasto = ({
  gasto,
  openModal,
}: {
  gasto: CompleteGasto;
  openModal: TOpenModal;
}) => {
  const optimistic = gasto.id === "optimistic";
  const deleting = gasto.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("gastos")
    ? pathname
    : pathname + "/gastos/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{gasto.nombre}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + gasto.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No gastos
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new gasto.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Gastos{" "}
        </Button>
      </div>
    </div>
  );
};
