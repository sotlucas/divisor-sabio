import * as z from "zod"

export const eventoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string().nullish(),
  fechaInicio: z.date().nullish(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
