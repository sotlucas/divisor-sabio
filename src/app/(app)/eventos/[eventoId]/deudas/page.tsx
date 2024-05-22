import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import { checkAuth } from "@/lib/auth/utils";
import DeudaList from "@/components/deudas/DeudaList";
import { getBalancesByEvento } from "@/lib/api/calculadora/queries";
import { log } from "console";
import BalanceList from "@/components/balances/BalanceList";

export const revalidate = 0;

export default async function DeudasPage({
  params,
}: {
  params: { eventoId: string };
}) {
  return (
    <main className="overflow-auto">
      <Deudas id={params.eventoId} />
    </main>
  );
}

const Deudas = async ({ id }: { id: string }) => {
  await checkAuth();

  const { evento } = await getEventoByIdWithGastos(id);
  const { balances } = await getBalancesByEvento(id);

  if (!evento) notFound();
  return (
    <div className="relative mt-8">
      <h3 className="text-xl font-medium mb-4">Balances</h3>
      <BalanceList balances={balances} />
      <h3 className="text-xl font-medium mt-8 mb-4">Deudas</h3>
      <DeudaList deudas={[]} />
    </div>
  );
};
