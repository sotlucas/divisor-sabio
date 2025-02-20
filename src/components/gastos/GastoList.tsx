"use client";

import { useState } from "react";

import { type Gasto, CompleteGasto } from "@/lib/db/schema/gastos";
import Modal from "@/components/shared/Modal";
import { type Evento, type EventoId } from "@/lib/db/schema/eventos";
import { useOptimisticGastos } from "@/app/(app)/eventos/[eventoId]/useOptimisticGastos";
import { Button } from "@/components/ui/button";
import GastoForm from "./GastoForm";
import { PlusIcon } from "lucide-react";
import { createColumns } from "./columns";
import { DataTable } from "../shared/DataTable";

type TOpenModal = (gasto?: Gasto) => void;

export default function GastoList({
  participantes,
  gastos,
  eventos,
  evento,
  sessionUserId,
}: {
  participantes: any[];
  gastos: CompleteGasto[];
  eventos: Evento[];
  evento?: Evento;
  sessionUserId: string;
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
    <div className="mt-5">
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeGasto ? "Editar gasto" : "Crear gasto"}
      >
        <GastoForm
          participantes={participantes}
          gasto={activeGasto}
          addOptimistic={addOptimisticGasto}
          openModal={openModal}
          closeModal={closeModal}
          eventoId={evento?.id}
        />
      </Modal>
      {optimisticGastos.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          columns={createColumns(
            participantes,
            sessionUserId,
            evento?.userId == sessionUserId
          )}
          data={optimisticGastos}
          searchable
        >
          <Button size="icon" variant="default" onClick={() => openModal()}>
            <PlusIcon className="w-4 h-4" />
          </Button>
        </DataTable>
      )}
    </div>
  );
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No hay gastos
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Empezá creando un nuevo gasto.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> Nuevo Gasto{" "}
        </Button>
      </div>
    </div>
  );
};
