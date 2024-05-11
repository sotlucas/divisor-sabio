import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { Evento, type EventoId, eventoIdSchema } from "@/lib/db/schema/eventos";

export const getEventos = async (): Promise<{ eventos: Evento[] }> => {
  const { session } = await getUserAuth();
  const e = await db.evento.findMany({ where: { userId: session?.user.id! } });
  return { eventos: e };
};

export const getEventoById = async (id: EventoId) => {
  const { session } = await getUserAuth();
  const { id: eventoId } = eventoIdSchema.parse({ id });
  const e = await db.evento.findFirst({
    where: { id: eventoId, userId: session?.user.id! },
  });
  return { evento: e };
};

export const getEventoByIdWithGastos = async (id: EventoId) => {
  const { session } = await getUserAuth();
  const { id: eventoId } = eventoIdSchema.parse({ id });
  const e = await db.evento.findFirst({
    where: { id: eventoId, userId: session?.user.id! },
    include: { gastos: { include: { evento: true } } },
  });
  if (e === null) return { evento: null };
  const { gastos, ...evento } = e;

  return { evento, gastos: gastos };
};
