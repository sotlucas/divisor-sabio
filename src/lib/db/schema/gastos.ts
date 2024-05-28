import { gastoSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getGastos } from "@/lib/api/gastos/queries";

// Schema for gastos - used to validate API requests
const baseSchema = gastoSchema.omit(timestamps);

export const insertGastoSchema = baseSchema.omit({ id: true });
export const insertGastoParams = baseSchema
  .extend({
    monto: z.coerce.number(),
    fecha: z.coerce.date(),
    eventoId: z.coerce.string().min(1),
    deudoresIds: z.array(z.string()).min(1),
  })
  .omit({
    id: true,
  });

export const updateGastoSchema = baseSchema;
export const updateGastoParams = updateGastoSchema.extend({
  monto: z.coerce.number(),
  fecha: z.coerce.date(),
  eventoId: z.coerce.string().min(1),
  deudoresIds: z.array(z.string()),
});
export const gastoIdSchema = baseSchema.pick({ id: true });

// Types for gastos - used to type API request params and within Components
export type Gasto = z.infer<typeof gastoSchema>;
export type NewGasto = z.infer<typeof insertGastoSchema>;
export type NewGastoParams = z.infer<typeof insertGastoParams>;
export type UpdateGastoParams = z.infer<typeof updateGastoParams>;
export type GastoId = z.infer<typeof gastoIdSchema>["id"];

// this type infers the return from getGastos() - meaning it will include any joins
export type CompleteGasto = Awaited<
  ReturnType<typeof getGastos>
>["gastos"][number];
