import * as z from "zod"
import { CompleteEvento, relatedEventoSchema, CompleteUser, relatedUserSchema } from "./index"

export const gastoPendienteSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  eventoId: z.string().nullish(),
  responsableId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteGastoPendiente extends z.infer<typeof gastoPendienteSchema> {
  evento?: CompleteEvento | null
  responsable?: CompleteUser | null
}

/**
 * relatedGastoPendienteSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedGastoPendienteSchema: z.ZodSchema<CompleteGastoPendiente> = z.lazy(() => gastoPendienteSchema.extend({
  evento: relatedEventoSchema.nullish(),
  responsable: relatedUserSchema.nullish(),
}))
