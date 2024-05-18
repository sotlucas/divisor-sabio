"use client";

import { CompleteUser } from "prisma/zod/user";
import { DataTable } from "../shared/DataTable";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import Modal from "../shared/Modal";
import { Trash2 } from "lucide-react";
import { Evento } from "@/lib/db/schema/eventos";
import { deleteParticipantAction } from "@/lib/actions/eventos";
import { toast } from "sonner";
import { useOptimisticParticipantes } from "@/app/(app)/eventos/[eventoId]/useOptimisticParticipantes";

// TODO: Change participantes type
export default function ParticipanteList({
  participantes,
  evento,
}: {
  participantes: {
    name: string | null;
    email: string;
  }[];
  evento: Evento;
}) {
  const { optimisticParticipantes, addOptimisticParticipantes } =
    useOptimisticParticipantes(participantes);
  return (
    <div>
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Nombre",
          },
          {
            accessorKey: "email",
            header: "Email",
          },
          {
            id: "actions",
            cell: ({ row }) => {
              return (
                <Actions
                  row={row}
                  evento={evento}
                  addOptimistic={addOptimisticParticipantes}
                />
              );
            },
          },
        ]}
        data={optimisticParticipantes}
      />
    </div>
  );
}

function Actions({ row, addOptimistic, evento }: any) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const [pending, startMutation] = useTransition();

  const deleteParticipant = () => {
    startMutation(async () => {
      addOptimistic && addOptimistic({ action: "delete", data: row.original });
      await deleteParticipantAction(evento.id, row.original.id);
      closeModal();
      toast.success("Participante eliminado");
    });
  };

  return (
    <div className="flex space-x-2">
      <Modal
        open={open}
        setOpen={setOpen}
        title="¿Estas seguro de eliminar al participante?"
      >
        <div className="flex space-x-2">
          <Button variant="destructive" onClick={deleteParticipant}>
            Confirmar
          </Button>
          <Button variant="outline" onClick={() => closeModal()}>
            Cancelar
          </Button>
        </div>
      </Modal>
      <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
