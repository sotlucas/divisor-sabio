import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getEventoById } from "@/lib/api/eventos/queries";
import OptimisticEvento from "./OptimisticEvento";
import { checkAuth } from "@/lib/auth/utils";


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

  const { evento } = await getEventoById(id);
  

  if (!evento) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="eventos" />
        <OptimisticEvento evento={evento}  />
      </div>
    </Suspense>
  );
};
