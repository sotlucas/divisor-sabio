import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getEventoById } from "@/lib/api/eventos/queries";
import { checkAuth } from "@/lib/auth/utils";

import Loading from "@/app/loading";
import { OptimisticInvite } from "./OptimisticInvite";

export const revalidate = 0;

export default async function EventoPage({
  params,
}: {
  params: { eventoId: string };
}) {
  return (
    <main className="overflow-auto">
      <Invite id={params.eventoId} />
    </main>
  );
}

const Invite = async ({ id }: { id: string }) => {
  await checkAuth();

  const { evento } = await getEventoById(id);

  if (!evento) notFound();

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <OptimisticInvite evento={evento} />
      </div>
    </Suspense>
  );
};
