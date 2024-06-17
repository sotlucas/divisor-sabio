import * as z from "zod"
import { CompleteSession, relatedSessionSchema, CompleteEvento, relatedEventoSchema, CompleteGasto, relatedGastoSchema, CompleteDeuda, relatedDeudaSchema, CompleteNotification, relatedNotificationSchema, CompleteGastoPendiente, relatedGastoPendienteSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  hashedPassword: z.string(),
  name: z.string().nullish(),
  recibirNotificaciones: z.boolean(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  sessions: CompleteSession[]
  eventos: CompleteEvento[]
  gastos: CompleteGasto[]
  deudas: CompleteDeuda[]
  notifications: CompleteNotification[]
  pendientes: CompleteGastoPendiente[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  sessions: relatedSessionSchema.array(),
  eventos: relatedEventoSchema.array(),
  gastos: relatedGastoSchema.array(),
  deudas: relatedDeudaSchema.array(),
  notifications: relatedNotificationSchema.array(),
  pendientes: relatedGastoPendienteSchema.array(),
}))
