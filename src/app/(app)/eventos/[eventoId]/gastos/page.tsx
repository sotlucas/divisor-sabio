import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";
import GastoList from "@/components/gastos/GastoList";

export const revalidate = 0;

export default async function GastosPage({
  params,
}: {
  params: { eventoId: string };
}) {
  return (
    <main className="overflow-auto">
      <Gastos id={params.eventoId} />
    </main>
  );
}

const Gastos = async ({ id }: { id: string }) => {
  await checkAuth();
  const {session} = await getUserAuth()

  const { evento, gastos, participantes } = await getEventoByIdWithGastos(id);

  if (!evento) notFound();
  return (
    <div className="relative mt-8">
      <h3 className="text-xl font-medium mb-4">Gastos</h3>
      <GastoList
        participantes={participantes}
        eventos={[]}
        evento={evento}
        gastos={gastos}
        sessionUserId={session?.user.id!}
      />
    </div>
  );
};
