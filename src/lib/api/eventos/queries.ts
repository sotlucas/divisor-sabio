import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { Evento, type EventoId, eventoIdSchema } from "@/lib/db/schema/eventos";

export const getEventos = async (): Promise<{ eventos: Evento[] }> => {
  const { session } = await getUserAuth();
  const e = await db.evento.findMany({
    where: {
      participantes: {
        some: {
          id: session?.user.id!,
        },
      },
    },
  });
  return { eventos: e };
};

export const getEventoById = async (id: EventoId) => {
  const { id: eventoId } = eventoIdSchema.parse({ id });
  const e = await db.evento.findFirst({
    where: {
      id: eventoId,
    },
  });
  if (e === null) return { evento: null };
  return { evento: e };
};

export const getEventoByIdWithGastos = async (id: EventoId) => {
  const { session } = await getUserAuth();
  const { id: eventoId } = eventoIdSchema.parse({ id });
  const e = await db.evento.findFirst({
    where: {
      id: eventoId,
      participantes: {
        some: {
          id: session?.user.id!,
        },
      },
    },
    include: {
      gastos: { include: { evento: true } },
      participantes: { select: { id: true, name: true, email: true } },
    },
  });
  if (e === null) return { evento: null };
  const { gastos, participantes, ...evento } = e;

  return { evento, participantes, gastos: gastos };
};
