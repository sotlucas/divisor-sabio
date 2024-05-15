import { db } from "@/lib/db/index";
import {
  EventoId,
  NewEventoParams,
  UpdateEventoParams,
  updateEventoSchema,
  insertEventoSchema,
  eventoIdSchema,
} from "@/lib/db/schema/eventos";
import { getUserAuth } from "@/lib/auth/utils";

export const createEvento = async (evento: NewEventoParams) => {
  const { session } = await getUserAuth();
  const newEvento = insertEventoSchema.parse({
    ...evento,
    userId: session?.user.id!,
  });
  try {
    const e = await db.evento.create({
      data: {
        ...newEvento,
        participantes: { connect: { id: session?.user.id! } },
      },
    });
    return { evento: e };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const addParticipant = async (id: EventoId) => {
  const { session } = await getUserAuth();
  const { id: eventoId } = eventoIdSchema.parse({ id });
  try {
    const e = await db.evento.update({
      data: {
        participantes: { connect: { id: session?.user.id! } },
      },
      where: { id: eventoId },
    });
    return { evento: e };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateEvento = async (
  id: EventoId,
  evento: UpdateEventoParams
) => {
  const { session } = await getUserAuth();
  const { id: eventoId } = eventoIdSchema.parse({ id });
  const newEvento = updateEventoSchema.parse({
    ...evento,
    userId: session?.user.id!,
  });
  try {
    const e = await db.evento.update({
      where: { id: eventoId, userId: session?.user.id! },
      data: newEvento,
    });
    return { evento: e };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteEvento = async (id: EventoId) => {
  const { session } = await getUserAuth();
  const { id: eventoId } = eventoIdSchema.parse({ id });
  try {
    const e = await db.evento.delete({
      where: { id: eventoId, userId: session?.user.id! },
    });
    return { evento: e };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
