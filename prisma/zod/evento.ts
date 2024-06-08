import * as z from "zod"
import { CompleteGasto, relatedGastoSchema, CompleteUser, relatedUserSchema, CompleteGastoPendiente, relatedGastoPendienteSchema } from "./index"

export const eventoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string().nullish(),
  fechaInicio: z.date().nullish(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteEvento extends z.infer<typeof eventoSchema> {
  gastos: CompleteGasto[]
  participantes: CompleteUser[]
  pendientes: CompleteGastoPendiente[]
}

/**
 * relatedEventoSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedEventoSchema: z.ZodSchema<CompleteEvento> = z.lazy(() => eventoSchema.extend({
  gastos: relatedGastoSchema.array(),
  participantes: relatedUserSchema.array(),
  pendientes: relatedGastoPendienteSchema.array(),
}))
