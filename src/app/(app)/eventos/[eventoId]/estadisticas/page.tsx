import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import { checkAuth } from "@/lib/auth/utils";
import { getBalancesByEvento } from "@/lib/api/calculadora/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Balances from "../Balances";

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

const Estadisticas = async ({ id }: { id: string }) => {
  await checkAuth();

  const { evento, participantes } = await getEventoByIdWithGastos(id);
  const { balances } = await getBalancesByEvento(id);

  if (!evento) notFound();
  return (
    <div className="relative mt-8">
      <h3 className="text-xl font-medium mt-8 mb-4">Estadísticas</h3>
      <div className="flex flex-col space-y-4">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <Balances balances={balances} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
