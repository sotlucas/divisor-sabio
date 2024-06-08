"use client";

import { useState } from "react";

import { type GastoPendiente } from "@/lib/db/schema/gastoPendiente";
import Modal from "@/components/shared/Modal";

import { useOptimisticGastoPendientes } from "@/app/(app)/eventos/[eventoId]/useOptimisticGastoPendiente";
import { Button } from "@/components/ui/button";
import GastoPendienteForm from "./GastoPendienteForm";
import { PlusIcon } from "lucide-react";
import { DataTable } from "../shared/DataTable";
import { createColumns } from "./columns";

type TOpenModal = (gastosPendientes?: GastoPendiente) => void;

export default function GastoPendienteList({
  participantes,
  gastosPendientes,
  evento,
  sessionUserId,
}: {
  participantes: any;
  gastosPendientes: any;
  evento?: any;
  sessionUserId: string;
}) {
  const { optimisticGastoPendientes, addOptimisticGastoPendiente } =
    useOptimisticGastoPendientes(gastosPendientes);
  const [open, setOpen] = useState(false);
  const [activeGastoPendiente, setActiveGastoPendiente] =
    useState<GastoPendiente | null>(null);
  const openModal = (gastoPendiente?: GastoPendiente) => {
    setOpen(true);
    gastoPendiente
      ? setActiveGastoPendiente(gastoPendiente)
      : setActiveGastoPendiente(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeGastoPendiente
            ? "Editar gasto pendiente"
            : "Crear gasto pendiente"
        }
      >
        <GastoPendienteForm
          participantes={participantes}
          gastoPendiente={activeGastoPendiente}
          addOptimistic={addOptimisticGastoPendiente}
          openModal={openModal}
          closeModal={closeModal}
          eventoId={evento?.id}
        />
      </Modal>
      {optimisticGastoPendientes.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          columns={createColumns(
            participantes,
            sessionUserId,
            evento?.userId == sessionUserId
          )}
          data={optimisticGastoPendientes}
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
        No hay gastos pendientes
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Empezá creando un nuevo gasto pendiente
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> Nuevo gasto pendiente{" "}
        </Button>
      </div>
    </div>
  );
};
