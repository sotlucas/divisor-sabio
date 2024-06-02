import * as z from "zod"
import { CompleteEvento, relatedEventoSchema, CompleteUser, relatedUserSchema, CompleteDeuda, relatedDeudaSchema } from "./index"

export const gastoSchema = z.object({
  id: z.string(),
  monto: z.number(),
  nombre: z.string(),
  fecha: z.date(),
  eventoId: z.string(),
  pagadorId: z.string(),
  esDeudaPagada: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteGasto extends z.infer<typeof gastoSchema> {
  evento: CompleteEvento
  pagador: CompleteUser
  deudas: CompleteDeuda[]
}

/**
 * relatedGastoSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedGastoSchema: z.ZodSchema<CompleteGasto> = z.lazy(() => gastoSchema.extend({
  evento: relatedEventoSchema,
  pagador: relatedUserSchema,
  deudas: relatedDeudaSchema.array(),
}))
