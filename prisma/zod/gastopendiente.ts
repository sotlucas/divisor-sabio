import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteEvento, relatedEventoSchema } from "./index"

export const gastoPendienteSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  monto: z.number().int(),
  responsableId: z.string().nullish(),
  eventoId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteGastoPendiente extends z.infer<typeof gastoPendienteSchema> {
  responsable?: CompleteUser | null
  evento?: CompleteEvento | null
}

/**
 * relatedGastoPendienteSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedGastoPendienteSchema: z.ZodSchema<CompleteGastoPendiente> = z.lazy(() => gastoPendienteSchema.extend({
  responsable: relatedUserSchema.nullish(),
  evento: relatedEventoSchema.nullish(),
}))
