"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ParticipanteList from "@/components/participantes/ParticipanteList";
import { Evento } from "@/lib/db/schema/eventos";

// TODO: Change participantes type
export default function OptimisticParticipantes({
  participantes,
  evento,
  isOwner,
  ownerId,
  participantesConActividad
}: {
  participantes: {
    id: string;
    name: string | null;
    email: string;
  }[];
  evento: Evento;
  isOwner: Boolean;
  ownerId: string;
  participantesConActividad: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal open={open} setOpen={setOpen} title="Participantes">
        <ParticipanteList participantes={participantes} evento={evento} isOwner={isOwner} ownerId={ownerId} participantesConActividad={participantesConActividad} />
      </Modal>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Participantes
      </Button>
    </>
  );
}
