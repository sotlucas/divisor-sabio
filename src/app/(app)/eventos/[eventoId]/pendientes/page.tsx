import { checkAuth, getUserAuth } from "@/lib/auth/utils";
import GastoPendienteList from "@/components/gastoPendiente/GastoPendienteList";
import { getEventoByIdWithGastosPendientes } from "@/lib/api/eventos/queries";

export const revalidate = 0;

export default async function PendientesPage({
  params,
}: {
  params: { eventoId: string };
}) {
  return (
    <main>
      <Pendientes eventoId={params.eventoId} />
    </main>
  );
}

const Pendientes = async ({ eventoId }: { eventoId: string }) => {
  await checkAuth();

  const { evento, gastosPendientes, participantes } =
    await getEventoByIdWithGastosPendientes(eventoId);

  return (
    <div className="relative mt-8">
      <h3 className="text-xl font-medium mb-4">Pendientes</h3>
      <GastoPendienteList
        participantes={participantes}
        gastosPendientes={gastosPendientes}
        evento={evento}
      />
    </div>
  );
};
