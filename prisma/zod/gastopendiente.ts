import * as z from "zod"
import { CompleteEvento, relatedEventoSchema, CompleteUser, relatedUserSchema } from "./index"

export const gastoPendienteSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  eventoId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().nullish(),
})

export interface CompleteGastoPendiente extends z.infer<typeof gastoPendienteSchema> {
  evento?: CompleteEvento | null
  User?: CompleteUser | null
}

/**
 * relatedGastoPendienteSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedGastoPendienteSchema: z.ZodSchema<CompleteGastoPendiente> = z.lazy(() => gastoPendienteSchema.extend({
  evento: relatedEventoSchema.nullish(),
  User: relatedUserSchema.nullish(),
}))
