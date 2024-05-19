import { PropsWithChildren, Suspense } from "react";
import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import OptimisticEvento from "./OptimisticEvento";
import { checkAuth } from "@/lib/auth/utils";

import Loading from "@/app/loading";
import OptimisticParticipantes from "./OptimisticParticipantes";
import { GroupedTabs } from "./GroupedTabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

export const revalidate = 0;

export default async function EventoPage({
  children,
  params,
}: PropsWithChildren<{
  params: { eventoId: string };
}>) {
  return (
    <main className="overflow-auto">
      <Evento id={params.eventoId}>{children}</Evento>
    </main>
  );
}

const Evento = async ({ id, children }: { id: string; children: any }) => {
  await checkAuth();

  const { evento, participantes } = await getEventoByIdWithGastos(id);

  if (!evento) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <Button variant={"ghost"} asChild>
          <Link href={"/eventos"}>
            <ChevronLeftIcon />
          </Link>
        </Button>
        <OptimisticEvento evento={evento} />
      </div>
      <div className="relative ml-4 flex items-center justify-between -mb-5">
        <GroupedTabs eventoId={id} />
        <OptimisticParticipantes
          participantes={participantes}
          evento={evento}
        />
      </div>
      <div className="relative mx-4">{children}</div>
    </Suspense>
  );
};
