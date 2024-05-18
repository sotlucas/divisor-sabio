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
}: {
  participantes: {
    id: string;
    name: string | null;
    email: string;
  }[];
  evento: Evento;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen} title="Participantes">
        <ParticipanteList participantes={participantes} evento={evento} />
      </Modal>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Participantes
      </Button>
    </div>
  );
}
