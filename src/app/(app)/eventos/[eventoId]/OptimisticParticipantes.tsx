"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ParticipanteList from "@/components/participantes/ParticipanteList";
import { CompleteUser } from "prisma/zod/user";

// TODO: Change participantes type
export default function OptimisticParticipantes({ participantes }: {
  participantes: {
    name: string | null;
    email: string;
  }[]
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen} title="Participantes">
        <ParticipanteList
          participantes={participantes}
        />
      </Modal>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Participantes
      </Button>
    </div>
  );
}
