"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

import { signUpAction } from "@/lib/actions/users";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthFormError from "@/components/auth/AuthFormError";

export default function SignUpPage() {
  const [state, formAction] = useFormState(signUpAction, {
    error: "",
  });

  return (
    <main className="max-w-lg mx-auto my-4 bg-popover p-10">
      <h1 className="text-2xl font-bold text-center">Creá tu cuenta</h1>
      <AuthFormError state={state} />
      <form action={formAction}>
        <Label htmlFor="email" className="text-muted-foreground">
          Email
        </Label>
        <Input name="email" type="email" id="email" required />
        <br />
        <Label htmlFor="password" className="text-muted-foreground">
          Contraseña
        </Label>
        <Input type="password" name="password" id="password" required />
        <br />
        <SubmitButton />
      </form>
      <div className="mt-4 text-muted-foreground text-center text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link href="/sign-in" className="text-secondary-foreground underline">
          Iniciá sesión
        </Link>
      </div>
    </main>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const text = pending ? "Creando cuenta" : "Crear cuenta";
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {text}
    </Button>
  );
};
