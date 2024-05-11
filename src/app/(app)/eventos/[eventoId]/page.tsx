import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import OptimisticEvento from "./OptimisticEvento";
import { checkAuth } from "@/lib/auth/utils";
import GastoList from "@/components/gastos/GastoList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function EventoPage({
  params,
}: {
  params: { eventoId: string };
}) {
  return (
    <main className="overflow-auto">
      <Evento id={params.eventoId} />
    </main>
  );
}

const Evento = async ({ id }: { id: string }) => {
  await checkAuth();

  const { evento, gastos } = await getEventoByIdWithGastos(id);

  if (!evento) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="eventos" />
        <OptimisticEvento evento={evento} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">Gastos</h3>
        <GastoList eventos={[]} eventoId={evento.id} gastos={gastos} />
      </div>
    </Suspense>
  );
};
