import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import { checkAuth } from "@/lib/auth/utils";
import {
  Balance,
  GastoTotal,
  getBalancesByEvento,
  getGastosWithoutPayedDebtsByEvento,
} from "@/lib/api/calculadora/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Balances from "../(components)/Balances";
import GastosTotales from "../(components)/GastosTotales";
import DeudasPendientes from "../(components)/DeudasPendientes";

export const revalidate = 0;

export default async function EstadisticasPage({
  params,
}: {
  params: { eventoId: string };
}) {
  return (
    <main>
      <Estadisticas id={params.eventoId} />
    </main>
  );
}
function getGastosPagadosTotales(
  gastosTotales: GastoTotal[],
  balances: Balance[]
) {
  const gastoTotal = gastosTotales.reduce((acc, gasto) => acc + gasto.total, 0);
  const deudaTotal = balances
    .filter((balance) => balance.balance > 0)
    .reduce((acc, balance) => acc + balance.balance, 0);
  return { gastoTotal, deudaTotal };
}

const Estadisticas = async ({ id }: { id: string }) => {
  await checkAuth();

  const { evento, participantes } = await getEventoByIdWithGastos(id);
  const { balances } = await getBalancesByEvento(id);
  const { gastos: gastosTotales } = await getGastosWithoutPayedDebtsByEvento(
    id
  );

  const { gastoTotal, deudaTotal } = getGastosPagadosTotales(
    gastosTotales,
    balances
  );

  if (!evento) notFound();
  return (
    <div className="relative mt-8">
      <h3 className="text-xl font-medium mt-8 mb-4">Estadísticas</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <Balances balances={balances} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos totales</CardTitle>
          </CardHeader>
          <CardContent>
            <GastosTotales gastosTotales={gastosTotales} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deuda total pagada</CardTitle>
          </CardHeader>
          <CardContent>
            <DeudasPendientes gastoTotal={gastoTotal} deudaTotal={deudaTotal} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
