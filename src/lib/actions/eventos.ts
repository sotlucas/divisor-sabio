"use server";

import { revalidatePath } from "next/cache";
import {
  createEvento,
  deleteEvento,
  updateEvento,
  addParticipant,
  deleteParticipant,
} from "@/lib/api/eventos/mutations";
import {
  EventoId,
  NewEventoParams,
  UpdateEventoParams,
  eventoIdSchema,
  insertEventoParams,
  updateEventoParams,
} from "@/lib/db/schema/eventos";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, por favor intentá de nuevo.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateEventos = () => revalidatePath("/eventos");
const revalidateParticipantes = () => revalidatePath("/participantes");

export const createEventoAction = async (input: NewEventoParams) => {
  try {
    const payload = insertEventoParams.parse(input);
    await createEvento(payload);
    revalidateEventos();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateEventoAction = async (input: UpdateEventoParams) => {
  try {
    const payload = updateEventoParams.parse(input);
    await updateEvento(payload.id, payload);
    revalidateEventos();
  } catch (e) {
    return handleErrors(e);
  }
};

export const addParticipantAction = async (eventoId: EventoId) => {
  try {
    await addParticipant(eventoId);
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteParticipantAction = async (
  eventoId: EventoId,
  participantId: string
) => {
  try {
    await deleteParticipant(eventoId, participantId);
    revalidateParticipantes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteEventoAction = async (input: EventoId) => {
  try {
    const payload = eventoIdSchema.parse({ id: input });
    await deleteEvento(payload.id);
    revalidateEventos();
  } catch (e) {
    return handleErrors(e);
  }
};
