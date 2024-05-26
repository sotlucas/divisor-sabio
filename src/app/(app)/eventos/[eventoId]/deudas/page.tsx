import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import { checkAuth } from "@/lib/auth/utils";
import DeudaList from "@/components/deudas/DeudaList";
import { Balance, getBalancesByEvento } from "@/lib/api/calculadora/queries";
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

// calculate the minumum number of transactions to settle all debts
const calcularDeudas = (balances: Balance[]) => {
  // Deep copy balances
  balances = balances.map((b) => ({ ...b }));

  const deudas = balances.filter((b) => b.balance < 0);
  const prestamos = balances.filter((b) => b.balance > 0);

  deudas.sort((a, b) => a.balance - b.balance);
  prestamos.sort((a, b) => b.balance - a.balance);

  const transactions: {
    deudor: { id: string; nombre: string };
    receptor: { id: string; nombre: string };
    monto: number;
  }[] = [];

  let i = 0;
  let j = 0;
  while (i < deudas.length && j < prestamos.length) {
    const deuda = deudas[i];
    const prestamo = prestamos[j];

    const amount = Math.min(-deuda.balance, prestamo.balance);
    deuda.balance += amount;
    prestamo.balance -= amount;

    transactions.push({
      deudor: { id: deuda.id, nombre: deuda.nombre },
      receptor: { id: prestamo.id, nombre: prestamo.nombre },
      monto: amount,
    });

    if (deuda.balance === 0) i++;
    if (prestamo.balance === 0) j++;
  }

  return { deudas: transactions };
};

const Deudas = async ({ id }: { id: string }) => {
  await checkAuth();

  const { evento, participantes } = await getEventoByIdWithGastos(id);
  const { balances } = await getBalancesByEvento(id);
  const { deudas } = calcularDeudas(balances);

  if (!evento) notFound();
  return (
    <div className="relative mt-8">
      <h3 className="text-xl font-medium mt-8 mb-4">Deudas</h3>
      <DeudaList
        deudas={deudas}
        evento={evento}
        participantes={participantes}
      />
    </div>
  );
};
