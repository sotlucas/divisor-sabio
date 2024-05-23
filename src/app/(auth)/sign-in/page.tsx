"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

import { signInAction } from "@/lib/actions/users";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthFormError from "@/components/auth/AuthFormError";

export default function SignInPage() {
  const [state, formAction] = useFormState(signInAction, {
    error: "",
  });

  return (
    <main className="max-w-lg mx-auto my-4 bg-popover p-10">
      <div className="text-2xl font-bold text-center">
        <img className="img-center" src="/divisor_sabio.png" style={{margin: "auto"}} alt="logo divisor sabio" />
        <h1 className="text-2xl font-bold text-center">Bienvenido a Divisor Sabio,</h1>
        <p>no te gastes calculando gastos</p>
      </div>
      <br />
      <h3 className="text-2xl font-bold text-center">Ingresá a tu cuenta</h3>
      <AuthFormError state={state} />
      <form action={formAction}>
        <Label htmlFor="email" className="text-muted-foreground">
          Email
        </Label>
        <Input name="email" id="email" type="email" required />
        <br />
        <Label htmlFor="password" className="text-muted-foreground">
          Contraseña
        </Label>
        <Input type="password" name="password" id="password" required />
        <br />
        <SubmitButton />
      </form>
      <div className="mt-4 text-sm text-center text-muted-foreground">
        ¿No tenés cuenta?{" "}
        <Link
          href="/sign-up"
          className="text-accent-foreground underline hover:text-primary"
        >
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const text = pending ? "Ingresando" : "Ingresar";
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {text}
    </Button>
  );
};
