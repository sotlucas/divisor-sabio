import { PropsWithChildren, Suspense } from "react";
import { notFound } from "next/navigation";

import { getEventoByIdWithGastos } from "@/lib/api/eventos/queries";
import OptimisticEvento from "./(components)/OptimisticEvento";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";

import Loading from "@/app/loading";
import OptimisticParticipantes from "./(components)/OptimisticParticipantes";
import { GroupedTabs } from "./(components)/GroupedTabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import OptimisticBalances from "./(components)/OptimisticBalances";
import { getBalancesByEvento } from "@/lib/api/calculadora/queries";
import OptimisticLiquidarDeudas from "./(components)/OptimisticLiquidarDeudas";

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
  const { session } = await getUserAuth();

  const { evento, participantes } = await getEventoByIdWithGastos(id);
  const { balances } = await getBalancesByEvento(id);

  if (!evento) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <Button variant={"ghost"} asChild>
          <Link href={"/eventos"}>
            <ChevronLeftIcon />
          </Link>
        </Button>
        <OptimisticEvento
          evento={evento}
          isOwner={session?.user.id == evento.userId}
        />
      </div>
      <div className="relative mr-4 ml-4 flex items-center justify-between mt-6 -mb-1 flex-wrap gap-4">
        <GroupedTabs eventoId={id} />
        <div className="flex flex-wrap gap-2">
          <OptimisticLiquidarDeudas
            participantes={participantes}
            eventoId={evento.id}
          />
          <OptimisticBalances balances={balances} />
          <OptimisticParticipantes
            participantes={participantes}
            evento={evento}
            isOwner={session?.user.id == evento.userId}
          />
        </div>
      </div>
      <div className="relative mx-4">{children}</div>
    </Suspense>
  );
};
