import * as z from "zod"
import { CompleteSession, relatedSessionSchema, CompleteEvento, relatedEventoSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  hashedPassword: z.string(),
  name: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  sessions: CompleteSession[]
  eventos: CompleteEvento[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  sessions: relatedSessionSchema.array(),
  eventos: relatedEventoSchema.array(),
}))
