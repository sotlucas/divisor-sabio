"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

import { signInAction } from "@/lib/actions/users";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthFormError from "@/components/auth/AuthFormError";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
  const [state, formAction] = useFormState(signInAction, {
    error: "",
  });

  return (
    <main className="max-w-lg mx-auto my-4 bg-popover p-10">
      <div className="flex flex-col items-center space-y-3 text-center mb-12">
        <Image
          className="img-center"
          src="/divisor_sabio.png"
          width="193"
          height="191"
          alt="logo divisor sabio"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Divisor Sabio
        </h1>
        <p className="text-balance text-muted-foreground">
          ¡No te gastes calculando gastos!
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Ingresá a tu cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthFormError state={state} />
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input type="password" name="password" id="password" required />
              </div>
              <SubmitButton />
            </div>
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
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
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
