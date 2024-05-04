import { eventoSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getEventos } from "@/lib/api/eventos/queries";


// Schema for eventos - used to validate API requests
const baseSchema = eventoSchema.omit(timestamps)

export const insertEventoSchema = baseSchema.omit({ id: true });
export const insertEventoParams = baseSchema.extend({
  fechaInicio: z.coerce.date()
}).omit({ 
  id: true,
  userId: true
});

export const updateEventoSchema = baseSchema;
export const updateEventoParams = updateEventoSchema.extend({
  fechaInicio: z.coerce.date()
}).omit({ 
  userId: true
});
export const eventoIdSchema = baseSchema.pick({ id: true });

// Types for eventos - used to type API request params and within Components
export type Evento = z.infer<typeof eventoSchema>;
export type NewEvento = z.infer<typeof insertEventoSchema>;
export type NewEventoParams = z.infer<typeof insertEventoParams>;
export type UpdateEventoParams = z.infer<typeof updateEventoParams>;
export type EventoId = z.infer<typeof eventoIdSchema>["id"];
    
// this type infers the return from getEventos() - meaning it will include any joins
export type CompleteEvento = Awaited<ReturnType<typeof getEventos>>["eventos"][number];

