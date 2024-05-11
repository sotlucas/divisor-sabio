import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getGastoById } from "@/lib/api/gastos/queries";
import { getEventos } from "@/lib/api/eventos/queries";
import OptimisticGasto from "./OptimisticGasto";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function GastoPage({
  params,
}: {
  params: { gastoId: string };
}) {
  return (
    <main className="overflow-auto">
      <Gasto id={params.gastoId} />
    </main>
  );
}

const Gasto = async ({ id }: { id: string }) => {
  const { gasto } = await getGastoById(id);
  const { eventos } = await getEventos();

  if (!gasto) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="gastos" />
        <OptimisticGasto gasto={gasto} eventos={eventos} />
      </div>
    </Suspense>
  );
};
