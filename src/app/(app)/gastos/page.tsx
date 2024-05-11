import { Suspense } from "react";

import Loading from "@/app/loading";
import GastoList from "@/components/gastos/GastoList";
import { getGastos } from "@/lib/api/gastos/queries";
import { getEventos } from "@/lib/api/eventos/queries";

export const revalidate = 0;

export default async function GastosPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Gastos</h1>
        </div>
        <Gastos />
      </div>
    </main>
  );
}

const Gastos = async () => {
  const { gastos } = await getGastos();
  const { eventos } = await getEventos();

  return (
    <Suspense fallback={<Loading />}>
      <GastoList gastos={gastos} eventos={eventos} />
    </Suspense>
  );
};
