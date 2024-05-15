import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { type Cookie } from "lucia";

import { validateRequest } from "./lucia";
import { NameEmailAndPassword, authenticationSchema } from "../db/schema/auth";

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      username?: string;
    };
  } | null;
};
export const getUserAuth = async (): Promise<AuthSession> => {
  const { session, user } = await validateRequest();
  if (!session) return { session: null };
  return {
    session: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
  };
};

export const checkAuth = async () => {
  const { session } = await validateRequest();
  if (!session) redirect("/sign-in");
};

export const genericError = { error: "Error, por favor intentá de nuevo." };

export const setAuthCookie = (cookie: Cookie) => {
  // cookies().set(cookie.name, cookie.value, cookie.attributes); // <- suggested approach from the docs, but does not work with `next build` locally
  cookies().set(cookie);
};

const getErrorMessage = (errors: any): string => {
  if (errors.email) return "Email inválido";
  if (errors.password) return "Contraseña inválida - " + errors.password[0];
  return ""; // return a default error message or an empty string
};

export const validateAuthFormData = (
  formData: FormData
):
  | { data: NameEmailAndPassword; error: null }
  | { data: null; error: string } => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const result = authenticationSchema.safeParse({ name, email, password });

  if (!result.success) {
    return {
      data: null,
      error: getErrorMessage(result.error.flatten().fieldErrors),
    };
  }

  return { data: result.data, error: null };
};
