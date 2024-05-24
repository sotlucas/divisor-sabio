"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { Balance } from "@/lib/api/calculadora/queries";
import BalanceList from "@/components/balances/BalanceList";
import { usePathname } from "next/navigation";

export default function OptimisticBalances({
  balances,
}: {
  balances: Balance[],
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Make it only visible in /deudas page
  if (pathname.split("/").at(-1) !== "deudas") {
    return null;
  }


  return (
    <>
      <Modal open={open} setOpen={setOpen} title="Balances">
        <BalanceList balances={balances} />
      </Modal>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Balances
      </Button>
    </>
  );
}
