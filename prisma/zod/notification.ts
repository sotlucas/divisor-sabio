import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteEvento, relatedEventoSchema } from "./index"

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  message: z.string(),
  read: z.boolean(),
  createdAt: z.date(),
  eventoId: z.string(),
})

export interface CompleteNotification extends z.infer<typeof notificationSchema> {
  user: CompleteUser
  evento: CompleteEvento
}

/**
 * relatedNotificationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedNotificationSchema: z.ZodSchema<CompleteNotification> = z.lazy(() => notificationSchema.extend({
  user: relatedUserSchema,
  evento: relatedEventoSchema,
}))
