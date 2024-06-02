"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { Balance } from "@/lib/api/calculadora/queries";
import BalanceList from "@/components/balances/BalanceList";
import { usePathname } from "next/navigation";
import DeudaForm from "@/components/deudas/DeudaForm";

export default function OptimisticLiquidarDeudas({ participantes, eventoId
}: {
  participantes: {
    id: string;
    name: string | null;
    email: string;
  }[];
  eventoId: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Make it only visible in /deudas page
  if (pathname.split("/").at(-1) !== "deudas") {
    return null;
  }


  return (
    <>
      <Modal open={open} setOpen={setOpen} title="Liquidar deudas">
        <DeudaForm
          participantes={participantes}
          eventoId={eventoId}
          closeModal={() => setOpen(false)}
        />
      </Modal>
      <Button onClick={() => setOpen(true)}>
        Liquidar deudas
      </Button>
    </>
  );
}
