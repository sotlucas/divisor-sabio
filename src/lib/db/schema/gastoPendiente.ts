import { gastoPendienteSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getGastoPendientes } from "@/lib/api/gastoPendiente/queries";

// Schema for gastoPendiente - used to validate API requests
const baseSchema = gastoPendienteSchema.omit(timestamps);

export const insertGastoPendienteSchema = baseSchema.omit({ id: true });
export const insertGastoPendienteParams = baseSchema
  .extend({
    monto: z.coerce.number(),
    eventoId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateGastoPendienteSchema = baseSchema;
export const updateGastoPendienteParams = updateGastoPendienteSchema.extend({
  monto: z.coerce.number(),
  eventoId: z.coerce.string().min(1),
});
export const gastoPendienteIdSchema = baseSchema.pick({ id: true });

// Types for gastoPendiente - used to type API request params and within Components
export type GastoPendiente = z.infer<typeof gastoPendienteSchema>;
export type NewGastoPendiente = z.infer<typeof insertGastoPendienteSchema>;
export type NewGastoPendienteParams = z.infer<
  typeof insertGastoPendienteParams
>;
export type UpdateGastoPendienteParams = z.infer<
  typeof updateGastoPendienteParams
>;
export type GastoPendienteId = z.infer<typeof gastoPendienteIdSchema>["id"];

// this type infers the return from getGastoPendiente() - meaning it will include any joins
export type CompleteGastoPendiente = Awaited<
  ReturnType<typeof getGastoPendientes>
>["gastoPendiente"][number];
