"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

import { signUpAction } from "@/lib/actions/users";

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

export default function SignUpPage() {
  const [state, formAction] = useFormState(signUpAction, {
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
          <CardTitle className="text-center">Creá tu cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthFormError state={state} />
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input name="name" type="name" id="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" id="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input type="password" name="password" id="password" required />
              </div>
              <SubmitButton />
            </div>
          </form>
          <div className="mt-4 text-muted-foreground text-center text-sm">
            ¿Ya tenés cuenta?{" "}
            <Link
              href="/sign-in"
              className="text-secondary-foreground underline"
            >
              Iniciá sesión
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
  const text = pending ? "Creando cuenta" : "Crear cuenta";
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {text}
    </Button>
  );
};
