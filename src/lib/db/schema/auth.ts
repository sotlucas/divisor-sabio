import { z } from "zod";

export const authenticationSchema = z.object({
  name: z.string().max(31),
  email: z.string().email().min(5).max(31),
  password: z
    .string()
    .min(4, { message: "debe tener mínimo 4 caracteres" })
    .max(15, { message: "no puede tener más de 15 caracteres" }),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().min(4).optional(),
});

export type NameEmailAndPassword = z.infer<typeof authenticationSchema>;
