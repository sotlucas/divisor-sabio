import { Suspense } from "react";

import Loading from "@/app/loading";
import EventoList from "@/components/eventos/EventoList";
import { getEventos } from "@/lib/api/eventos/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function EventosPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Eventos</h1>
        </div>
        <Eventos />
      </div>
    </main>
  );
}

const Eventos = async () => {
  await checkAuth();

  const { eventos } = await getEventos();
  
  return (
    <Suspense fallback={<Loading />}>
      <EventoList eventos={eventos}  />
    </Suspense>
  );
};
