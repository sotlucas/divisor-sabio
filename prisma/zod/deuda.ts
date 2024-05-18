import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteGasto, relatedGastoSchema } from "./index"

export const deudaSchema = z.object({
  id: z.string(),
  deudorId: z.string(),
  gastoId: z.string(),
  monto: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteDeuda extends z.infer<typeof deudaSchema> {
  deudor: CompleteUser
  gasto: CompleteGasto
}

/**
 * relatedDeudaSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDeudaSchema: z.ZodSchema<CompleteDeuda> = z.lazy(() => deudaSchema.extend({
  deudor: relatedUserSchema,
  gasto: relatedGastoSchema,
}))
