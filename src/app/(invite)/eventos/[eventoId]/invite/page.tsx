import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getEventoById } from "@/lib/api/eventos/queries";
import { AuthSession, checkAuth, getUserAuth } from "@/lib/auth/utils";

import Loading from "@/app/loading";
import { OptimisticInvite } from "./OptimisticInvite";

export const revalidate = 0;

export default async function InvitePage({
  params,
}: {
  params: { eventoId: string };
}) {
  const { session } = await getUserAuth();
  return (
    <main className="overflow-auto">
      <Invite id={params.eventoId} session={session} />
    </main>
  );
}

const Invite = async ({
  id,
  session,
}: {
  id: string;
  session: AuthSession["session"];
}) => {
  await checkAuth();

  const { evento } = await getEventoById(id);
  console.log("evento", evento);

  if (!evento) notFound();

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <OptimisticInvite evento={evento} session={session} />
      </div>
    </Suspense>
  );
};
