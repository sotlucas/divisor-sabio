import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import { checkAuth } from "@/lib/auth/utils";
import DeudaList from "@/components/deudas/DeudaList";

export const revalidate = 0;

export default async function DeudasPage({
  params,
}: {
  params: { eventoId: string };
}) {
  return (
    <main className="overflow-auto">
      <Deudas id={params.eventoId} />
    </main>
  );
}

const Deudas = async ({ id }: { id: string }) => {
  await checkAuth();

  const { evento } = await getEventoByIdWithGastos(id);

  if (!evento) notFound();
  return (
    <div className="relative mt-8">
      <h3 className="text-xl font-medium mb-4">Deudas</h3>
      <DeudaList deudas={[]} />
    </div>
  );
};
